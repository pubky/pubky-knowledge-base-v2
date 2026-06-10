import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgCard } from '../../lib/og';

// One Open Graph PNG per docs page at /og/<slug>.png, generated at build time.
// The homepage (index) keeps the subtitle-less default card, so it is excluded.
export const getStaticPaths: GetStaticPaths = async () => {
	const docs = await getCollection('docs');
	return docs
		.filter((entry) => entry.id !== 'index')
		.map((entry) => ({
			params: { slug: entry.id },
			props: { title: entry.data.title },
		}));
};

export const GET: APIRoute = async ({ props }) => {
	const png = await renderOgCard(props.title as string);
	return new Response(new Uint8Array(png), {
		headers: { 'Content-Type': 'image/png' },
	});
};
