// Adds <lastmod> to every page in the generated sitemap, so crawlers and AI
// indexers can tell which pages changed since their last visit. The date is
// the last commit that touched the page's source: its Markdown file and the
// checked snippet files it embeds, or the components that render the homepage.
//
// A shallow clone has no usable history (every file would carry the date of
// the one fetched commit), so the script then leaves the sitemap unchanged.

import { execFileSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getSnippetReference } from '../plugins/snippet-loader.mjs';

const DIST = 'dist';
const DOCS = 'src/content/docs';
const SITEMAP = join(DIST, 'sitemap-0.xml');
const HOMEPAGE_SOURCES = [
	join(DOCS, 'index.mdx'),
	'src/components/HomeContent.astro',
	'src/components/InstallBlock.astro',
	'src/components/AiResources.astro',
	'src/components/DemoCard.astro',
	'src/components/ImageCard.astro',
	'src/components/TextCard.astro',
];

const git = (...args) => execFileSync('git', args, { encoding: 'utf-8' }).trim();

export function isShallow() {
	return git('rev-parse', '--is-shallow-repository') === 'true';
}

// Source files of the page at a site path such as "/" or "/glossary/".
export function sourcesFor(pathname) {
	const slug = pathname.replace(/^\/+|\/+$/g, '');
	if (slug === '') return HOMEPAGE_SOURCES.filter((file) => existsSync(file));
	const page = [`${slug}.md`, `${slug}.mdx`].map((name) => join(DOCS, name)).find((file) => existsSync(file));
	if (!page) return [];
	const snippets = [...readFileSync(page, 'utf-8').matchAll(/^\s*(?:```|~~~).*$/gm)]
		.map((fence) => getSnippetReference(fence[0]))
		.filter(Boolean)
		.map((reference) => reference.replace(/:[^/:]*$/, ''));
	return [page, ...new Set(snippets)];
}

export function lastModified(files) {
	return files.length ? git('log', '-1', '--format=%cI', '--', ...files) || null : null;
}

// Inserts <lastmod> after each <loc> whose page has a date, replacing an existing one.
export function addLastmod(xml, dateFor) {
	return xml.replace(/<url><loc>([^<]+)<\/loc>(?:<lastmod>[^<]*<\/lastmod>)?/g, (match, loc) => {
		const date = dateFor(new URL(loc).pathname);
		return date ? `<url><loc>${loc}</loc><lastmod>${date}</lastmod>` : match;
	});
}

if (import.meta.url === `file://${process.argv[1]}`) {
	if (isShallow()) {
		console.warn(`Skipped <lastmod> in ${SITEMAP}: the git clone is shallow, so file dates are unknown`);
	} else {
		let count = 0;
		const xml = addLastmod(readFileSync(SITEMAP, 'utf-8'), (pathname) => {
			const date = lastModified(sourcesFor(pathname));
			if (date) count++;
			return date;
		});
		writeFileSync(SITEMAP, xml);
		console.log(`Added <lastmod> to ${count} pages in ${SITEMAP}`);
	}
}
