import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { SnippetReferenceChecker } from "./check-unused-snippets.mjs";

function checkFixture({ docs, snippets }) {
  const fixture = mkdtempSync(join(tmpdir(), "unused-snippets-"));

  try {
    mkdirSync(join(fixture, "snippets/example"), { recursive: true });
    mkdirSync(join(fixture, "src/content/docs"), { recursive: true });
    writeFileSync(join(fixture, "snippets/example/source.ts"), snippets);
    writeFileSync(join(fixture, "src/content/docs/page.md"), docs);

    return new SnippetReferenceChecker(fixture).check();
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

test("passes when every snippet anchor is referenced", () => {
  const result = checkFixture({
    snippets:
      "// --8<-- [start:example]\nconst value = 1;\n// --8<-- [end:example]\n",
    docs: '```ts snippet="snippets/example/source.ts:example"\n```\n',
  });

  assert.equal(result.definitionCount, 1);
  assert.deepEqual(result.unused, []);
});

test("finds an unreferenced snippet anchor and its location", () => {
  const result = checkFixture({
    snippets:
      "\n// --8<-- [start:unused]\nconst value = 1;\n// --8<-- [end:unused]\n",
    docs: "No snippets here\n",
  });

  assert.equal(result.definitionCount, 1);
  assert.deepEqual(result.unused, [
    {
      reference: "snippets/example/source.ts:unused",
      line: 2,
    },
  ]);
});
