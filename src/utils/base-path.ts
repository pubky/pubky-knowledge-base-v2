const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
	if (!path.startsWith('/') || path.startsWith('//')) return path;
	return `${base}${path}`;
}

export function stripBase(pathname: string): string {
	if (!base) return pathname;
	if (pathname === base) return '/';
	if (pathname.startsWith(`${base}/`)) return pathname.slice(base.length);
	return pathname;
}

export function docsMarkdownPath(pathname: string): string | null {
	const routePath = stripBase(pathname).replace(/\/$/, '');
	if (!routePath || routePath === '/') return null;
	return withBase(`${routePath}.md`);
}
