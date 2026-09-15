import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const browserUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const browserHeaders = [
  'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language: en-US,en;q=0.9',
];

export function loadLiveLinkExceptions(env = process.env) {
  const exceptions = JSON.parse(readFileSync(join(projectRoot, 'config/live-link-exceptions.json'), 'utf8'));
  if (env.GITHUB_ACTIONS === 'true') {
    // These exact URLs returned 403 on GitHub runners but passed locally.
    // They are unverifiable from GitHub Actions; local runs still check them.
    const urls = JSON.parse(readFileSync(join(projectRoot, 'config/github-actions-link-exceptions.json'), 'utf8'));
    exceptions.push(...urls.map((url) => ({ url, reason: 'Returns 403 from GitHub Actions; checked locally.' })));
  }
  return exceptions;
}

export function liveLinkExclusions(exceptions) {
  if (!Array.isArray(exceptions)) throw new Error('Live-link exceptions must be an array.');
  return exceptions.map(({ url, reason }) => {
    if (typeof url !== 'string' || !URL.canParse(url) || !/^https?:\/\//.test(url) ||
        typeof reason !== 'string' || !reason.trim() || /[\s*]/.test(url)) {
      throw new Error('Each live-link exception needs an exact HTTP(S) URL and a reason.');
    }
    const target = new URL(url);
    if (target.username || target.password || target.href !== url) {
      throw new Error(`Use a canonical URL without credentials for a live-link exception: ${url}`);
    }
    return `^${escapeRegex(url)}$`;
  });
}

function collectInputs(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectInputs(path);
    if (/^llms(?:-[\w-]+)?\.txt$/.test(entry.name)) {
      // These exports contain Markdown, including code examples. Parsing them
      // as plain text would treat example URLs as published links.
      cpSync(path, `${path}.md`);
      return [`${path}.md`];
    }
    return /\.(html|md)$/.test(entry.name) ? [path] : [];
  });
}

// Lychee 0.24.2 can reject live sites with an HTTP/2 protocol error:
// https://github.com/lycheeverse/lychee/issues/2264
// A 403 can also be client-specific automation filtering. In both cases a
// successful HTTP/1.1 GET is required; a 403 is never itself accepted as live.
export function canRetryHttp1(url, failures) {
  if (!URL.canParse(url)) return false;
  const target = new URL(url);
  return ['http:', 'https:'].includes(target.protocol) &&
    !target.username && !target.password && !target.hash &&
    failures.some(({ status }) => status.code === 403 || status.details?.startsWith('HTTP/2 protocol error.')) &&
    failures.every(({ status }) => status.code === 403 || status.details?.startsWith('HTTP/2 protocol error.') || status.text === 'Error (cached)');
}

function retryHttp1(url, env) {
  const result = spawnSync('curl', [
    '--disable', '--http1.1', '--silent', '--show-error', '--fail', '--location',
    '--user-agent', browserUserAgent,
    ...browserHeaders.flatMap((header) => ['--header', header]),
    '--proto', '=http,https', '--proto-redir', '=http,https',
    '--connect-timeout', '10', '--max-time', '30', '--max-redirs', '5',
    '--output', '/dev/null', '--write-out', '%{http_code}', '--url', url,
  ], { encoding: 'utf8', timeout: 35_000, env });
  return result.status === 0 && /^2\d\d$/.test(result.stdout.trim());
}

