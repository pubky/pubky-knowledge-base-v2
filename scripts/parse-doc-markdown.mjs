import { load } from 'js-yaml';

// Parse YAML metadata once for both documentation exports. Normalize metadata
// whitespace so multiline YAML values remain one Markdown heading or list item.
export function parseDocMarkdown(content, filename) {
	const frontmatter = content.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	if (!frontmatter) throw new Error(`${filename} has no complete YAML frontmatter`);

	let metadata;
	try {
		metadata = load(frontmatter[1]);
	} catch (error) {
		throw new Error(`${filename} has invalid YAML frontmatter: ${error.message}`, { cause: error });
	}
	if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
		throw new Error(`${filename} frontmatter must be a YAML mapping`);
	}

	const textField = (name, required = false) => {
		const value = metadata[name];
		if (value === undefined && !required) return '';
		if (typeof value !== 'string' || (required && !value.trim())) {
			throw new Error(`${filename} frontmatter ${name} must be ${required ? 'a non-empty string' : 'a string'}`);
		}
		return value.replace(/\s+/g, ' ').trim();
	};

	return {
		title: textField('title', true),
		description: textField('description'),
		body: content.slice(frontmatter[0].length),
	};
}
