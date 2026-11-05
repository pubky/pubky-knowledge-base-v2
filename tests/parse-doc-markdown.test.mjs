import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { parseDocMarkdown } from '../scripts/parse-doc-markdown.mjs';
import { sidebar } from '../src/config/sidebar.mjs';

test('parses quoted YAML scalars and preserves the Markdown body', () => {
  const page = parseDocMarkdown(`---
title: 'A developer''s guide'
description: "Use \\"quoted\\" values and \\u0061 Unicode escape"
---
\n## Body\n\nKeep this text.\n`, 'guide.md');
  assert.equal(page.title, "A developer's guide");
  assert.equal(page.description, 'Use "quoted" values and a Unicode escape');
  assert.equal(page.body, '\n## Body\n\nKeep this text.\n');
});

for (const style of ['>', '|']) {
  test(`normalizes ${style} multiline YAML scalars for Markdown metadata`, () => {
    const page = parseDocMarkdown(`---
title: Guide
description: ${style}
  First line.
  Second line.
---
Body`, 'guide.md');
    assert.equal(page.description, 'First line. Second line.');
    assert.equal(page.body, 'Body');
  });
}

test('accepts CRLF frontmatter and an omitted description', () => {
  assert.deepEqual(parseDocMarkdown('---\r\ntitle: Guide\r\n---\r\nBody', 'guide.md'), {
    title: 'Guide', description: '', body: 'Body',
  });
});

test('rejects incomplete or malformed YAML with the page filename', () => {
  assert.throws(() => parseDocMarkdown('---\ntitle: Guide\n', 'broken.md'), /broken\.md has no complete YAML frontmatter/);
  assert.throws(() => parseDocMarkdown('---\ntitle: [unclosed\n---\nBody', 'broken.md'), /broken\.md has invalid YAML frontmatter/);
  assert.throws(() => parseDocMarkdown('---\n- Guide\n---\nBody', 'broken.md'), /broken\.md frontmatter must be a YAML mapping/);
});

test('rejects missing, empty, and non-string metadata instead of emitting it', () => {
  for (const title of ['', 'title: ""', 'title: 42', 'title: [Guide]']) {
    assert.throws(() => parseDocMarkdown(`---\n${title}\ndescription: Summary\n---\nBody`, 'guide.md'), /guide\.md frontmatter title must be a non-empty string/);
  }
  for (const description of ['false', '[Summary]', 'null']) {
    assert.throws(() => parseDocMarkdown(`---\ntitle: Guide\ndescription: ${description}\n---\nBody`, 'guide.md'), /guide\.md frontmatter description must be a string/);
  }
});

test('both LLM index generators render parsed YAML metadata', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'pubky-llms-yaml-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'dist'));
  mkdirSync(join(root, 'src/content/docs'), { recursive: true });
  const content = `---
title: 'A developer''s guide'
description: |
  First line.
  Second line.
---
\n## Body\n\nKeep this documentation.\n`;
  for (const slug of sidebar.flatMap((group) => group.items.map((item) => item.slug))) {
    writeFileSync(join(root, 'dist', `${slug}.md`), content);
  }
  writeFileSync(join(root, 'src/content/docs/guide.md'), content);
  for (const script of ['generate-llms-index.mjs', 'generate-llms-small.mjs']) {
    const result = spawnSync(process.execPath, [resolve('scripts', script)], { cwd: root, encoding: 'utf-8' });
    assert.equal(result.status, 0, result.stderr);
  }
  for (const file of ['llms.txt', 'llms-small.txt']) {
    const output = readFileSync(join(root, 'dist', file), 'utf-8');
    assert.ok(output.includes("[A developer's guide]"), `${file} did not decode the title`);
    assert.ok(output.includes(': First line. Second line.'), `${file} did not render the multiline description`);
  }
  const full = readFileSync(join(root, 'dist/llms-full.txt'), 'utf-8');
  assert.ok(full.includes("# A developer's guide\n\n> First line. Second line."));
  assert.ok(full.includes('Keep this documentation.'));
});
