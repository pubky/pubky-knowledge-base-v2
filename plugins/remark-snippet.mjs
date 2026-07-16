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
 *
 * Lines between
 *   // --8<-- [skip:start]
 *   // --8<-- [skip:end]
 * are stripped from the rendered snippet (useful for verification-only
 * code that should compile but not appear in the docs).
 *
 * Snippet marker lines inside a rendered snippet are also stripped, which
 * allows nested anchors for rendering smaller sections of one checked file.
 */

import {
  getSnippetReference,
  loadSnippet,
  stripSnippetReference,
} from './snippet-loader.mjs';

export default function remarkSnippet() {
  return (tree) => {
    walk(tree);
  };
}

function walk(node) {
  if (node.type === 'code' && node.meta) {
    const reference = getSnippetReference(node.meta);
    if (reference) {
      node.value = loadSnippet(reference);
      // Strip the snippet attribute so downstream plugins don't see it
      node.meta = stripSnippetReference(node.meta).trim() || null;
    }
  }

  if (node.children) {
    for (const child of node.children) {
      walk(child);
    }
  }
}
