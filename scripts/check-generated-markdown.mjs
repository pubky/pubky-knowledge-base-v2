import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const DEST = 'dist';
const UNEXPANDED_SNIPPET = /(?:^|\s)snippet="[^"]+"/;
const UNEXPANDED_CODE_LANGUAGE = /(?:^|\s)code-language="[^"]+"/;

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full));
    } else if (extname(full) === '.md' || /^llms.*\.txt$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const failures = walkDir(DEST).filter((file) => {
  const content = readFileSync(file, 'utf-8');
  return UNEXPANDED_SNIPPET.test(content) || UNEXPANDED_CODE_LANGUAGE.test(content);
});

if (failures.length > 0) {
  console.error(`Unexpanded generated Markdown metadata found in:\n${failures.join('\n')}`);
  process.exit(1);
}

console.log('Verified generated Markdown contains no unexpanded snippet or code-language metadata');
