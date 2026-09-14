import { resolveReleaseUrl } from './release-links.mjs';

// Markdown and MDX share this transform, including reference-link definitions.
export default function remarkReleaseLinks() {
  return (tree) => {
    function walk(node) {
      if (node.type === 'link' || node.type === 'definition') {
        node.url = resolveReleaseUrl(node.url);
      }
      for (const child of node.children || []) walk(child);
    }
    walk(tree);
  };
}
