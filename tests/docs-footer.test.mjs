import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isShallow } from '../scripts/add-sitemap-lastmod.mjs';
import { pinned_homeserver_release } from '../src/config/releases.mjs';

test('every docs page shows the shared SDK version in its menu and its own update date in the footer', () => {
	const xml = readFileSync('dist/sitemap-0.xml', 'utf-8');
	const base = (process.env.BASE_PATH || '/').replace(/^\/+|\/+$/g, '');
	const shallow = isShallow();
	let count = 0;
	for (const [, url] of xml.matchAll(/<url>(.*?)<\/url>/g)) {
		const pathname = new URL(url.match(/<loc>([^<]+)<\/loc>/)[1]).pathname;
		const path = pathname.slice(base ? base.length + 2 : 1).replace(/\/+$/, '');
		if (!path) continue;
		const html = readFileSync(join('dist', path, 'index.html'), 'utf-8');
		const metadata = html.match(/<div\b[^>]*data-docs-metadata[^>]*>([\s\S]*?)<\/div>/)?.[1];
		assert.ok(metadata, `missing docs footer on ${pathname}`);
		const sdk = html.match(/<(?:div|p)\b[^>]*data-sdk-version[^>]*>([\s\S]*?)<\/(?:div|p)>/)?.[1];
		assert.ok(sdk?.includes(`Covers Pubky SDK ${pinned_homeserver_release}`), `missing menu SDK version on ${pathname}`);
		assert.equal([...html.matchAll(/data-sdk-version/g)].length, 1, `duplicate SDK version on ${pathname}`);
		assert.ok(!metadata.includes('SDK'), `SDK version remains in page footer on ${pathname}`);
		assert.ok(metadata.includes('Last updated:'), pathname);
		if (shallow) {
			assert.ok(metadata.includes('Unavailable'), pathname);
			assert.ok(!metadata.includes('<time'), pathname);
		} else {
			const lastmod = url.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
			const datetime = metadata.match(/<time\b[^>]*datetime="([^"]+)"/)?.[1];
			assert.ok(lastmod, `missing sitemap date for ${pathname}`);
			assert.equal(Date.parse(datetime), Date.parse(lastmod), `footer date differs from sitemap on ${pathname}`);
		}
		count++;
	}
	assert.ok(count > 30, `expected all docs pages, checked ${count}`);
});

test('the landing and error pages omit documentation metadata', () => {
	for (const file of ['dist/index.html', 'dist/404.html']) {
		const html = readFileSync(file, 'utf-8');
		assert.ok(!html.includes('data-docs-metadata'), file);
		assert.ok(!html.includes('data-sdk-version'), file);
	}
});
