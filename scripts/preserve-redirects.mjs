// Enhance Astro's static redirects and keep their old Markdown URLs usable.
import { copyFileSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Read the destination from Astro's existing link; never interpolate URL input
// into JavaScript. URL setters keep incoming query strings and fragments as data.
export const redirectScript = `<script data-preserve-redirect>
(() => {
  const link = document.querySelector('body > a[href]');
  const destination = new URL(link.getAttribute('href'), location.href);
  if (destination.origin !== location.origin) return;
  if (!destination.search) destination.search = location.search;
  if (!destination.hash) destination.hash = location.hash;
  location.replace(destination.href);
})();
</script>`;

function containedPath(root, path) {
  const result = resolve(root, path);
  const remainder = relative(root, result);
  if (remainder === '..' || remainder.startsWith(`..${sep}`) || isAbsolute(remainder)) {
    throw new Error(`Path escapes build directory: ${path}`);
  }
  return result;
}

function collectFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not supported in build output: ${path}`);
    if (entry.isDirectory()) files.push(...collectFiles(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

function decodeAttribute(value) {
  const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, name) => {
    if (name[0] !== '#') return entities[name.toLowerCase()];
    return String.fromCodePoint(name[1].toLowerCase() === 'x'
      ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10));
  });
}

function routeWithoutBase(href, base) {
  // Reject ambiguous separators and traversal before URL normalization hides them.
  const rawPath = decodeURIComponent(href.split(/[?#]/, 1)[0]);
  if (!href.startsWith('/') || href.startsWith('//') || /[\\\0]/.test(rawPath) ||
      rawPath.split('/').some((part) => part === '.' || part === '..')) {
    throw new Error(`Invalid local redirect destination: ${href}`);
  }
  const origin = 'https://redirect.invalid';
  const destination = new URL(href, origin);
  if (destination.origin !== origin) throw new Error(`External redirect destination: ${href}`);
  const path = decodeURIComponent(destination.pathname);
  if (base && path !== base && !path.startsWith(`${base}/`)) {
    throw new Error(`Redirect destination is outside BASE_PATH: ${href}`);
  }
  return path.slice(base.length).replace(/^\/+|\/+$/g, '');
}

export function preserveRedirects({ distDir = 'dist', basePath = process.env.BASE_PATH || '/' } = {}) {
  const root = resolve(distDir);
  if (lstatSync(root).isSymbolicLink()) throw new Error('Build directory must not be a symlink');
  const base = basePath === '/' ? '' : `/${basePath.replace(/^\/+|\/+$/g, '')}`;
  if (/[?#\\\0]/.test(base) || base.split('/').some((part) => part === '.' || part === '..')) {
    throw new Error(`Invalid BASE_PATH: ${basePath}`);
  }
  const files = collectFiles(root);
  const existingFiles = new Set(files);
  const aliases = new Set();
  const plans = [];

  for (const file of files.filter((path) => path.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    if (!html.includes('<title>Redirecting to: ')) continue;
    const refresh = html.match(/<meta http-equiv="refresh" content="[^"]*">/);
    const link = html.match(/<a href="([^"]+)">Redirecting /);
    if (!refresh || !link || !html.includes('<meta name="robots" content="noindex">') ||
        !html.includes('<link rel="canonical" ')) {
      throw new Error(`Unrecognized Astro redirect document: ${file}`);
    }
    const route = routeWithoutBase(decodeAttribute(link[1]), base);
    const sourceRoute = relative(root, file).replaceAll(sep, '/')
      .replace(/(?:\/index)?\.html$/, '');
    let markdown;
    let alias;
    if (route) {
      markdown = containedPath(root, `${route}.md`);
      alias = containedPath(root, `${sourceRoute}.md`);
      if (!existingFiles.has(markdown)) throw new Error(`Redirect has no canonical Markdown export: ${markdown}`);
      if (existingFiles.has(alias) || aliases.has(alias)) throw new Error(`Markdown alias would overwrite an existing file: ${alias}`);
      aliases.add(alias);
    }
    plans.push({ file, markdown, alias, html: html
      .replace(refresh[0], `<noscript>${refresh[0]}</noscript>`)
      .replace('</body>', `${redirectScript}</body>`) });
  }

  // Validate every destination and collision before changing any build output.
  for (const plan of plans) {
    writeFileSync(plan.file, plan.html);
    if (plan.alias) {
      mkdirSync(dirname(plan.alias), { recursive: true });
      copyFileSync(plan.markdown, plan.alias);
    }
  }
  return { redirects: plans.length, markdownAliases: aliases.size };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { redirects, markdownAliases } = preserveRedirects();
  console.log(`Preserved fragments for ${redirects} redirects and created ${markdownAliases} Markdown aliases`);
}
