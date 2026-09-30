import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { preserveRedirects, redirectScript } from '../scripts/preserve-redirects.mjs';

function fixture(t, destination = '/build/sdk/') {
  const root = mkdtempSync(join(tmpdir(), 'pubky-redirects-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, content) => {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  };
  const encoded = destination.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  write('old/sdk/index.html', `<!doctype html><title>Redirecting to: ${encoded}</title><meta http-equiv="refresh" content="0;url=${encoded}"><meta name="robots" content="noindex"><link rel="canonical" href="https://pubky.org${encoded}"><body><a href="${encoded}">Redirecting from <code>/old/sdk/</code> to <code>${encoded}</code></a></body>`);
  write('build/sdk.md', '# SDK\n\nCanonical content.\n');
  return { root, write };
}

test('enhances redirects and copies canonical Markdown without modifying it', (t) => {
  const { root } = fixture(t);
  assert.deepEqual(preserveRedirects({ distDir: root }), { redirects: 1, markdownAliases: 1 });
  assert.equal(readFileSync(join(root, 'old/sdk.md'), 'utf8'), readFileSync(join(root, 'build/sdk.md'), 'utf8'));
  const html = readFileSync(join(root, 'old/sdk/index.html'), 'utf8');
  assert.match(html, /<noscript><meta http-equiv="refresh" content="0;url=\/build\/sdk\/"><\/noscript>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/pubky.org\/build\/sdk\/">/);
  assert(html.includes(redirectScript));
});

test('base-prefixed URLs map to files inside the output directory', (t) => {
  const { root } = fixture(t, '/docs/build/sdk/?source=old#how-it-works');
  assert.equal(preserveRedirects({ distDir: root, basePath: '/docs/' }).markdownAliases, 1);
  assert.equal(readFileSync(join(root, 'old/sdk.md'), 'utf8'), '# SDK\n\nCanonical content.\n');
});

test('homepage redirects need no Markdown export', (t) => {
  const { root } = fixture(t, '/');
  assert.deepEqual(preserveRedirects({ distDir: root }), { redirects: 1, markdownAliases: 0 });
});

for (const destination of ['https://other.example/sdk/', '//other.example/sdk/', '/\\other.example/sdk/', '/%2e%2e/outside/', '/%2f%2e%2e/outside/', '/build%5csdk/', '/build/%00sdk/']) {
  test(`rejects unsafe destination ${destination}`, (t) => {
    const { root } = fixture(t, destination);
    assert.throws(() => preserveRedirects({ distDir: root }), /Invalid local|External|escapes/);
    assert(!readFileSync(join(root, 'old/sdk/index.html'), 'utf8').includes(redirectScript));
  });
}

test('rejects missing exports, aliases colliding with real files, and base-path escapes', (t) => {
  const missing = fixture(t, '/missing/');
  assert.throws(() => preserveRedirects({ distDir: missing.root }), /no canonical Markdown/);
  const collision = fixture(t);
  collision.write('old/sdk.md', 'Do not overwrite');
  assert.throws(() => preserveRedirects({ distDir: collision.root }), /overwrite/);
  assert.equal(readFileSync(join(collision.root, 'old/sdk.md'), 'utf8'), 'Do not overwrite');
  const base = fixture(t);
  assert.throws(() => preserveRedirects({ distDir: base.root, basePath: '/docs/' }), /outside BASE_PATH/);
});

test('rejects symlinks instead of following them', (t) => {
  const { root } = fixture(t);
  symlinkSync(tmpdir(), join(root, 'elsewhere'));
  assert.throws(() => preserveRedirects({ distDir: root }), /Symlinks/);
});

for (const [destination, expected] of [
  ['/build/sdk/', '/build/sdk/?source=old#how-it-works'],
  ['/build/sdk/?fixed=yes', '/build/sdk/?fixed=yes#how-it-works'],
  ['/build/sdk/#chosen', '/build/sdk/?source=old#chosen'],
  ['/docs/build/sdk/?fixed=yes#chosen', '/docs/build/sdk/?fixed=yes#chosen'],
]) {
  test(`browser script preserves incoming URL data with destination precedence: ${destination}`, () => {
    const incoming = new URL('https://example.test/old/sdk/?source=old#how-it-works');
    let redirected;
    const location = { href: incoming.href, origin: incoming.origin, search: incoming.search, hash: incoming.hash,
      replace(value) { redirected = value; } };
    runInNewContext(redirectScript.replace(/^<script[^>]*>|<\/script>$/g, ''), {
      URL, location, document: { querySelector: () => ({ getAttribute: () => destination }) },
    });
    assert.equal(redirected, `https://example.test${expected}`);
  });
}
