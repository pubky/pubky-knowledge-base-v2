// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';
import starlightLlmsTxt from 'starlight-llms-txt';
import rehypeBasePath from './plugins/rehype-base-path.mjs';
import remarkSnippet from './plugins/remark-snippet.mjs';
import remarkLanguageCodeGroups from './plugins/remark-language-code-groups.mjs';

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL || 'https://pubky.org',
	redirects: {
		'/docs': {
			status: 301,
			destination: '/',
		},
		'/explore/pubkycore/introduction/': {
			status: 301,
			destination: '/explore/pubky-protocol/introduction/',
		},
		'/explore/pubkycore/getting-started/': {
			status: 301,
			destination: '/explore/pubky-protocol/getting-started/',
		},
		'/explore/pubkycore/eli5/': {
			status: 301,
			destination: '/explore/pubky-protocol/eli5/',
		},
		'/explore/pubkycore/authentication/': {
			status: 301,
			destination: '/explore/pubky-protocol/authentication/',
		},
		'/explore/pubkycore/homeserver/': {
			status: 301,
			destination: '/explore/pubky-protocol/homeserver/',
		},
		'/explore/pubkycore/api/': {
			status: 301,
			destination: '/explore/pubky-protocol/api/',
		},
		'/explore/pubkycore/sdk/': {
			status: 301,
			destination: '/explore/pubky-protocol/sdk/',
		},
		'/explore/pubkycore/security-model/': {
			status: 301,
			destination: '/explore/pubky-protocol/security-model/',
		},
		'/explore/pubkycore/pkarr/introduction/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/introduction/',
		},
		'/explore/pubkycore/pkarr/why-pkarr/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/why-pkarr/',
		},
		'/explore/pubkycore/pkarr/getting-started/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/getting-started/',
		},
		'/explore/pubkycore/pkarr/expectations/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/expectations/',
		},
		'/explore/pubkycore/pkarr/architecture/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/architecture/',
		},
		'/explore/pubkycore/pkarr/eli5/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/eli5/',
		},
	},
	base: process.env.BASE_PATH || '/',
	markdown: {
		remarkPlugins: [remarkSnippet, remarkLanguageCodeGroups],
		rehypePlugins: [[rehypeBasePath, { base: process.env.BASE_PATH || '/' }]],
	},
	integrations: [
		starlight({
			title: 'Pubky',
			logo: {
				src: './src/assets/pubky-logo.webp',
				alt: 'Pubky',
				replacesTitle: true,
			},
			favicon: '/favicon.svg',
			head: [
				{
					tag: 'script',
					attrs: {
						defer: true,
						'data-domain': 'pubky.org',
						src: 'https://_analytics.synonym.to/js/script.outbound-links.js',
					},
				},
				// Open Graph card metadata. The og:image itself is emitted per-page by
				// the custom Head component (src/components/Head.astro) — default card
				// for the homepage, generated per-page card elsewhere. All cards are 1200x630.
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
			],
			plugins: [
				starlightClientMermaid(),
				starlightLlmsTxt({
					projectName: 'Pubky Documentation',
					description:
						'Pubky is an open protocol for key-based, censorship-resistant web applications. ' +
						'It provides identity via public keys, data storage on homeservers, and discovery ' +
						'via the Mainline DHT — all over simple HTTP/REST APIs.',
					exclude: [
						'index',
						'overview',
						'comparisons',
						'faq',
						'troubleshooting',
						'contributing',
						'getting-started',
						'the-vision-of-pubky',
						'glossary',
						'tldr',
						'explore/technologies/https',
						'explore/technologies/key-pair',
						'explore/technologies/dht',
						'explore/technologies/dns',
						'explore/technologies/doh',
						'explore/technologies/pubky-explorer',
						'explore/technologies/pubky-ring',
						'explore/pubky-protocol/eli5',
						'explore/pubky-protocol/pkarr/eli5',
						'explore/pubky-protocol/pkarr/getting-started',
						'explore/pubky-protocol/pkarr/why-pkarr',
						'explore/pubky-protocol/pkarr/expectations',
						'explore/pubky-apps/eli5',
						'explore/pubky-apps/app-architectures/introduction',
						'explore/pubky-apps/app-architectures/client-homeserver',
						'explore/pubky-apps/app-architectures/global-aggregators',
						'explore/pubky-apps/indexing-and-aggregation/introduction',
						'explore/pubky-apps/indexing-and-aggregation/aggregator',
						'explore/pubky-apps/indexing-and-aggregation/indexer',
						'explore/pubky-apps/indexing-and-aggregation/web-server',
						'explore/pubky-apps/reference-app/introduction',
						'explore/pubky-apps/reference-app/pubky-app',
						'explore/pubky-apps/reference-app/features/**',
						'explore/concepts/censorship',
						'explore/concepts/credible-exit',
						'resources',
					],
				}),
			],
			tableOfContents: false,
			customCss: ['./src/styles/custom.css'],
			components: {
				Head: './src/components/Head.astro',
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
				SocialIcons: './src/components/SocialIcons.astro',
				Hero: './src/components/HeroOverride.astro',
				Header: './src/components/Header.astro',
				Footer: './src/components/Footer.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/pubky' },
				{ icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/getpubky' },
				{ icon: 'telegram', label: 'Telegram', href: 'https://t.me/pubkycore' },
			],
			sidebar: [
				{ label: 'Home', slug: 'index' },
				{ label: 'Overview', slug: 'overview' },
				{ label: 'Getting Started', slug: 'getting-started' },
				{ label: 'TL;DR', slug: 'tldr' },
				{ label: 'FAQ', slug: 'faq' },
				{ label: 'Glossary', slug: 'glossary' },
				{ label: 'Architecture', slug: 'architecture' },
				{ label: 'The Vision of Pubky', slug: 'the-vision-of-pubky' },
				{ label: 'Comparisons', slug: 'comparisons' },
				{ label: 'Contributing', slug: 'contributing' },
				{ label: 'Resources', slug: 'resources' },
				{ label: 'Troubleshooting', slug: 'troubleshooting' },
				{
					label: 'Concepts',
					items: [
						{ label: 'Censorship', slug: 'explore/concepts/censorship' },
						{ label: 'Credible Exit', slug: 'explore/concepts/credible-exit' },
						{ label: 'Semantic Social Graph', slug: 'explore/concepts/semantic-social-graph' },
					],
				},
				{
					label: 'Pubky Protocol',
					items: [
						{ label: 'Introduction', slug: 'explore/pubky-protocol/introduction' },
						{ label: 'Developer Guide', slug: 'explore/pubky-protocol/getting-started' },
						{ label: 'ELI5', slug: 'explore/pubky-protocol/eli5' },
						{ label: 'Authentication', slug: 'explore/pubky-protocol/authentication' },
						{ label: 'Homeserver', slug: 'explore/pubky-protocol/homeserver' },
						{ label: 'API', slug: 'explore/pubky-protocol/api' },
						{ label: 'SDK', slug: 'explore/pubky-protocol/sdk' },
						{ label: 'Security Model', slug: 'explore/pubky-protocol/security-model' },
						{
							label: 'Pkarr',
							items: [
								{ label: 'Introduction', slug: 'explore/pubky-protocol/pkarr/introduction' },
								{ label: 'Why Pkarr', slug: 'explore/pubky-protocol/pkarr/why-pkarr' },
								{ label: 'Getting Started', slug: 'explore/pubky-protocol/pkarr/getting-started' },
								{ label: 'Expectations', slug: 'explore/pubky-protocol/pkarr/expectations' },
								{ label: 'Architecture', slug: 'explore/pubky-protocol/pkarr/architecture' },
								{ label: 'ELI5', slug: 'explore/pubky-protocol/pkarr/eli5' },
							],
						},
					],
				},
				{
					label: 'Pubky Apps',
					items: [
						{ label: 'Introduction', slug: 'explore/pubky-apps/introduction' },
						{ label: 'ELI5', slug: 'explore/pubky-apps/eli5' },
						{ label: 'App Specs', slug: 'explore/pubky-apps/app-specs' },
						{
							label: 'App Architectures',
							items: [
								{ label: 'Introduction', slug: 'explore/pubky-apps/app-architectures/introduction' },
								{ label: 'Client ↔ Homeserver', slug: 'explore/pubky-apps/app-architectures/client-homeserver' },
								{ label: 'Global Aggregators', slug: 'explore/pubky-apps/app-architectures/global-aggregators' },
								{ label: 'Custom Backend', slug: 'explore/pubky-apps/app-architectures/custom-backend' },
							],
						},
						{
							label: 'Indexing & Aggregation',
							items: [
								{ label: 'Introduction', slug: 'explore/pubky-apps/indexing-and-aggregation/introduction' },
								{ label: 'Indexer', slug: 'explore/pubky-apps/indexing-and-aggregation/indexer' },
								{ label: 'Aggregator', slug: 'explore/pubky-apps/indexing-and-aggregation/aggregator' },
								{ label: 'Pubky Nexus', slug: 'explore/pubky-apps/indexing-and-aggregation/pubky-nexus' },
								{ label: 'Web Server', slug: 'explore/pubky-apps/indexing-and-aggregation/web-server' },
							],
						},
						{
							label: 'Reference App',
							items: [
								{ label: 'Introduction', slug: 'explore/pubky-apps/reference-app/introduction' },
								{ label: 'pubky.app', slug: 'explore/pubky-apps/reference-app/pubky-app' },
								{ label: 'Bookmarks', slug: 'explore/pubky-apps/reference-app/features/bookmarks' },
								{ label: 'Layouts', slug: 'explore/pubky-apps/reference-app/features/layouts' },
								{ label: 'Notifications', slug: 'explore/pubky-apps/reference-app/features/notifications' },
								{ label: 'Perspectives', slug: 'explore/pubky-apps/reference-app/features/perspectives' },
								{ label: 'Posts', slug: 'explore/pubky-apps/reference-app/features/posts' },
								{ label: 'Profiles', slug: 'explore/pubky-apps/reference-app/features/profiles' },
								{ label: 'Search', slug: 'explore/pubky-apps/reference-app/features/search' },
								{ label: 'Tags', slug: 'explore/pubky-apps/reference-app/features/tags' },
								{ label: 'Trends', slug: 'explore/pubky-apps/reference-app/features/trends' },
							],
						},
					],
				},
				{
					label: 'Technologies',
					autogenerate: { directory: 'explore/technologies' },
				},
			],
		}),
	],
});
