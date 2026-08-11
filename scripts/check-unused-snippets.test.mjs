import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import { SnippetReferenceChecker } from "./check-unused-snippets.mjs";

function checkFixture({
  checkerOptions = { temporaryExclusions: [] },
  docs,
  snippetPath = "snippets/example/source.ts",
  snippets,
}) {
  const fixture = mkdtempSync(join(tmpdir(), "unused-snippets-"));

  try {
    const snippetFile = join(fixture, snippetPath);
    mkdirSync(dirname(snippetFile), { recursive: true });
    mkdirSync(join(fixture, "src/content/docs"), { recursive: true });
    writeFileSync(snippetFile, snippets);
    writeFileSync(join(fixture, "src/content/docs/page.md"), docs);

    return new SnippetReferenceChecker(fixture, checkerOptions).check();
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

test("ignores a temporarily excluded snippet directory before its expiry", () => {
  const temporaryExclusion = {
    directory: "snippets/react-native",
    expiresOn: "2026-09-11",
    reason: "Temporarily unavailable",
  };
  const result = checkFixture({
    checkerOptions: {
      currentDate: new Date("2026-09-10T23:59:59.999Z"),
      temporaryExclusions: [temporaryExclusion],
    },
    docs: "No snippets here\n",
    snippetPath: "snippets/react-native/source.ts",
    snippets:
      "// --8<-- [start:unused]\nconst value = 1;\n// --8<-- [end:unused]\n",
  });

  assert.equal(result.definitionCount, 0);
  assert.deepEqual(result.temporaryExclusions, [temporaryExclusion]);
  assert.deepEqual(result.unused, []);
});

test("rejects an expired temporary exclusion", () => {
  assert.throws(
    () =>
      checkFixture({
        checkerOptions: {
          currentDate: new Date("2026-09-11T00:00:00.000Z"),
          temporaryExclusions: [
            {
              directory: "snippets/react-native",
              expiresOn: "2026-09-11",
              reason: "Temporarily unavailable",
            },
          ],
        },
        docs: "No snippets here\n",
        snippetPath: "snippets/react-native/source.ts",
        snippets:
          "// --8<-- [start:unused]\nconst value = 1;\n// --8<-- [end:unused]\n",
      }),
    /Temporary snippet exclusions have expired:\n- snippets\/react-native \(expired 2026-09-11\)/,
  );
});
