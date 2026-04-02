/**
 * Remark plugin that replaces code blocks with snippet references
 * pointing to actual, compiled source files.
 *
 * Usage in markdown:
 *
 *   ```rust snippet="snippets/rust/src/lib.rs:anchor_name"
 *   ```
 *
 * The plugin reads the file, extracts the code between
 *   // --8<-- [start:anchor_name]
 *   // --8<-- [end:anchor_name]
 * and injects it as the code block's content.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default function remarkSnippet() {
  return (tree) => {
    walk(tree);
  };
}

/** Remove common leading whitespace from all lines. */
function dedent(text) {
  const lines = text.split('\n');
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (nonEmpty.length === 0) return text;

  const indent = Math.min(...nonEmpty.map((l) => l.match(/^(\s*)/)[1].length));
  if (indent === 0) return text;

  return lines.map((l) => (l.length >= indent ? l.slice(indent) : l)).join('\n');
}

function walk(node) {
  if (node.type === 'code' && node.meta) {
    const match = node.meta.match(/snippet="([^"]+)"/);
    if (match) {
      const ref = match[1];
      const colonIdx = ref.lastIndexOf(':');
      const filePath = colonIdx !== -1 ? ref.slice(0, colonIdx) : ref;
      const anchor = colonIdx !== -1 ? ref.slice(colonIdx + 1) : null;

      const fullPath = resolve(process.cwd(), filePath);
      let content;
      try {
        content = readFileSync(fullPath, 'utf-8');
      } catch (err) {
        throw new Error(`remark-snippet: cannot read "${fullPath}": ${err.message}`);
      }

      if (anchor) {
        const startTag = `[start:${anchor}]`;
        const endTag = `[end:${anchor}]`;
        const lines = content.split('\n');
        const startIdx = lines.findIndex((l) => l.includes(startTag));
        const endIdx = lines.findIndex((l) => l.includes(endTag));

        if (startIdx === -1 || endIdx === -1) {
          throw new Error(
            `remark-snippet: anchor "${anchor}" not found in ${filePath}`
          );
        }

        node.value = dedent(lines.slice(startIdx + 1, endIdx).join('\n')).trimEnd();
      } else {
        node.value = content.trim();
      }

      // Strip the snippet attribute so downstream plugins don't see it
      node.meta = node.meta.replace(/\s*snippet="[^"]*"/, '').trim() || null;
    }
  }

  if (node.children) {
    for (const child of node.children) {
      walk(child);
    }
  }
}
