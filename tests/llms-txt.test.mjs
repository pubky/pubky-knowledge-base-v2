// Verifies the LLM entry points generated in dist/: llms.txt is an index of
// every documentation page, and llms-full.txt holds documentation pages only,
// in sidebar order, without the homepage layout.
import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sidebar } from '../src/config/sidebar.mjs';

const DIST = 'dist';
const SITE_URL = (process.env.SITE_URL || 'https://pubky.org').replace(/\/+$/, '');
const slugs = sidebar.flatMap((group) => group.items.map((item) => item.slug));
const titleOf = (slug) =>
  readFileSync(join('src/content/docs', `${slug}.md`), 'utf-8').match(/^title:\s*"?(.+?)"?\s*$/m)[1];

test('llms.txt links every sidebar page as Markdown, once, under its sidebar group', () => {
  const llms = readFileSync(join(DIST, 'llms.txt'), 'utf-8');
  for (const group of sidebar) {
    assert.match(llms, new RegExp(`^## ${group.label.replace(/[&]/g, '\\$&')}$`, 'm'), `missing section ${group.label}`);
  }
  for (const slug of slugs) {
    const url = `${SITE_URL}/${slug}.md`;
    const count = llms.split(`](${url})`).length - 1;
    assert.equal(count, 1, `${url} should be linked once in llms.txt, found ${count}`);
    assert.ok(existsSync(join(DIST, `${slug}.md`)), `${url} has no file in dist/`);
  }
});

test('llms.txt points to the single-file documentation sets', () => {
  const llms = readFileSync(join(DIST, 'llms.txt'), 'utf-8');
  assert.ok(llms.includes(`](${SITE_URL}/llms-full.txt)`), 'llms-full.txt is not linked');
  assert.ok(llms.includes(`](${SITE_URL}/llms-small.txt)`), 'llms-small.txt is not linked');
  assert.doesNotMatch(llms, /Abridged documentation/, 'llms-small.txt is a page index, not an abridged copy');
});

test('llms-full.txt contains the documentation pages in sidebar order and no homepage layout', () => {
  const full = readFileSync(join(DIST, 'llms-full.txt'), 'utf-8');
  const headings = [...full.matchAll(/^# (.*)$/gm)].map((match) => match[1]);
  assert.deepEqual(headings, slugs.map(titleOf));
  assert.doesNotMatch(full, /<!--/, 'HTML comments leaked into llms-full.txt');
  assert.doesNotMatch(full, /\[\]\(https?:/, 'links without text leaked into llms-full.txt');
});
