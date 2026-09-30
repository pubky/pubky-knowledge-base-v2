import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromMarkdown } from 'mdast-util-from-markdown';

const EXCEPTIONS_FILE = 'config/github-link-exceptions.json';
const PINNED_LINK = /^https:\/\/github\.com\/pubky\/pubky-homeserver\/(?:blob|tree)\/\{\{pinned_homeserver_release\}\}\/[^\s?#{}]+(?:\?[^\s#{}]*)?(?:#[^\s{}]*)?$/;

function parseUrl(url) {
  try {
    return new URL(url.startsWith('//') ? `https:${url}` : url);
  } catch {
    return null;
  }
}

export function isHomeserverGitHubUrl(url) {
  const parsed = parseUrl(url);
  if (!parsed) {
    // Keep a malformed attempt at a Homeserver URL visible to the checker.
    return /^https?:\/\/(?:[^/?#@]*@)?github\.com(?::[^/?#]*)?\/pubky\/pubky-homeserver(?:[/?#]|$)/i.test(url);
  }
  let owner;
  let repository;
  try {
    owner = decodeURIComponent(parsed.pathname.split('/')[1]).toLowerCase();
    repository = decodeURIComponent(parsed.pathname.split('/')[2]).toLowerCase();
  } catch {
    return false;
  }
  return parsed.hostname.toLowerCase() === 'github.com' && owner === 'pubky' && repository === 'pubky-homeserver';
}

export function isPinnedGitHubUrl(url) {
  if (!PINNED_LINK.test(url) || /[\\\u0000-\u0020\u007f]/.test(url)) return false;
  try {
    // Dot segments can change the meaning of an apparently pinned path.
    return !new URL(url).pathname.split('/').some((part) => {
      const decoded = decodeURIComponent(part);
      return decoded === '.' || decoded === '..' || decoded.includes('/');
    }) && !url.split(/[?#]/, 1)[0].split('/').some((part) => {
      const decoded = decodeURIComponent(part);
      return decoded === '.' || decoded === '..';
    });
  } catch {
    return false;
  }
}

export function validateGitHubLinkExceptions(entries) {
  if (!Array.isArray(entries)) throw new Error('GitHub link exceptions must be an array of {url, reason} entries.');
  const exceptions = new Map();
  for (const entry of entries) {
    if (!entry || typeof entry.url !== 'string' || typeof entry.reason !== 'string' || !entry.reason.trim()) {
      throw new Error('Every GitHub link exception needs an exact URL and a nonempty reason.');
    }
    const parsed = parseUrl(entry.url);
    if (!parsed || !isHomeserverGitHubUrl(entry.url) || parsed.protocol !== 'https:' || parsed.username || parsed.password ||
      !entry.url.startsWith('https://github.com/') || /[\s\\*{}]/.test(entry.url)) {
      throw new Error(`Exception must be an exact HTTPS URL under github.com/pubky/pubky-homeserver: ${entry.url}`);
    }
    if (exceptions.has(entry.url)) throw new Error(`Duplicate GitHub link exception: ${entry.url}`);
    exceptions.set(entry.url, entry.reason);
  }
  return exceptions;
}

const mask = (text) => text.replace(/[^\r\n]/g, ' ');
const lineAt = (source, offset) => source.slice(0, offset).split('\n').length;

// Markdown already supplies an entity decoder for link destinations. Parsing a
// synthetic destination lets static HTML attributes use the same URL semantics.
function decodeAttribute(value) {
  const destination = fromMarkdown(`[link](<${value}>)`).children[0]?.children[0];
  return destination?.type === 'link' ? destination.url : value;
}

function staticHrefs(source, add) {
  // Quoted attribute values are consumed as a unit, so text such as
  // title='href="..."' cannot be mistaken for an authored link.
  const tags = /<[A-Za-z][\w:.-]*(?:[^<>"']|"[^"]*"|'[^']*')*>/g;
  const attributes = /\s+([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*(["'`])([\s\S]*?)\4\s*\}|([^\s>]+)))?/g;
  for (const tag of source.matchAll(tags)) {
    for (const attribute of tag[0].matchAll(attributes)) {
      if (attribute[1].toLowerCase() !== 'href') continue;
      const value = attribute[2] ?? attribute[3] ?? attribute[5] ?? attribute[6];
      if (value === undefined || value.startsWith('{') || (attribute[4] === '`' && value.includes('${'))) continue;
      add(decodeAttribute(value), tag.index + attribute.index);
    }
  }
}

function staticHrefProperties(source, add) {
  // Tokenize strings and comments before looking for static href data fields.
  // No source code or expressions are evaluated.
  const tokens = /\/\/[^\r\n]*|\/\*[\s\S]*?\*\/|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|\bhref\s*:\s*/g;
  for (const token of source.matchAll(tokens)) {
    if (!token[0].startsWith('href')) continue;
    const value = source.slice(token.index + token[0].length).match(/^(["'`])([^\r\n]*?)\1/);
    if (value && !value[2].includes('${')) add(value[2], token.index);
  }
}

function collectGitHubLinks(content, { astro = false } = {}) {
  const links = [];
  const add = (url, offset, kind = 'href') => {
    if (isHomeserverGitHubUrl(url)) links.push({ line: lineAt(content, offset), url, kind });
  };
  let source = content.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, mask);

  if (astro) {
    const frontmatterEnd = content.length - source.trimStart().length;
    staticHrefProperties(content.slice(0, frontmatterEnd), add);
  } else {
    const excluded = [];
    function walk(node, inLink = false) {
      if (node.type === 'link' || node.type === 'definition') add(node.url, node.position.start.offset, 'markdown');
      if (node.type === 'image') add(node.url, node.position.start.offset, 'image');
      if (node.type === 'text' && !inLink) {
        // Astro's GFM rendering also autolinks bare URLs. Inspect prose text
        // only, so URLs in code and link labels are not counted a second time.
        for (const match of node.value.matchAll(/https?:\/\/[^\s<>]+/gi)) {
          let url = match[0].replace(/[.,;:!?]+$/, '');
          while (url.endsWith(')') && (url.match(/\)/g)?.length ?? 0) > (url.match(/\(/g)?.length ?? 0)) url = url.slice(0, -1);
          add(url, node.position.start.offset + match.index, 'bare');
        }
      }
      if (node.type === 'code' || node.type === 'inlineCode') {
        excluded.push([node.position.start.offset, node.position.end.offset]);
      }
      for (const child of node.children || []) walk(child, inLink || node.type === 'link');
    }
    walk(fromMarkdown(source));
    for (const [start, end] of excluded.sort((a, b) => b[0] - a[0])) {
      source = source.slice(0, start) + mask(source.slice(start, end)) + source.slice(end);
    }
  }
  source = source.replace(/<!--[\s\S]*?-->/g, mask);
  staticHrefs(source, add);
  return links;
}

export function findGitHubLinks(content, options) {
  return collectGitHubLinks(content, options).map(({ line, url }) => ({ line, url }));
}

export function findGitHubLinkViolations(content, exceptions, options) {
  return collectGitHubLinks(content, options)
    .filter(({ url, kind }) => !(kind === 'markdown' && isPinnedGitHubUrl(url)) && !exceptions.has(url))
    .map(({ line, url, kind }) => {
      const violation = { line, url };
      if (kind !== 'markdown' && url.includes('{{pinned_homeserver_release}}')) {
        violation.message = 'Release placeholders resolve only in Markdown links; use a Markdown link or a concrete URL with an explicit exception.';
      }
      return violation;
    });
}

function filesIn(directory, extensions) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(path, extensions);
    return extensions.has(extname(path)) ? [path] : [];
  });
}

function main() {
  const exceptions = validateGitHubLinkExceptions(JSON.parse(readFileSync(EXCEPTIONS_FILE, 'utf8')));
  const files = [
    ...filesIn('src/content/docs', new Set(['.md', '.mdx'])),
    ...filesIn('src', new Set(['.astro'])),
    'README.md',
    '.ai-rules.md',
  ];
  const failures = files.flatMap((file) => findGitHubLinkViolations(
    readFileSync(file, 'utf8'), exceptions, { astro: extname(file) === '.astro' },
  ).map(({ line, url, message }) => `${relative('.', file)}:${line}: ${url}${message ? ` (${message})` : ''}`));

  if (failures.length) {
    console.error(`Pubky Homeserver GitHub links must use {{pinned_homeserver_release}} or an exact exception in ${EXCEPTIONS_FILE}:\n${failures.join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log(`Verified Pubky Homeserver GitHub links in ${files.length} authored files.`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
