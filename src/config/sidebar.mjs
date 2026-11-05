// Documentation navigation, shared by the Starlight sidebar (astro.config.mjs)
// and the LLM index generator (scripts/generate-llms-index.mjs).
export const sidebar = [
	{
		label: 'Learn about Pubky',
		collapsed: true,
		items: [
			{ label: 'Overview', slug: 'overview' },
			{ label: 'System Architecture', slug: 'architecture' },
			{ label: 'Security Model', slug: 'security-model' },
			{ label: 'pubky.app Reference App', slug: 'pubky-app' },
			{ label: 'Semantic Social Graph', slug: 'semantic-social-graph' },
			{ label: 'Credible Exit', slug: 'credible-exit' },
			{ label: 'Censorship Resistance', slug: 'censorship-resistance' },
		],
	},
	{
		label: 'Use Pubky',
		collapsed: true,
		items: [
			{ label: 'First Steps', slug: 'getting-started' },
			{ label: 'Pubky Ring', slug: 'pubky-ring' },
			{ label: 'Pubky Passport', slug: 'pubky-passport' },
			{ label: 'Pubky Market', slug: 'pubky-market' },
			{ label: 'Pubky Backup', slug: 'pubky-backup' },
		],
	},
	{
		label: 'Development',
		collapsed: true,
		items: [
			{ label: 'Developer Guide', slug: 'developer-guide' },
			{ label: 'SDK', slug: 'sdk' },
			{ label: 'App Architectures', slug: 'app-architectures' },
			{ label: 'Authentication', slug: 'authentication' },
			{ label: 'Private Storage', slug: 'private-storage' },
			{ label: 'pubky-app-specs', slug: 'pubky-app-specs' },
			{ label: 'Indexing & Aggregation', slug: 'indexing-and-aggregation' },
			{ label: 'Pubky Docker', slug: 'pubky-docker' },
			{ label: 'Pubky Explorer', slug: 'pubky-explorer' },
			{ label: 'Contributing', slug: 'contributing' },
		],
	},
	{
		label: 'Components & services',
		collapsed: true,
		items: [
			{ label: 'Homeserver', slug: 'homeserver' },
			{ label: 'Pubky Nexus', slug: 'pubky-nexus' },
			{ label: 'PKARR', slug: 'pkarr' },
			{ label: 'Mainline DHT', slug: 'mainline-dht' },
			{ label: 'PKDNS', slug: 'pkdns' },
			{ label: 'HTTP Relay', slug: 'http-relay' },
			{ label: 'Homegate', slug: 'homegate' },
			{ label: 'Pubky Noise', slug: 'pubky-noise' },
			{ label: 'Paykit', slug: 'paykit' },
			{ label: 'Pubky Locks', slug: 'pubky-locks' },
		],
	},
	{
		label: 'Reference',
		collapsed: true,
		items: [
			{ label: 'Glossary', slug: 'glossary' },
			{ label: 'Comparisons', slug: 'comparisons' },
			{ label: 'Resources', slug: 'resources' },
		],
	},
];
