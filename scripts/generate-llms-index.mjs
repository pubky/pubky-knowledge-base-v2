// Generates the two LLM entry points from the per-page Markdown files that
// scripts/copy-md-sources.mjs writes to dist/, in the order of the sidebar:
//   - llms.txt: an index in the llms.txt format (https://llmstxt.org), one
//     section per sidebar group, each page linked as Markdown with its description
//   - llms-full.txt: every documentation page in one file, without the homepage
// Absolute links in the per-page files keep working when an agent reads
// llms-full.txt out of context.

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { sidebar } from '../src/config/sidebar.mjs';
import { parseDocMarkdown } from './parse-doc-markdown.mjs';

const DEST = 'dist';
const SITE_URL = (process.env.SITE_URL || 'https://pubky.org').replace(/\/+$/, '');
const TITLE = 'Pubky Documentation';
const SUMMARY =
	'Pubky is an open protocol for key-based, censorship-resistant web applications. ' +
	'It provides identity via public keys, data storage on Homeservers, and discovery ' +
	'via the Mainline DHT, all over HTTP.';

function readPage(slug) {
	const content = readFileSync(join(DEST, `${slug}.md`), 'utf-8');
	const { title, description, body } = parseDocMarkdown(content, `${slug}.md`);
	return {
		slug,
		title,
		description,
		url: `${SITE_URL}/${slug}.md`,
		body: body.trim(),
	};
}

const groups = sidebar.map((group) => ({
	label: group.label,
	pages: group.items.map((item) => readPage(item.slug)),
}));
const pages = groups.flatMap((group) => group.pages);

const index = [
	`# ${TITLE}`,
	'',
	`> ${SUMMARY}`,
	'',
	`Every page below is plain Markdown. [llms-full.txt](${SITE_URL}/llms-full.txt) holds all of them in one file, in this order; [llms-small.txt](${SITE_URL}/llms-small.txt) lists them alphabetically with the resources list inline.`,
];
for (const group of groups) {
	index.push('', `## ${group.label}`, '');
	for (const page of group.pages) {
		index.push(page.description ? `- [${page.title}](${page.url}): ${page.description}` : `- [${page.title}](${page.url})`);
	}
}
writeFileSync(join(DEST, 'llms.txt'), index.join('\n') + '\n');

const full = pages.map((page) =>
	[`# ${page.title}`, page.description && `> ${page.description}`, `Source: ${page.url}`, page.body]
		.filter(Boolean)
		.join('\n\n'),
);
writeFileSync(join(DEST, 'llms-full.txt'), [`<SYSTEM>The full documentation for ${TITLE}. ${SUMMARY}</SYSTEM>`, ...full].join('\n\n') + '\n');

console.log(`Generated ${DEST}/llms.txt and ${DEST}/llms-full.txt with ${pages.length} pages in ${groups.length} sections`);
