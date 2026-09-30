import { fromMarkdown } from 'mdast-util-from-markdown';
import { pinned_homeserver_release } from '../src/config/releases.mjs';

const placeholder = '{{pinned_homeserver_release}}';
const prefixes = ['blob', 'tree'].map(
  (kind) => `https://github.com/pubky/pubky-homeserver/${kind}/${placeholder}`,
);

function releasePrefix(url) {
  return prefixes.find((prefix) => url.startsWith(prefix) && (
    url.length === prefix.length || '/?#'.includes(url[prefix.length])
  ));
}

// Substitute only the explicit release placeholder in this repository's ref
// position. Keep the rest of the URL exactly as authored.
export function resolveReleaseUrl(url) {
  const prefix = releasePrefix(url);
  if (!prefix) return url;
  return prefix.slice(0, -placeholder.length) + pinned_homeserver_release + url.slice(prefix.length);
}

// Use the Markdown syntax tree to locate links, then edit only their release
// tokens in the original source. Re-serializing the tree would change code
// fences, formatting, and other content in the downloadable Markdown.
export function resolveReleaseLinks(markdown) {
  if (!markdown.includes(placeholder)) return markdown;

  // Frontmatter is metadata, not Markdown. Mask it while retaining offsets.
  const source = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/,
    (frontmatter) => frontmatter.replace(/[^\r\n]/g, ' '));
  const replacements = [];

  function walk(node) {
    if (node.type === 'link' || node.type === 'definition') {
      const prefix = releasePrefix(node.url);
      if (prefix) {
        const destination = destinationOffset(node, markdown);
        if (destination !== null && markdown.startsWith(prefix, destination)) {
          replacements.push(destination + prefix.length - placeholder.length);
        }
      }
    }
    for (const child of node.children || []) walk(child);
  }

  walk(fromMarkdown(source));

  // Work backwards so earlier source offsets stay valid.
  for (const offset of replacements.sort((a, b) => b - a)) {
    markdown = markdown.slice(0, offset) + pinned_homeserver_release +
      markdown.slice(offset + placeholder.length);
  }
  return markdown;
}

function destinationOffset(node, markdown) {
  const start = node.position.start.offset;
  const end = node.position.end.offset;

  if (node.type === 'definition') {
    const opening = markdown.slice(start, end).match(/^\[(?:\\[\s\S]|[^\]\\])*\]:[ \t\r\n]*<?/);
    return opening ? start + opening[0].length : null;
  }

  // An autolink's destination starts immediately after its opening angle bracket.
  if (markdown[start] === '<') return start + 1;

  // Skip the entire label, including nested formatting or images, so a URL in
  // a label or title cannot be mistaken for the link destination.
  const labelEnd = node.children.at(-1)?.position.end.offset ?? start + 1;
  const opening = markdown.slice(labelEnd, end).match(/^[ \t\r\n]*\]\([ \t\r\n]*<?/);
  return opening ? labelEnd + opening[0].length : null;
}
