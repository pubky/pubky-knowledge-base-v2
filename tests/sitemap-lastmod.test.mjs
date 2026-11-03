// Verifies that the generated sitemap tells crawlers when each page last changed.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { addLastmod, isShallow, sourcesFor } from '../scripts/add-sitemap-lastmod.mjs';

const W3C_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;

test('every page in the built sitemap carries a lastmod date', { skip: isShallow() && 'shallow clone, no file history' }, () => {
	const xml = readFileSync(join('dist', 'sitemap-0.xml'), 'utf-8');
	const urls = [...xml.matchAll(/<url>(.*?)<\/url>/g)].map((match) => match[1]);
	assert.ok(urls.length > 30, `expected the docs pages in the sitemap, found ${urls.length}`);
	for (const url of urls) {
		const lastmod = url.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
		assert.match(lastmod ?? '', W3C_DATETIME, `no valid lastmod in ${url}`);
	}
});

test('a page is dated by its source and the snippet files it embeds', () => {
	assert.deepEqual(sourcesFor('/glossary/'), ['src/content/docs/glossary.md']);
	assert.ok(sourcesFor('/developer-guide/').includes('snippets/js/src/developer-guide.ts'));
	assert.ok(sourcesFor('/').includes('src/components/HomeContent.astro'));
	assert.deepEqual(sourcesFor('/no-such-page/'), []);
});

test('lastmod is inserted, replaced, and left out when a page has no date', () => {
	const xml =
		'<urlset><url><loc>https://pubky.org/a/</loc></url>' +
		'<url><loc>https://pubky.org/b/</loc><lastmod>2000-01-01</lastmod></url>' +
		'<url><loc>https://pubky.org/c/</loc></url></urlset>';
	const dates = { '/a/': '2026-10-01T10:00:00Z', '/b/': '2026-10-02T10:00:00Z' };
	assert.equal(
		addLastmod(xml, (pathname) => dates[pathname]),
		'<urlset><url><loc>https://pubky.org/a/</loc><lastmod>2026-10-01T10:00:00Z</lastmod></url>' +
			'<url><loc>https://pubky.org/b/</loc><lastmod>2026-10-02T10:00:00Z</lastmod></url>' +
			'<url><loc>https://pubky.org/c/</loc></url></urlset>',
	);
});