export function checkLiveLinks({
  distDir = resolve(projectRoot, 'dist'),
  siteUrl = process.env.SITE_URL || 'https://pubky.org',
  basePath = process.env.BASE_PATH || '/',
  extraInputs = [join(projectRoot, 'README.md')],
  exceptions = loadLiveLinkExceptions(),
  offline = false,
} = {}) {
  const origin = new URL(siteUrl).origin;
  const base = basePath.split('/').filter(Boolean);
  if (base.some((part) => part === '.' || part === '..' || /[?#\\\s]/.test(part))) {
    throw new Error(`Invalid BASE_PATH: ${basePath}`);
  }
  const temporary = mkdtempSync(join(tmpdir(), 'pubky-link-check-'));
  try {
    const webRoot = join(temporary, 'site');
    const siteRoot = join(webRoot, ...base);
    mkdirSync(dirname(siteRoot), { recursive: true });
    // Check the build at its deployed path without querying an older live site.
    // A temporary copy lets us parse LLM exports as Markdown without publishing
    // extra files or breaking their relative links.
    cpSync(distDir, siteRoot, { recursive: true });
    const inputs = collectInputs(siteRoot);
    if (!inputs.some((path) => path.endsWith('.html'))) {
      throw new Error('No built HTML pages found. Run npm run build first.');
    }
    inputs.push(...extraInputs);
    const inputFile = join(temporary, 'inputs.txt');
    writeFileSync(inputFile, inputs.join('\n') + '\n');
    const configFile = join(temporary, 'lychee.toml');
    const remap = `^${escapeRegex(origin)}([/?#].*)?$ ${pathToFileURL(webRoot).href}$1`;
    writeFileSync(configFile,
      readFileSync(join(projectRoot, 'config/lychee.toml'), 'utf8') +
      `\nroot_dir = ${JSON.stringify(webRoot)}\nremap = [${JSON.stringify(remap)}]\n` +
      `exclude = ${JSON.stringify(liveLinkExclusions(exceptions))}\n`);
    const reportFile = join(temporary, 'report.json');
    const env = { ...process.env };
    delete env.GITHUB_TOKEN;
    delete env.GH_TOKEN;
    const runLychee = (inputs, detailed = false) => {
      rmSync(reportFile, { force: true });
      const result = spawnSync(process.env.LYCHEE_BIN || 'lychee', [
        '--config', configFile, '--files-from', inputs, '--output', reportFile,
        ...(detailed ? [
          '--verbose', '--user-agent', browserUserAgent,
          ...browserHeaders.flatMap((header) => ['--header', header]),
        ] : []),
        ...(offline ? ['--offline'] : []),
      ], { encoding: 'utf8', env, timeout: 600_000, maxBuffer: 10 * 1024 * 1024 });
      if (result.error) throw result.error;
      const report = JSON.parse(readFileSync(reportFile, 'utf8'));
      if (result.status !== 0 && !report.errors && !report.timeouts) {
        throw new Error(`Lychee failed (${result.status}): ${result.stderr || result.stdout}`);
      }
      return report;
    };
    const report = runLychee(inputFile);
    const failures = [];
    for (const [source, entries] of [
      ...Object.entries(report.error_map),
      ...Object.entries(report.timeout_map),
    ]) {
      const displaySource = source.startsWith(siteRoot + '/')
        ? join('dist', relative(siteRoot, source)).replace(/(llms[^/]*)\.txt\.md$/, '$1.txt')
        : relative(projectRoot, source);
      for (const entry of entries) failures.push({ ...entry, source: displaySource });
    }
    const recovered = new Set();
    if (!offline) {
      // Some hosts intermittently block a request (e.g. 403) without triggering
      // Lychee's built-in retries. Recheck only failed external URLs once, with
      // the same status and fragment checks. Recovery requires a live response.
      const external = [...new Set(failures.map(({ url }) => url))]
        .filter((url) => /^https?:\/\//.test(url));
      if (external.length) {
        const retryFile = join(temporary, 'retry.txt');
        writeFileSync(retryFile, external.join('\n') + '\n');
        const retryInputs = join(temporary, 'retry-inputs.txt');
        writeFileSync(retryInputs, retryFile + '\n');
        // Lychee includes success_map only when detailed statistics are enabled.
        const retryReport = runLychee(retryInputs, true);
        for (const entries of Object.values(retryReport.success_map)) {
          for (const { url } of entries) recovered.add(url);
        }
        if (recovered.size) console.log(`Live-link recheck passed for ${recovered.size} external URL(s).`);
      }
      for (const url of new Set(failures.map(({ url }) => url))) {
        if (!recovered.has(url) && canRetryHttp1(url, failures.filter((failure) => failure.url === url)) && retryHttp1(url, env)) {
          recovered.add(url);
          console.log(`HTTP/1.1 check passed: ${url}`);
        }
      }
    }
    return {
      total: report.total,
      unique: report.unique,
      excluded: report.excludes,
      failures: failures.filter(({ url }) => !recovered.has(url)),
    };
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const report = checkLiveLinks({ offline: process.argv.includes('--offline') });
    for (const { source, span, url, status } of report.failures) {
      console.error(`${source}:${span?.line || 1}: ${url} — ${status.text}`);
    }
    console.log(`Scanned ${report.total} links (${report.unique} unique); ${report.excluded || 0} excluded; ${report.failures.length} failures.`);
    process.exitCode = report.failures.length ? 1 : 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
