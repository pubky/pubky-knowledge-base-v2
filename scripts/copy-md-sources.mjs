// Copies markdown source files into the build output (dist/) with transforms
// that make them more useful for AI agents:
//   - Internal links rewritten to absolute URLs with .md extension
//   - Images removed (no value for text-based AI consumption)
//   - Astro/Starlight components and imports stripped
//   - Presentational frontmatter fields removed
//   - Fenced code blocks are preserved untouched

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative, extname } from 'path';

const SRC = 'src/content/docs';
const DEST = 'dist';
const SKIP = new Set(['index.mdx']);
const ALLOWED_EXT = new Set(['.md', '.mdx']);
const SITE_URL = (process.env.SITE_URL || 'https://docs.pubky.org').replace(/\/+$/, '');

function processFile(srcPath, destPath) {
  const content = readFileSync(srcPath, 'utf-8');

  let result = transformOutsideCodeBlocks(content);
  result = cleanFrontmatter(result);

  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, result);
}

// Splits content on fenced code block boundaries and only applies transforms
// to segments outside code blocks. Code blocks are passed through unchanged.
function transformOutsideCodeBlocks(content) {
  const lines = content.split('\n');
  const segments = [];
  let current = [];
  let inCode = false;

  for (const line of lines) {
    if (/^```/.test(line)) {
      if (!inCode) {
        segments.push(transformMarkdown(current.join('\n')));
        current = [line];
        inCode = true;
      } else {
        current.push(line);
        segments.push(current.join('\n'));
        current = [];
        inCode = false;
      }
    } else {
      current.push(line);
    }
  }
  // Flush remaining (treat unclosed code block as code to be safe)
  if (current.length) {
    segments.push(inCode ? current.join('\n') : transformMarkdown(current.join('\n')));
  }

  return segments.join('\n');
}

function transformMarkdown(content) {
  // Strip import statements
  content = content.replace(/^import\s+.*$/gm, '');

  // Strip Astro component tags (opening, closing, self-closing)
  content = content.replace(/^\s*<\/?(Card|CardGrid|LinkCard)[^>]*\/?>\s*$/gm, '');

  // Strip markdown images: ![alt](src)
  content = content.replace(/!\[[^\]]*\]\([^)]*\)/g, '');

  // Rewrite internal links to absolute URLs with .md extension
  // [text](/path/) → [text](https://docs.pubky.org/path.md)
  // [text](/path/#section) → [text](https://docs.pubky.org/path.md#section)
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
