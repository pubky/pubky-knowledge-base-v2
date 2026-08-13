import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

const IGNORED_DIRECTORIES = new Set(["node_modules", "target"]);
const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);
const SNIPPET_START_PATTERN = /--8<--\s*\[start:([^\]]+)\]/g;
const SNIPPET_REFERENCE_PATTERN = /(?:^|\s)snippet="([^"]+)"/g;
const TEMPORARY_EXCLUSIONS = [
  {
    directory: "snippets/react-native",
    expiresOn: "2026-09-11",
    reason:
      "The React Native library is not yet ready; the snippets will be reintroduced once the React Native library is on SDK version 0.10.0 as well.",
  },
];

export class SnippetReferenceChecker {
  constructor(
    rootDirectory = process.cwd(),
    {
      currentDate = new Date(),
      temporaryExclusions = TEMPORARY_EXCLUSIONS,
    } = {},
  ) {
    this.rootDirectory = rootDirectory;
    this.snippetsDirectory = join(rootDirectory, "snippets");
    this.docsDirectory = join(rootDirectory, "src/content/docs");
    this.currentDate = currentDate;
    this.temporaryExclusions = temporaryExclusions;
  }

  check() {
    this.assertRequiredDirectoriesExist();
    this.assertTemporaryExclusionsHaveNotExpired();

    const definitions = this.findDefinitions();
    const references = this.findReferences();
    const unused = definitions.filter(
      ({ reference }) => !references.has(reference),
    );

    return {
      definitionCount: definitions.length,
      temporaryExclusions: this.temporaryExclusions,
      unused,
    };
  }

  assertTemporaryExclusionsHaveNotExpired() {
    const expired = this.temporaryExclusions.filter(
      ({ expiresOn }) => this.currentDate >= this.expirationDate(expiresOn),
    );

    if (expired.length === 0) return;

    const details = expired.map(
      ({ directory, expiresOn }) => `- ${directory} (expired ${expiresOn})`,
    );
    throw new Error(
      [
        "Temporary snippet exclusions have expired:",
        ...details,
        "Remove or update each exclusion before running the check again.",
      ].join("\n"),
    );
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
        if (this.isTemporarilyExcluded(fullPath)) continue;
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

  isTemporarilyExcluded(directory) {
    const referencePath = this.toReferencePath(directory);
    return this.temporaryExclusions.some(
      (exclusion) =>
        this.normalizeReference(exclusion.directory) === referencePath,
    );
  }

  expirationDate(date) {
    const expiration = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(expiration.getTime())) {
      throw new Error(`Invalid temporary exclusion expiry date: ${date}`);
    }
    return expiration;
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
    const { definitionCount, temporaryExclusions, unused } =
      new SnippetReferenceChecker().check();

    for (const { directory, expiresOn, reason } of temporaryExclusions) {
      console.log(
        `Temporarily excluding ${directory} until ${expiresOn}: ${reason}`,
      );
    }

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
