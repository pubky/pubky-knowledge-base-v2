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

function extractTitle(content) {
	const match = content.match(/^title:\s*"?(.+?)"?\s*$/m);
	return match ? match[1] : null;
}

function extractDescription(content) {
	// Check for description in frontmatter
	const fmMatch = content.match(/^description:\s*"?(.+?)"?\s*$/m);
	if (fmMatch) return fmMatch[1];

	// Strip frontmatter
	const body = content.replace(/^---[\s\S]*?---\n*/, '');

	for (const line of body.split('\n')) {
		const trimmed = line.trim();
		if (
			!trimmed ||
			trimmed === '---' ||
			trimmed.startsWith('![') ||
			trimmed.startsWith('#') ||
			trimmed.startsWith('>') ||
			trimmed.startsWith('<') ||
			trimmed.startsWith('|') ||
			trimmed.startsWith('```') ||
			trimmed.startsWith('import ') ||
			trimmed.startsWith('- ') ||
			trimmed.startsWith('* ') ||
			/^-{3,}$/.test(trimmed)
		) {
			continue;
		}
		// Strip markdown formatting but keep text
		const cleaned = trimmed
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
			.replace(/\*\*(.+?)\*\*/g, '$1') // bold
			.replace(/\*(.+?)\*/g, '$1') // italic
			.replace(/`(.+?)`/g, '$1'); // inline code
		// First sentence (must be at least 20 chars to avoid false matches like "Q1.")
		const sentence = cleaned.match(/^(.{20,}?[.!?])\s/);
		if (sentence) return sentence[1];
		if (cleaned.length >= 20) {
			return cleaned.length > 200 ? cleaned.slice(0, 200) + '...' : cleaned;
		}
	}
	return '';
}

const files = walkDir(SRC).sort((a, b) => {
	const ra = relative(SRC, a);
	const rb = relative(SRC, b);
	return ra.localeCompare(rb);
});

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

for (const file of files) {
	const rel = relative(SRC, file);
	if (SKIP.has(rel)) continue;
	const slug = rel.replace(/\.(md|mdx)$/, '');
	const content = readFileSync(file, 'utf-8');
	const title = extractTitle(content) || slug;
	const description = extractDescription(content);
	const url = `${SITE_URL}/${slug}.md`;

	if (INLINE.has(rel)) {
		const body = content.replace(/^---[\s\S]*?---\n*/, '');
		lines.push(`\n# ${title}\n\n${body.trim()}`);
	} else if (description) {
		lines.push(`- [${title}](${url}): ${description}`);
	} else {
		lines.push(`- [${title}](${url})`);
	}
}

writeFileSync(DEST, lines.join('\n') + '\n');
console.log(`Generated ${DEST} with ${files.length} page links`);
