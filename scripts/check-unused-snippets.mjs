import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

const IGNORED_DIRECTORIES = new Set(["node_modules", "target"]);
const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);
const SNIPPET_START_PATTERN = /--8<--\s*\[start:([^\]]+)\]/g;
const SNIPPET_REFERENCE_PATTERN = /(?:^|\s)snippet="([^"]+)"/g;

export class SnippetReferenceChecker {
  constructor(rootDirectory = process.cwd()) {
    this.rootDirectory = rootDirectory;
    this.snippetsDirectory = join(rootDirectory, "snippets");
    this.docsDirectory = join(rootDirectory, "src/content/docs");
  }

  check() {
    this.assertRequiredDirectoriesExist();

    const definitions = this.findDefinitions();
    const references = this.findReferences();
    const unused = definitions.filter(
      ({ reference }) => !references.has(reference),
    );

    return { definitionCount: definitions.length, unused };
  }

  assertRequiredDirectoriesExist() {
    for (const directory of [this.snippetsDirectory, this.docsDirectory]) {
      if (!existsSync(directory)) {
        throw new Error(
          `Missing required directory: ${this.toReferencePath(directory)}`,
        );
      }
    }
  }

  findDefinitions() {
    const definitions = [];

    for (const file of this.walkFiles(this.snippetsDirectory)) {
      const content = readFileSync(file, "utf8");

      for (const match of content.matchAll(SNIPPET_START_PATTERN)) {
        definitions.push({
          reference: `${this.toReferencePath(file)}:${match[1]}`,
          line: this.lineNumberAt(content, match.index),
        });
      }
    }

    return definitions;
  }

  findReferences() {
    const references = new Set();
    const markdownFiles = this.walkFiles(this.docsDirectory, (file) =>
      MARKDOWN_EXTENSIONS.has(extname(file)),
    );

    for (const file of markdownFiles) {
      const content = readFileSync(file, "utf8");

      for (const match of content.matchAll(SNIPPET_REFERENCE_PATTERN)) {
        references.add(this.normalizeReference(match[1]));
      }
    }

    return references;
  }

  walkFiles(directory, includeFile = () => true) {
    const files = [];

    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;

      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.walkFiles(fullPath, includeFile));
      } else if (entry.isFile() && includeFile(fullPath)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  toReferencePath(file) {
    return relative(this.rootDirectory, file).split(sep).join("/");
  }

  normalizeReference(reference) {
    return reference.replaceAll("\\", "/").replace(/^\.\//, "");
  }

  lineNumberAt(content, index) {
    return content.slice(0, index).split("\n").length;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const { definitionCount, unused } = new SnippetReferenceChecker().check();

    if (unused.length > 0) {
      console.error(
        "Unused snippets found. Remove these snippet blocks from their source files:",
      );
      for (const { reference, line } of unused) {
        console.error(`- ${reference} (line ${line})`);
      }
      process.exitCode = 1;
    } else {
      console.log(
        `Verified all ${definitionCount} snippet anchors are referenced by the docs`,
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
