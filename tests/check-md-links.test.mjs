// Verifies that every pubky.org/*.md link in generated Markdown files
// resolves to a real file in dist/.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = 'dist';

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

test('no .mdx files in dist (should be renamed to .md)', () => {
  const mdxFiles = walkDir(DIST).filter((f) => extname(f) === '.mdx');
  assert.deepEqual(
    mdxFiles,
    [],
    `Found .mdx files in dist/ that should have been renamed to .md:\n${mdxFiles.join('\n')}`,
  );
});

test('every .md link in llms-small.txt resolves to a file in dist/', () => {
  const SITE_URL = (process.env.SITE_URL || 'https://pubky.org').replace(/\/+$/, '');
  const LINK_RE = new RegExp(
    SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/([^)#\\s]+\\.md)',
    'g',
  );

  const smallPath = join(DIST, 'llms-small.txt');
  if (!existsSync(smallPath)) return;

  const content = readFileSync(smallPath, 'utf-8');
  const broken = [];

  for (const match of content.matchAll(LINK_RE)) {
    const mdPath = match[1];
    if (!existsSync(join(DIST, mdPath))) {
      broken.push(match[0]);
    }
  }

  assert.deepEqual(
    broken,
    [],
    `Broken .md links in llms-small.txt:\n${broken.join('\n')}`,
  );
});
