import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';
import test, { before } from 'node:test';
import { canRetryHttp1, checkLiveLinks, githubRawFallback, liveLinkExclusions, loadLiveLinkExceptions } from '../scripts/check-live-links.mjs';

const siteUrl = 'https://knowledge.example.test';
const pkdnsUrl = 'http://7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy/';

before(() => {
  const result = spawnSync(process.env.LYCHEE_BIN || 'lychee', ['--version'], { encoding: 'utf8', timeout: 5000 });
  assert.equal(result.error, undefined,
    'Live-link tests require Lychee. Install the CI-pinned version or set LYCHEE_BIN to its executable.');
  assert.equal(result.status, 0, `Unable to run Lychee: ${result.stderr}`);
});

function checkFixture(t, files, options = {}) {
  const distDir = mkdtempSync(join(tmpdir(), 'pubky-live-link-test-'));
  t.after(() => rmSync(distDir, { recursive: true, force: true }));
  for (const [path, content] of Object.entries(files)) {
    const destination = join(distDir, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, content);
  }
  return checkLiveLinks({ distDir, siteUrl, basePath: '/', extraInputs: [], exceptions: [], offline: true, ...options });
}

function dumpCheckedUrls(t, urls, exceptions) {
  const directory = mkdtempSync(join(tmpdir(), 'pubky-lychee-exception-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const inputFile = join(directory, 'links.md');
  writeFileSync(inputFile, urls.map((url) => `[Link](<${url}>)`).join('\n'));
  const configFile = join(directory, 'lychee.toml');
  writeFileSync(configFile, readFileSync(new URL('../config/lychee.toml', import.meta.url), 'utf8') +
    `\nexclude = ${JSON.stringify(liveLinkExclusions(exceptions))}\n`);
  // --dump extracts destinations without making network requests.
  const result = spawnSync(process.env.LYCHEE_BIN || 'lychee', ['--config', configFile, '--dump', inputFile],
    { encoding: 'utf8', timeout: 5000 });
  assert.equal(result.status, 0, result.stderr);
  return new Set(result.stdout.trim().split('\n').filter(Boolean));
}

test('live-link exceptions escape URL syntax and match only the exact destination', () => {
  const url = 'https://resolver.example/guide.v1+(draft)?mode=a+b#setup';
  for (const options of [{}, { ignoreQuery: false }]) {
    const [pattern] = liveLinkExclusions([{ url, reason: 'This exact destination needs a configured resolver.', ...options }]);
    const exclusion = new RegExp(pattern);
    assert.equal(exclusion.test(url), true);
    for (const other of [
      url.replace('resolver.example', 'other.example'),
      url.replace('resolver.example', 'resolverXexample'),
      url.replace('guide.v1+(draft)', 'other-guide'),
      url.replace('guide.v1+(draft)', 'guideXv11draft'),
      url.replace('mode=a+b', 'mode=other'),
      url.replace('#setup', '#other'),
      `${url}/extra`,
    ]) assert.equal(exclusion.test(other), false, other);
  }
});

test('ignoreQuery permits queries only on the same scheme, host, and path without fragments', () => {
  for (const scheme of ['http', 'https']) {
    const url = `${scheme}://resolver.example/guide.v1+(draft)`;
    const [pattern] = liveLinkExclusions([{ url, reason: 'The endpoint blocks CI regardless of query.', ignoreQuery: true }]);
    const exclusion = new RegExp(pattern);
    for (const allowed of [url, `${url}?`, `${url}?q=first`, `${url}?q=new%20prompt%23section&other=a+b`]) {
      assert.equal(exclusion.test(allowed), true, allowed);
    }
    for (const checked of [
      url.replace(`${scheme}:`, `${scheme === 'https' ? 'http' : 'https'}:`),
      url.replace('resolver.example', 'other.example'),
      url.replace('resolver.example', 'resolverXexample'),
      url.replace('resolver.example', 'resolver.example.evil.test'),
      url.replace('resolver.example', 'user:password@resolver.example'),
      url.replace('guide.v1+(draft)', 'guideXv11draft'),
      `${url}/`,
      `${url}/extra?q=prompt`,
      `${url}#`,
      `${url}#setup`,
      `${url}?q=prompt#`,
      `${url}?q=prompt#setup`,
    ]) assert.equal(exclusion.test(checked), false, checked);
  }
});

test('ignoreQuery rejects nonboolean flags and bases with queries, fragments, credentials, or noncanonical URLs', () => {
  const reason = 'The endpoint blocks CI regardless of query.';
  for (const ignoreQuery of [undefined, null, 0, 1, 'true', 'false', {}, []]) {
    assert.throws(() => liveLinkExclusions([{ url: 'https://resolver.example/', reason, ignoreQuery }]));
  }
  for (const url of [
    'https://resolver.example/?q=prompt',
    'https://resolver.example/?',
    'https://resolver.example/#setup',
    'https://resolver.example/#',
    'https://user:password@resolver.example/',
    'ftp://resolver.example/',
    'https://resolver.example',
    'https://RESOLVER.example/',
  ]) assert.throws(() => liveLinkExclusions([{ url, reason, ignoreQuery: true }]), url);
});

test('live-link exceptions reject missing reasons and wildcard URLs', () => {
  for (const exceptions of [
    {},
    [{ url: 'https://resolver.example/' }],
    [{ url: 'https://resolver.example/', reason: '   ' }],
    [{ url: 'https://resolver.example/*', reason: 'A repository-wide wildcard is too broad.' }],
  ]) assert.throws(() => liveLinkExclusions(exceptions));
  assert.deepEqual(liveLinkExclusions([]), []);
});

test('the configured PKDNS exception filters only its exact URL in real Lychee extraction', (t) => {
  const exceptions = JSON.parse(readFileSync(new URL('../config/live-link-exceptions.json', import.meta.url), 'utf8'));
  assert.ok(exceptions.some(({ url }) => url === pkdnsUrl), 'Keep the configured PKDNS tutorial exception.');
  const checkedUrls = [`${pkdnsUrl}another-path`, `${pkdnsUrl}?query=another`, 'https://github.com/pubky/'];
  assert.deepEqual(dumpCheckedUrls(t, [pkdnsUrl, ...checkedUrls], exceptions), new Set(checkedUrls));
});

test('all GitHub Actions exceptions remain checkable locally and under generic CI', (t) => {
  const actionsExceptions = JSON.parse(readFileSync(new URL('../config/github-actions-link-exceptions.json', import.meta.url), 'utf8'));
  const actionsUrls = actionsExceptions.flatMap(({ url, ignoreQuery }) =>
    ignoreQuery ? [url, `${url}?q=old%20prompt`, `${url}?q=new%20prompt&other=1`] : [url]);
  assert.ok(actionsUrls.length > 0, 'Exercise the configured GitHub Actions exceptions.');
  assert.equal(new Set(actionsUrls).size, actionsUrls.length, 'Each exception must have a unique URL.');
  assert.doesNotThrow(() => liveLinkExclusions(actionsExceptions), 'Every exception must have a canonical URL and a reason.');
  for (const env of [{}, { GITHUB_ACTIONS: 'false' }, { CI: 'true' }, { CI: 'true', GITHUB_ACTIONS: 'false' }]) {
    assert.deepEqual(dumpCheckedUrls(t, [pkdnsUrl, ...actionsUrls], loadLiveLinkExceptions(env)),
      new Set(actionsUrls), JSON.stringify(env));
  }
});

test('GitHub Actions ignores queries only for opted-in paths while keeping exact exceptions query-sensitive', (t) => {
  const actionsExceptions = JSON.parse(readFileSync(new URL('../config/github-actions-link-exceptions.json', import.meta.url), 'utf8'));
  assert.deepEqual(actionsExceptions.filter(({ ignoreQuery }) => ignoreQuery).map(({ url }) => url).sort(),
    ['https://chat.openai.com/', 'https://claude.ai/new'], 'Only the two starter-prompt endpoints should ignore queries.');
  const actionsUrls = actionsExceptions.flatMap(({ url, ignoreQuery }) =>
    ignoreQuery ? [url, `${url}?q=old%20prompt`, `${url}?q=new%20prompt&other=1`] : [url]);
  const otherUrls = [...new Set(actionsExceptions.flatMap(({ url, ignoreQuery }) => [
    new URL('/not-an-exempt-url', url).href,
    ...(ignoreQuery ? [`${url}?q=prompt#not-an-exempt-anchor`] : [`${url}${url.includes('?') ? '&' : '?'}not-exempt=1`]),
    `${url}#not-an-exempt-anchor`,
  ]))];
  const checked = dumpCheckedUrls(t, [pkdnsUrl, ...actionsUrls, ...otherUrls],
    loadLiveLinkExceptions({ GITHUB_ACTIONS: 'true' }));
  assert.deepEqual(checked, new Set(otherUrls));
});

test('built relative, root, and same-origin links resolve to pages, assets, and anchors', (t) => {
  const report = checkFixture(t, {
    'index.html': `<h1 id="intro">Home</h1>
      <a href="guides/">Relative guide</a>
      <a href="/guides/#setup">Root guide and anchor</a>
      <a href="${siteUrl}/guides/#setup">Published guide and anchor</a>
      <a href="#intro">Same-page anchor</a>
      <img src="/assets/logo.svg" alt="Logo">`,
    'guides/index.html': '<h1 id="setup">Setup</h1><a href="../#intro">Home</a><img src="../assets/logo.svg" alt="Logo">',
    'assets/logo.svg': '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  });
  assert.deepEqual(report.failures, []);
  assert.ok(report.total >= 7, `Expected all fixture links to be checked, got ${report.total}.`);
});

test('an unrelated hostname sharing the site-origin prefix is not remapped locally', (t) => {
  const report = checkFixture(t, {
    'index.html': `<a href="${siteUrl}.unrelated.example/missing/">External destination</a>`,
  });
  assert.deepEqual(report.failures, []);
});

test('missing built routes, assets, and anchors remain failures', (t) => {
  const report = checkFixture(t, {
    'index.html': `<a href="/missing-route/">Missing route</a>
      <img src="/assets/missing.svg" alt="Missing asset">
      <a href="${siteUrl}/guides/#missing-anchor">Missing anchor</a>`,
    'guides/index.html': '<h1 id="setup">Setup</h1>',
  });
  assert.equal(report.failures.length, 3, JSON.stringify(report.failures));
  assert.ok(report.failures.some(({ url }) => /\/missing-route\/?$/.test(url)));
  assert.ok(report.failures.some(({ url }) => url.endsWith('/assets/missing.svg')));
  assert.ok(report.failures.some(({ url, status }) => url.endsWith('/guides/#missing-anchor') && status.text === 'Cannot find fragment'));
  assert.ok(report.failures.every(({ source }) => source === 'dist/index.html'));
});

test('LLM text exports are parsed as Markdown, so code examples are not live links', (t) => {
  const llms = [
    '# Documentation',
    '[Guide](/guides/#setup)',
    '',
    `Inline example: \`[example](${siteUrl}/inline-example-only/)\``,
    '',
    '```markdown',
    `[example](${siteUrl}/fenced-example-only/)`,
    '<a href="/html-example-only/">Example</a>',
    '```',
  ].join('\n');
  const report = checkFixture(t, {
    'index.html': '<h1>Home</h1>',
    'guides/index.html': '<h1 id="setup">Setup</h1>',
    'llms.txt': llms,
    'llms-small.txt': llms,
  });
  assert.deepEqual(report.failures, []);
  assert.ok(report.total >= 2, 'Expected real links in both LLM text exports to be checked.');
});

test('a dead Markdown link in an LLM text export fails with its published source name', (t) => {
  const report = checkFixture(t, {
    'index.html': '<h1>Home</h1>',
    'llms.txt': '# Documentation\n\n[Missing guide](/missing-llm-guide/)\n',
  });
  assert.equal(report.failures.length, 1, JSON.stringify(report.failures));
  assert.equal(report.failures[0].source, 'dist/llms.txt');
  assert.match(report.failures[0].url, /\/missing-llm-guide\/?$/);
});

test('BASE_PATH mounts the build for relative, root, and same-origin links', (t) => {
  const report = checkFixture(t, {
    'index.html': `<h1 id="intro">Home</h1>
      <a href="guides/">Relative guide</a>
      <a href="/knowledge/guides/#setup">Mounted guide</a>
      <a href="${siteUrl}/knowledge/guides/#setup">Published mounted guide</a>
      <img src="/knowledge/assets/logo.svg" alt="Logo">`,
    'guides/index.html': '<h1 id="setup">Setup</h1><a href="../#intro">Home</a>',
    'assets/logo.svg': '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  }, { basePath: '/knowledge/' });
  assert.deepEqual(report.failures, []);
});

test('links missing the configured BASE_PATH prefix fail', (t) => {
  const report = checkFixture(t, {
    'index.html': `<a href="/guides/">Guide missing mount</a>
      <img src="${siteUrl}/assets/logo.svg" alt="Asset missing mount">`,
    'guides/index.html': '<h1>Guide</h1>',
    'assets/logo.svg': '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  }, { basePath: '/knowledge/' });
  assert.equal(report.failures.length, 2, JSON.stringify(report.failures));
  assert.ok(report.failures.some(({ url }) => /\/guides\/?$/.test(url)));
  assert.ok(report.failures.some(({ url }) => url.endsWith('/assets/logo.svg')));
});

const http2Failure = { status: { text: 'Error', details: 'HTTP/2 protocol error. Connection closed.' } };
const forbiddenFailure = { status: { text: '403 Forbidden', code: 403 } };
const cachedFailure = { status: { text: 'Error (cached)' } };
const unavailableFailure = { status: { text: '503 Service Unavailable', code: 503 } };

test('GitHub raw fallback maps file links and validates supported line fragments', () => {
  const url = 'https://github.com/pubky/pubky-core/blob/v0.6.0/docs/INSTALL.md';
  const rawUrl = 'https://raw.githubusercontent.com/pubky/pubky-core/v0.6.0/docs/INSTALL.md';
  for (const failure of [http2Failure, ...[403, 429, 500, 502, 503, 504].map((code) => ({ status: { code } }))]) {
    for (const [fragment, lastLine] of [['', null], ['#L1', 1], ['#L5', 5], ['#L2-L5', 5]]) {
      assert.deepEqual(githubRawFallback(url + fragment, [cachedFailure, failure, cachedFailure]),
        { url: rawUrl, lastLine }, `${fragment}: ${JSON.stringify(failure)}`);
    }
  }
});

test('GitHub raw fallback declines unconfirmed failures and broken destinations', () => {
  const url = 'https://github.com/pubky/pubky-core/blob/main/README.md';
  for (const failures of [
    [],
    [cachedFailure],
    [{ status: { code: 404, text: '404 Not Found' } }],
    [unavailableFailure, { status: { code: 404, text: '404 Not Found' } }],
    [forbiddenFailure, { status: { text: 'Cannot find fragment' } }],
    [unavailableFailure, { status: { text: 'Connection timed out' } }],
  ]) assert.equal(githubRawFallback(url, failures), null, JSON.stringify(failures));
});

test('GitHub raw fallback rejects other origins, unsafe paths, queries, and unsupported fragments', () => {
  const url = 'https://github.com/pubky/pubky-core/blob/main/README.md';
  for (const other of [
    url.replace('https:', 'http:'),
    url.replace('https:', 'ftp:'),
    url.replace('github.com', 'github.com.evil.test'),
    url.replace('github.com', 'raw.githubusercontent.com'),
    url.replace('github.com', 'github.com:443'),
    url.replace('github.com', 'github.com:8443'),
    url.replace('github.com', 'user@github.com'),
    url.replace('github.com', 'user:password@github.com'),
    url.replace('/blob/', '/tree/'),
    url.replace('/README.md', ''),
    url.replace('/README.md', '/'),
    url.replace('/README.md', '/docs//README.md'),
    url.replace('/README.md', '/docs/../README.md'),
    url.replace('/README.md', '/docs/./README.md'),
    url.replace('/README.md', '/README%2emd'),
    url.replace('/README.md', '/READ%20ME.md'),
    `${url}?plain=1`,
    `${url}?`,
    ...['#', '#setup', '#L0', '#L-1', '#L1.5', '#L5-L2', '#L1-L0', '#L1-L2-L3',
      '#L9007199254740992', '#L1-L9007199254740992'].map((fragment) => url + fragment),
    'not a URL',
  ]) assert.equal(githubRawFallback(other, [unavailableFailure]), null, other);
});

test('HTTP/1.1 fallback accepts HTTP/2 or 403 failures and their cached duplicates', () => {
  for (const failure of [http2Failure, forbiddenFailure]) {
    assert.equal(canRetryHttp1('https://example.test/page', [failure]), true);
    assert.equal(canRetryHttp1('http://example.test/page', [cachedFailure, failure, cachedFailure]), true);
  }
  assert.equal(canRetryHttp1('https://example.test/page', [cachedFailure]), false);
  assert.equal(canRetryHttp1('https://example.test/page', []), false);
});

test('HTTP/1.1 fallback cannot mask a 404 or a missing fragment', () => {
  const failures = [
    { status: { text: '404 Not Found', code: 404, details: 'HTTP status client error (404 Not Found)' } },
    { status: { text: 'Missing fragment', details: 'Missing fragment #setup' } },
  ];
  for (const failure of failures) {
    assert.equal(canRetryHttp1('https://example.test/page', [http2Failure, cachedFailure, failure]), false);
    assert.equal(canRetryHttp1('https://example.test/page', [forbiddenFailure, cachedFailure, failure]), false);
  }
});

test('HTTP/1.1 fallback rejects credentials, fragment checks, non-HTTP URLs, and malformed URLs', () => {
  const urls = [
    'https://user@example.test/page',
    'https://user:password@example.test/page',
    'https://example.test/page#setup',
    'file:///tmp/example.html',
    'ftp://example.test/page',
    'mailto:example@example.test',
    'not a URL',
  ];
  for (const url of urls) {
    assert.equal(canRetryHttp1(url, [http2Failure]), false, url);
    assert.equal(canRetryHttp1(url, [forbiddenFailure]), false, url);
  }
});

function checkWithRetryReports(t, firstFailures, retryFailures, retrySuccesses,
  { curlStatus = 403, curlExitCode = 22, curlBody = '' } = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'pubky-lychee-retry-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const executable = join(directory, 'lychee.cjs');
  const callsFile = join(directory, 'calls.json');
  const curlCallsFile = join(directory, 'curl-calls.json');
  writeFileSync(curlCallsFile, '[]');
  writeFileSync(join(directory, 'curl'), `#!/usr/bin/env node
const fs = require('node:fs');
const callsFile = ${JSON.stringify(curlCallsFile)};
const calls = JSON.parse(fs.readFileSync(callsFile, 'utf8'));
const args = process.argv.slice(2);
calls.push(args);
fs.writeFileSync(callsFile, JSON.stringify(calls));
const output = args[args.indexOf('--output') + 1];
if (args.includes('--output') && output !== '/dev/null') fs.writeFileSync(output, ${JSON.stringify(curlBody)});
process.stdout.write(${JSON.stringify(String(curlStatus))});
process.exitCode = ${JSON.stringify(curlExitCode)};
`, { mode: 0o700 });
  writeFileSync(executable, `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
const callsFile = ${JSON.stringify(callsFile)};
const calls = fs.existsSync(callsFile) ? JSON.parse(fs.readFileSync(callsFile, 'utf8')) : [];
const inputs = fs.readFileSync(args[args.indexOf('--files-from') + 1], 'utf8').trim().split('\\n');
calls.push(inputs.map((file) => fs.readFileSync(file, 'utf8')));
fs.writeFileSync(callsFile, JSON.stringify(calls));
if (calls.length > 2) throw new Error('Unexpected additional Lychee retry');
const failures = calls.length === 1 ? ${JSON.stringify(firstFailures)} : ${JSON.stringify(retryFailures)};
// Real Lychee emits success_map entries only when verbose reporting is enabled.
const successes = calls.length === 1 || !args.includes('--verbose') ? [] : ${JSON.stringify(retrySuccesses)};
const report = { total: failures.length + successes.length, unique: failures.length + successes.length,
  errors: failures.length, timeouts: 0, error_map: { [inputs[0]]: failures },
  timeout_map: {}, success_map: { [inputs[0]]: successes } };
fs.writeFileSync(args[args.indexOf('--output') + 1], JSON.stringify(report));
process.exitCode = failures.length ? 2 : 0;
`, { mode: 0o700 });
  const previousBinary = process.env.LYCHEE_BIN;
  const previousPath = process.env.PATH;
  try {
    process.env.LYCHEE_BIN = executable;
    process.env.PATH = [directory, previousPath].filter(Boolean).join(delimiter);
    const report = checkFixture(t, { 'index.html': '<h1>Home</h1>' }, { offline: false });
    const calls = JSON.parse(readFileSync(callsFile, 'utf8'));
    assert.equal(calls.length, 2, 'Failed external URLs get exactly one fresh Lychee pass.');
    return { report, retryInputs: calls[1], curlCalls: JSON.parse(readFileSync(curlCallsFile, 'utf8')) };
  } finally {
    if (previousBinary === undefined) delete process.env.LYCHEE_BIN;
    else process.env.LYCHEE_BIN = previousBinary;
    if (previousPath === undefined) delete process.env.PATH;
    else process.env.PATH = previousPath;
  }
}

test('a fresh retry recovers only confirmed external successes and preserves their full fragments', (t) => {
  const url = 'https://external.example/guide?language=en#setup';
  const localFailure = { url: 'file:///missing/local-page.html', status: { text: 'File not found' }, span: { line: 7 } };
  const { report, retryInputs } = checkWithRetryReports(t, [
    { url, ...forbiddenFailure },
    { url, ...cachedFailure },
    localFailure,
  ], [], [{ url, status: { text: '200 OK', code: 200 } }]);
  assert.deepEqual(retryInputs, [`${url}\n`], 'Retry only unique external destinations, with query and fragment intact.');
  assert.deepEqual(report.failures, [{ ...localFailure, source: 'dist/index.html' }]);
});

test('persistent 403, 404, and missing-fragment results retain every original failure', (t) => {
  const failures = [
    { url: 'https://external.example/forbidden', ...forbiddenFailure, span: { line: 2 } },
    { url: 'https://external.example/missing', status: { text: '404 Not Found', code: 404 }, span: { line: 3 } },
    { url: 'https://external.example/guide#missing', status: { text: 'Cannot find fragment' }, span: { line: 4 } },
  ];
  const { report, retryInputs, curlCalls } = checkWithRetryReports(t, failures,
    failures.map((failure) => ({ ...failure, span: { line: 99 } })), []);
  assert.deepEqual(retryInputs, [failures.map(({ url }) => url).join('\n') + '\n']);
  assert.deepEqual(report.failures, failures.map((failure) => ({ ...failure, source: 'dist/index.html' })));
  assert.equal(curlCalls.length, 1, 'Only the 403 is eligible for HTTP/1.1 fallback.');
});

test('a clean retry report without success for the exact fragment cannot clear its failure', (t) => {
  const failure = { url: 'https://external.example/guide#missing', status: { text: 'Cannot find fragment' } };
  const { report, retryInputs } = checkWithRetryReports(t, [failure], [], [
    { url: 'https://external.example/guide', status: { text: '200 OK', code: 200 } },
  ]);
  assert.deepEqual(retryInputs, [`${failure.url}\n`]);
  assert.deepEqual(report.failures, [{ ...failure, source: 'dist/index.html' }]);
});

test('HTTP/1.1 fallback recovers a 403 only after a successful 2xx GET with browser headers', (t) => {
  const failure = { url: 'https://external.example/filtered', ...forbiddenFailure };
  for (const curlStatus of [200, 204]) {
    const { report, curlCalls } = checkWithRetryReports(t, [failure], [failure], [], { curlStatus, curlExitCode: 0 });
    assert.deepEqual(report.failures, []);
    assert.equal(curlCalls.length, 1);
    const args = curlCalls[0];
    assert.equal(args[args.indexOf('--url') + 1], failure.url);
    assert.ok(args.includes('--http1.1') && args.includes('--fail'));
    assert.ok(!args.includes('--head') && !args.includes('-I'), 'Recovery requires a GET rather than a HEAD request.');
    assert.match(args[args.indexOf('--user-agent') + 1], /Mozilla\/5\.0/);
    assert.ok(args.some((value) => value.startsWith('Accept: ')));
    assert.ok(args.some((value) => value.startsWith('Accept-Language: ')));
  }
});

test('HTTP/1.1 fallback retains original diagnostics for 403, 404, and unsuccessful curl exits', (t) => {
  const failure = { url: 'https://external.example/filtered', ...forbiddenFailure, span: { line: 12 } };
  for (const response of [
    { curlStatus: 403, curlExitCode: 0 },
    { curlStatus: 404, curlExitCode: 0 },
    { curlStatus: 200, curlExitCode: 22 },
  ]) {
    const { report, curlCalls } = checkWithRetryReports(t, [failure], [failure], [], response);
    assert.equal(curlCalls.length, 1);
    assert.deepEqual(report.failures, [{ ...failure, source: 'dist/index.html' }]);
  }
});

test('a fresh 404 prevents raw GitHub and HTTP/1.1 fallbacks from clearing an initial transport failure', (t) => {
  for (const url of [
    'https://github.com/pubky/pubky-core/blob/main/README.md',
    'https://external.example/guide',
  ]) {
    const failure = { url, ...forbiddenFailure };
    const { report, curlCalls } = checkWithRetryReports(t, [failure], [
      { url, status: { text: '404 Not Found', code: 404 } },
    ], [], { curlStatus: 200, curlExitCode: 0, curlBody: 'Present\n' });
    assert.deepEqual(report.failures, [{ ...failure, source: 'dist/index.html' }]);
    assert.deepEqual(curlCalls, [], 'A confirmed 404 must not be retried through a fallback.');
  }
});

test('GitHub raw fallback recovers 503 and cached duplicates only after a successful bounded GET', (t) => {
  const url = 'https://github.com/pubky/pubky-core/blob/v0.6.0/docs/INSTALL.md';
  const failures = [{ url, ...unavailableFailure }, { url, ...cachedFailure }];
  const { report, curlCalls } = checkWithRetryReports(t, failures, [{ url, ...cachedFailure }], [],
    { curlStatus: 200, curlExitCode: 0, curlBody: 'Install\n' });
  assert.deepEqual(report.failures, []);
  assert.equal(curlCalls.length, 1);
  const args = curlCalls[0];
  assert.equal(args[args.indexOf('--url') + 1], 'https://raw.githubusercontent.com/pubky/pubky-core/v0.6.0/docs/INSTALL.md');
  assert.ok(args.includes('--fail'));
  assert.ok(!args.includes('--head') && !args.includes('-I'), 'Recovery requires fetching the file.');
  assert.ok(!args.includes('--location') && !args.includes('-L'), 'Raw fallback must not follow redirects.');
  assert.ok(Number(args[args.indexOf('--max-filesize') + 1]) > 0, 'Downloaded file size must be bounded.');
  assert.notEqual(args[args.indexOf('--output') + 1], '/dev/null', 'Keep the body for line validation.');
});

test('GitHub line fragments recover only when every referenced line exists', (t) => {
  for (const [fragment, curlBody, recovered] of [
    ['#L5', '1\n2\n3\n4\n5\n', true],
    ['#L2-L5', '1\n2\n3\n4\n5', true],
    ['#L5', '1\n2\n3\n4\n', false],
    ['#L2-L5', '1\n2\n3\n4', false],
    ['#L1', '', false],
    ['#L1', '\n', true],
  ]) {
    const failure = { url: `https://github.com/pubky/pubky-core/blob/main/README.md${fragment}`, ...unavailableFailure };
    const { report, curlCalls } = checkWithRetryReports(t, [failure], [failure], [],
      { curlStatus: 200, curlExitCode: 0, curlBody });
    assert.equal(curlCalls.length, 1);
    assert.deepEqual(report.failures, recovered ? [] : [{ ...failure, source: 'dist/index.html' }],
      `${fragment}, body=${JSON.stringify(curlBody)}`);
  }
});

test('GitHub raw fallback retains diagnostics for non-2xx responses and unsuccessful curl exits', (t) => {
  const failure = { url: 'https://github.com/pubky/pubky-core/blob/main/README.md#L5', ...unavailableFailure, span: { line: 12 } };
  for (const response of [
    { curlStatus: 301, curlExitCode: 0 },
    { curlStatus: 403, curlExitCode: 0 },
    { curlStatus: 404, curlExitCode: 0 },
    { curlStatus: 200, curlExitCode: 22 },
    { curlStatus: 200, curlExitCode: 63 },
  ]) {
    const { report, curlCalls } = checkWithRetryReports(t, [failure], [failure], [],
      { ...response, curlBody: '1\n2\n3\n4\n5\n' });
    assert.equal(curlCalls.length, 1);
    assert.deepEqual(report.failures, [{ ...failure, source: 'dist/index.html' }]);
  }
});

test('GitHub ordinary anchors cannot recover through raw content', (t) => {
  const failure = { url: 'https://github.com/pubky/pubky-core/blob/main/README.md#setup', ...forbiddenFailure };
  const { report, curlCalls } = checkWithRetryReports(t, [failure], [failure], [],
    { curlStatus: 200, curlExitCode: 0, curlBody: '# Setup\n' });
  assert.deepEqual(curlCalls, []);
  assert.deepEqual(report.failures, [{ ...failure, source: 'dist/index.html' }]);
});
