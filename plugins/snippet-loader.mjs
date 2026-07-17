import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SNIPPET_META = /(?:^|\s)snippet="([^"]+)"/;

/** Return the snippet reference from a code fence's metadata, if present. */
export function getSnippetReference(meta) {
  return meta?.match(SNIPPET_META)?.[1] ?? null;
}

/** Remove the snippet reference while preserving any other code fence metadata. */
export function stripSnippetReference(meta) {
  return meta.replace(/(^|\s+)snippet="[^"]+"/, '$1').trimEnd();
}

/** Read a complete file or an anchored section referenced by a snippet code fence. */
export function loadSnippet(reference, rootDir = process.cwd()) {
  const colonIdx = reference.lastIndexOf(':');
  const filePath = colonIdx !== -1 ? reference.slice(0, colonIdx) : reference;
  const anchor = colonIdx !== -1 ? reference.slice(colonIdx + 1) : null;
  const fullPath = resolve(rootDir, filePath);

  let content;
  try {
    content = readFileSync(fullPath, 'utf-8');
  } catch (err) {
    throw new Error(`snippet-loader: cannot read "${fullPath}": ${err.message}`);
  }

  return anchor ? extractSnippet(content, filePath, anchor) : content.trim();
}

/** Remove common leading whitespace from all lines. */
function dedent(text) {
  const lines = text.split('\n');
  const nonEmpty = lines.filter((line) => line.trim().length > 0);
  if (nonEmpty.length === 0) return text;

  const indent = Math.min(...nonEmpty.map((line) => line.match(/^(\s*)/)[1].length));
  if (indent === 0) return text;

  return lines.map((line) => (line.length >= indent ? line.slice(indent) : line)).join('\n');
}

function extractSnippet(content, filePath, anchor) {
  const startTag = `[start:${anchor}]`;
  const endTag = `[end:${anchor}]`;
  const lines = content.split('\n');
  const startIdx = lines.findIndex((line) => line.includes(startTag));
  const endIdx = lines.findIndex((line, index) => index > startIdx && line.includes(endTag));

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`snippet-loader: anchor "${anchor}" not found in ${filePath}`);
  }

  const filtered = [];
  let skipping = false;
  for (const line of lines.slice(startIdx + 1, endIdx)) {
    if (line.includes('[skip:start]')) {
      skipping = true;
      continue;
    }
    if (line.includes('[skip:end]')) {
      skipping = false;
      continue;
    }
    if (line.includes('--8<--')) continue;
    if (!skipping) filtered.push(line);
  }

  return dedent(filtered.join('\n')).trimEnd();
}
