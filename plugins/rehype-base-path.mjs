export default function rehypeBasePath(options = {}) {
	const base = normalizeBase(options.base || '/');

	return (tree) => {
		walk(tree, (node) => {
			if (node.type !== 'element' || !node.properties) return;

			if (node.tagName === 'a' && typeof node.properties.href === 'string') {
				node.properties.href = withBase(node.properties.href, base);
			}

			if (node.tagName === 'img' && typeof node.properties.src === 'string') {
				node.properties.src = withBase(node.properties.src, base);
			}
		});
	};
}

function normalizeBase(base) {
	if (!base || base === '/') return '';
	return `/${base.replace(/^\/+|\/+$/g, '')}`;
}

function withBase(url, base) {
	if (!base) return url;
	if (!url.startsWith('/') || url.startsWith('//')) return url;
	if (url === base || url.startsWith(`${base}/`)) return url;
	return `${base}${url}`;
}

function walk(node, visitor) {
	visitor(node);
	if (!node.children) return;
	for (const child of node.children) {
		walk(child, visitor);
	}
}
