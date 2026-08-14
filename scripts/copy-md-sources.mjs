// Copies markdown source files into the build output (dist/) with transforms
// that make them more useful for AI agents:
//   - Internal links rewritten to absolute URLs with .md extension
//   - Images removed (no value for text-based AI consumption)
//   - Astro/Starlight components and imports stripped
//   - Presentational frontmatter fields removed
//   - Snippet-backed code blocks expanded from their checked source files
//   - Other fenced code blocks preserved untouched

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative, extname } from 'path';
import {
  getSnippetReference,
  loadSnippet,
  stripSnippetReference,
} from '../plugins/snippet-loader.mjs';
import {
  getCodeLanguage,
  getCodeLanguageLabel,
  stripCodeLanguage,
} from '../plugins/remark-language-code-groups.mjs';

const SRC = 'src/content/docs';
const DEST = 'dist';
const SKIP = new Set(['index.mdx']);
const ALLOWED_EXT = new Set(['.md', '.mdx']);
const SITE_URL = (process.env.SITE_URL || 'https://pubky.org').replace(/\/+$/, '');

function processFile(srcPath, destPath) {
  const content = readFileSync(srcPath, 'utf-8');

  let result = transformDocument(content);
  result = cleanFrontmatter(result);

  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, result);
}

// Applies text transforms outside fenced blocks and materializes snippet-backed
// blocks. The fence indentation is preserved for blocks nested inside lists.
function transformDocument(content) {
  const lines = content.split('\n');
  const output = [];
  let outside = [];

  const flushOutside = () => {
    if (outside.length === 0) return;
    output.push(transformMarkdown(outside.join('\n')));
    outside = [];
  };

  for (let index = 0; index < lines.length; index++) {
    const opening = parseOpeningFence(lines[index]);
    if (!opening) {
      outside.push(lines[index]);
      continue;
    }

    flushOutside();

    const closingIndex = findClosingFence(lines, index + 1, opening.marker);
    if (closingIndex === -1) {
      // Preserve an unclosed block as-is instead of transforming its contents.
      output.push(lines.slice(index).join('\n'));
      index = lines.length;
      break;
    }

    const reference = getSnippetReference(opening.info);
    const codeLanguage = getCodeLanguage(opening.info);
    const languageLabel = codeLanguage
      ? `${opening.indent}**${getCodeLanguageLabel(codeLanguage)}:**`
      : null;

    if (!reference) {
      const info = stripCodeLanguage(opening.info) ?? '';
      if (languageLabel) output.push(languageLabel);
      output.push(
        `${opening.indent}${opening.marker}${info}`,
        ...lines.slice(index + 1, closingIndex + 1),
      );
      index = closingIndex;
      continue;
    }

    const snippet = loadSnippet(reference);
    const marker = safeFenceMarker(opening.marker, snippet);
    const info = stripCodeLanguage(stripSnippetReference(opening.info)) ?? '';
    const closingIndent = lines[closingIndex].match(/^[ \t]*/)[0];
    const snippetLines = snippet.split('\n').map((line) => `${opening.indent}${line}`);

    if (languageLabel) output.push(languageLabel);
    output.push(`${opening.indent}${marker}${info}`, ...snippetLines, `${closingIndent}${marker}`);
    index = closingIndex;
  }

  flushOutside();
  return output.join('\n');
}

function parseOpeningFence(line) {
  const match = line.match(/^([ \t]*)(`{3,}|~{3,})(.*)$/);
  if (!match) return null;
  return { indent: match[1], marker: match[2], info: match[3] };
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

// Ensure snippet content cannot accidentally terminate its own Markdown fence.
function safeFenceMarker(openingMarker, snippet) {
  const markerCharacter = openingMarker[0];
  let markerLength = openingMarker.length;

  for (const line of snippet.split('\n')) {
    const match = line.match(/^[ \t]{0,3}(`+|~+)[ \t]*$/);
    if (match?.[1][0] === markerCharacter) {
      markerLength = Math.max(markerLength, match[1].length + 1);
    }
  }

  return markerCharacter.repeat(markerLength);
}

function transformMarkdown(content) {
  // Strip import statements
  content = content.replace(/^import\s+.*$/gm, '');

  // Strip Astro component tags (opening, closing, self-closing)
  content = content.replace(/^\s*<\/?(Card|CardGrid|LinkCard)[^>]*\/?>\s*$/gm, '');

  // Strip markdown images: ![alt](src)
  content = content.replace(/!\[[^\]]*\]\([^)]*\)/g, '');

  // Rewrite internal links to absolute URLs with .md extension
  // [text](/path/) → [text](https://pubky.org/path.md)
  // [text](/path/#section) → [text](https://pubky.org/path.md#section)
  content = content.replace(/\]\(\/([^)#]+)(#[^)]+)?\)/g, (match, path, fragment) => {
    // Don't transform paths that already have a file extension
    if (/\.\w+$/.test(path)) return match;
    const clean = path.replace(/\/$/, '');
    return `](${SITE_URL}/${clean}.md${fragment || ''})`;
  });

  // Collapse runs of 3+ blank lines left by stripped content
  content = content.replace(/\n{3,}/g, '\n\n');

  return content;
}

function cleanFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return content;

  let fm = match[1];
  fm = fm.replace(/^template:.*$/m, '');
  fm = fm.replace(/^hero:.*$(\n[ \t]+.*$)*/m, '');
  fm = fm.replace(/\n{2,}/g, '\n').trim();

  const rest = content.slice(match[0].length);
  return `---\n${fm}\n---${rest}`;
}

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full));
    } else if (ALLOWED_EXT.has(extname(full))) {
      files.push(full);
    }
  }
  return files;
}

const files = walkDir(SRC);
let count = 0;
for (const file of files) {
  const rel = relative(SRC, file);
  if (SKIP.has(rel)) continue;
  try {
    processFile(file, join(DEST, rel));
    count++;
  } catch (err) {
    console.error(`Failed to process ${rel}: ${err.message}`);
    process.exit(1);
  }
}

console.log(`Copied ${count} markdown source files to ${DEST}/`);
