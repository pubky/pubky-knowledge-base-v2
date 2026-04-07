// Generates llms-small.txt as a compact index linking to per-page .md files.
// Overwrites the plugin-generated version after build.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';

const SRC = 'src/content/docs';
const DEST = 'dist/llms-small.txt';
const SKIP = new Set(['index.mdx']);
const INLINE = new Set(['resources.md']);
const SITE_URL = (process.env.SITE_URL || 'https://docs.pubky.org').replace(/\/+$/, '');

function walkDir(dir) {
	const files = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			files.push(...walkDir(full));
		} else if (['.md', '.mdx'].includes(extname(full))) {
			files.push(full);
		}
	}
	return files;
}

function stripFrontmatter(content) {
	return content.replace(/^---[\s\S]*?---\n*/, '');
}

function extractTitle(content) {
	const fm = content.match(/^---([\s\S]*?)---/);
	if (!fm) return null;
	const match = fm[1].match(/^title:\s*"?(.+?)"?\s*$/m);
	return match ? match[1] : null;
}

function extractDescription(content) {
	const fm = content.match(/^---([\s\S]*?)---/);
	if (fm) {
		const desc = fm[1].match(/^description:\s*"?(.+?)"?\s*$/m);
		if (desc) return desc[1];
	}

	const body = stripFrontmatter(content);
	for (const line of body.split('\n')) {
		const trimmed = line.trim();
		if (
			!trimmed ||
			trimmed.startsWith('![') ||
			trimmed.startsWith('#') ||
			trimmed.startsWith('>') ||
			trimmed.startsWith('<') ||
			trimmed.startsWith('|') ||
			trimmed.startsWith('```') ||
			trimmed.startsWith('import ') ||
			trimmed.startsWith('- ') ||
			trimmed.startsWith('* ')
		) {
			continue;
		}
		const cleaned = trimmed
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
			.replace(/\*\*(.+?)\*\*/g, '$1')
			.replace(/\*(.+?)\*/g, '$1')
			.replace(/`(.+?)`/g, '$1');
		// Must be at least 20 chars to avoid false matches like "Q1."
		const sentence = cleaned.match(/^(.{20,}?[.!?])\s/);
		if (sentence) return sentence[1];
		if (cleaned.length >= 20) {
			return cleaned.length > 200 ? cleaned.slice(0, 200) + '...' : cleaned;
		}
	}
	return '';
}

const entries = walkDir(SRC)
	.map((file) => ({ file, rel: relative(SRC, file) }))
	.filter(({ rel }) => !SKIP.has(rel))
	.sort((a, b) => a.rel.localeCompare(b.rel));

const lines = [
	'# Pubky Documentation',
	'',
	'> Pubky is an open protocol for key-based, censorship-resistant web applications.',
	'> It provides identity via public keys, data storage on homeservers, and discovery',
	'> via the Mainline DHT — all over simple HTTP/REST APIs.',
	'',
	`- [Complete documentation](${SITE_URL}/llms-full.txt): all pages in a single file`,
	'',
	'## Pages',
	'',
];

for (const { file, rel } of entries) {
	const content = readFileSync(file, 'utf-8');
	const slug = rel.replace(/\.(md|mdx)$/, '');
	const title = extractTitle(content) || slug;

	if (INLINE.has(rel)) {
		lines.push(`\n# ${title}\n\n${stripFrontmatter(content).trim()}`);
	} else {
		const description = extractDescription(content);
		const url = `${SITE_URL}/${slug}.md`;
		const entry = description ? `- [${title}](${url}): ${description}` : `- [${title}](${url})`;
		lines.push(entry);
	}
}

writeFileSync(DEST, lines.join('\n') + '\n');
console.log(`Generated ${DEST} with ${entries.length} page links`);
