import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSnippetReference } from '../plugins/snippet-loader.mjs';

const DOCS_DIR = 'src/content/docs';
const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx']);
const CHECKED_LANGUAGES = new Set([
  'javascript',
  'js',
  'jsx',
  'typescript',
  'ts',
  'tsx',
  'rust',
  'rs',
]);

export function findUncheckedSnippetFences(content) {
  const lines = content.split('\n');
  const failures = [];

  for (let index = 0; index < lines.length; index++) {
    const opening = parseOpeningFence(lines[index]);
    if (!opening) continue;

    const language = opening.info.trim().split(/\s+/, 1)[0].toLowerCase();
    if (CHECKED_LANGUAGES.has(language) && !getSnippetReference(opening.info)) {
      failures.push({ line: index + 1, language });
    }

    const closingIndex = findClosingFence(lines, index + 1, opening.marker);
    if (closingIndex === -1) break;
    index = closingIndex;
  }

  return failures;
}

function parseOpeningFence(line) {
  const match = line.match(/^[ \t]*(`{3,}|~{3,})(.*)$/);
  if (!match) return null;
  return { marker: match[1], info: match[2] };
}

function findClosingFence(lines, startIndex, openingMarker) {
  for (let index = startIndex; index < lines.length; index++) {
    const match = lines[index].match(/^[ \t]*(`{3,}|~{3,})[ \t]*$/);
    if (
      match &&
      match[1][0] === openingMarker[0] &&
      match[1].length >= openingMarker.length
    ) {
      return index;
    }
  }
  return -1;
}

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (MARKDOWN_EXTENSIONS.has(extname(fullPath))) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  const failures = [];

  for (const file of walkDir(DOCS_DIR)) {
    const matches = findUncheckedSnippetFences(readFileSync(file, 'utf-8'));
    for (const match of matches) {
      failures.push(`${relative('.', file)}:${match.line} (${match.language})`);
    }
  }

  if (failures.length > 0) {
    console.error(
      `Unchecked executable code fences found:\n${failures.join('\n')}`,
    );
    console.error(
      'Move each example into snippets/ and add a snippet="..." reference.',
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    'Verified JavaScript, TypeScript, and Rust code fences use checked snippets',
  );
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) main();
