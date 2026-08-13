import assert from 'node:assert/strict';
import test from 'node:test';
import { findUncheckedSnippetFences } from '../scripts/check-snippet-fences.mjs';

test('accepts checked executable code fences', () => {
  const markdown = [
    '```javascript snippet="snippets/js/src/sdk.ts:js_quick_example"',
    '```',
    '',
    '~~~rust snippet="snippets/rust/src/lib.rs:rust_quick_example"',
    '~~~',
  ].join('\n');

  assert.deepEqual(findUncheckedSnippetFences(markdown), []);
});

test('reports unchecked JavaScript, TypeScript, and Rust aliases', () => {
  const markdown = [
    '# Examples',
    '',
    '```js',
    'const pubky = Pubky.testnet();',
    '```',
    '',
    '```tsx title="Example"',
    '<PubkyProvider />',
    '```',
    '',
    '```rs',
    'let pubky = Pubky::new()?;',
    '```',
  ].join('\n');

  assert.deepEqual(findUncheckedSnippetFences(markdown), [
    { line: 3, language: 'js' },
    { line: 7, language: 'tsx' },
    { line: 11, language: 'rs' },
  ]);
});

test('ignores other languages and executable fences shown inside a longer fence', () => {
  const markdown = [
    '```bash',
    'npm install @synonymdev/pubky',
    '```',
    '',
    '````markdown',
    '```typescript',
    '```',
    '````',
  ].join('\n');

  assert.deepEqual(findUncheckedSnippetFences(markdown), []);
});

test('supports indented and tilde fences', () => {
  const markdown = [
    '  ~~~typescript',
    '  const pubky = Pubky.testnet();',
    '  ~~~',
  ].join('\n');

  assert.deepEqual(findUncheckedSnippetFences(markdown), [
    { line: 1, language: 'typescript' },
  ]);
});
