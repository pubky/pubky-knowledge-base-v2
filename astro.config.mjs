// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';
import starlightLlmsTxt from 'starlight-llms-txt';
import rehypeBasePath from './plugins/rehype-base-path.mjs';
import remarkSnippet from './plugins/remark-snippet.mjs';

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL || 'https://pubky.org',
	redirects: {
		'/faq/': {
			status: 301,
			destination: '/overview/',
		},
		'/explore/technologies/pubky-cli/': {
			status: 301,
			destination: '/explore/pubky-protocol/getting-started/',
		},
		'/tldr/': {
			status: 301,
			destination: '/overview/',
		},
		'/explore/pubky-apps/eli5/': {
			status: 301,
			destination: '/explore/pubky-apps/introduction/',
		},
		'/explore/pubky-apps/reference-app/introduction/': {
			status: 301,
			destination: '/explore/pubky-apps/reference-app/pubky-app/',
		},
		'/explore/pubky-apps/app-architectures/client-homeserver/': {
			status: 301,
			destination: '/explore/pubky-apps/app-architectures/introduction/',
		},
		'/explore/pubky-apps/app-architectures/custom-backend/': {
			status: 301,
			destination: '/explore/pubky-apps/app-architectures/introduction/',
		},
		'/explore/pubky-apps/app-architectures/global-aggregators/': {
			status: 301,
			destination: '/explore/pubky-apps/app-architectures/introduction/',
		},
		'/explore/pubky-apps/indexing-and-aggregation/aggregator/': {
			status: 301,
			destination: '/explore/pubky-apps/indexing-and-aggregation/introduction/',
		},
		'/explore/pubky-apps/indexing-and-aggregation/indexer/': {
			status: 301,
			destination: '/explore/pubky-apps/indexing-and-aggregation/introduction/',
		},
		'/explore/pubky-apps/indexing-and-aggregation/web-server/': {
			status: 301,
			destination: '/explore/pubky-apps/indexing-and-aggregation/introduction/',
		},
		'/explore/pubky-apps/reference-app/features/bookmarks/': {
			status: 301,
			destination: '/explore/pubky-apps/reference-app/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/layouts/': {
			status: 301,
			destination: '/explore/pubky-apps/reference-app/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/notifications/': {
			status: 301,
			destination: '/explore/pubky-apps/reference-app/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/perspectives/': {
			status: 301,
			destination: '/explore/pubky-apps/reference-app/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/posts/': {
			status: 301,
			destination: '/explore/pubky-apps/reference-app/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/profiles/': {
			status: 301,
			destination: '/explore/pubky-apps/reference-app/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/search/': {
			status: 301,
			destination: '/explore/pubky-apps/reference-app/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/tags/': {
			status: 301,
			destination: '/explore/pubky-apps/reference-app/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/trends/': {
			status: 301,
			destination: '/explore/pubky-apps/reference-app/pubky-app/',
		},
		'/explore/pubky-protocol/pkarr/architecture/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/introduction/',
		},
		'/explore/pubky-protocol/pkarr/eli5/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/introduction/',
		},
		'/explore/pubky-protocol/pkarr/expectations/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/introduction/',
		},
		'/explore/pubky-protocol/pkarr/getting-started/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/introduction/',
		},
		'/explore/pubky-protocol/pkarr/why-pkarr/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/introduction/',
		},
		'/explore/technologies/dht/': {
			status: 301,
			destination: '/explore/technologies/mainline-dht/',
		},
		'/explore/technologies/dns/': {
			status: 301,
			destination: '/explore/technologies/pkdns/',
		},
		'/explore/technologies/doh/': {
			status: 301,
			destination: '/explore/technologies/pkdns/',
		},
		'/explore/technologies/https/': {
			status: 301,
			destination: '/explore/pubky-protocol/security-model/#transport-security',
		},
		'/explore/technologies/key-pair/': {
			status: 301,
			destination: '/explore/pubky-protocol/security-model/#key-custody',
		},
		'/explore/technologies/pubky-moderation/': {
			status: 301,
			destination: '/explore/concepts/censorship/',
		},
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
			destination: '/explore/pubky-protocol/homeserver/#http-api',
		},
		'/explore/pubky-protocol/api/': {
			status: 301,
			destination: '/explore/pubky-protocol/homeserver/#http-api',
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
			destination: '/explore/pubky-protocol/pkarr/introduction/',
		},
		'/explore/pubkycore/pkarr/getting-started/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/introduction/',
		},
		'/explore/pubkycore/pkarr/expectations/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/introduction/',
		},
		'/explore/pubkycore/pkarr/architecture/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/introduction/',
		},
		'/explore/pubkycore/pkarr/eli5/': {
			status: 301,
			destination: '/explore/pubky-protocol/pkarr/introduction/',
		},
	},
	base: process.env.BASE_PATH || '/',
	markdown: {
		remarkPlugins: [remarkSnippet],
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
						'troubleshooting',
						'contributing',
						'getting-started',
						'the-vision-of-pubky',
						'glossary',
						'explore/technologies/pubky-explorer',
						'explore/technologies/pubky-ring',
						'explore/pubky-protocol/eli5',
						'explore/pubky-apps/app-architectures/introduction',
						'explore/pubky-apps/indexing-and-aggregation/introduction',
						'explore/pubky-apps/reference-app/pubky-app',
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
						{ label: 'SDK', slug: 'explore/pubky-protocol/sdk' },
						{ label: 'Security Model', slug: 'explore/pubky-protocol/security-model' },
						{
							label: 'Pkarr',
							items: [
								{ label: 'Introduction', slug: 'explore/pubky-protocol/pkarr/introduction' },
							],
						},
					],
				},
				{
					label: 'Pubky Apps',
					items: [
						{ label: 'Introduction', slug: 'explore/pubky-apps/introduction' },
						{ label: 'App Specs', slug: 'explore/pubky-apps/app-specs' },
						{
							label: 'App Architectures',
							items: [
								{ label: 'Introduction', slug: 'explore/pubky-apps/app-architectures/introduction' },
							],
						},
						{
							label: 'Indexing & Aggregation',
							items: [
								{ label: 'Introduction', slug: 'explore/pubky-apps/indexing-and-aggregation/introduction' },
								{ label: 'Pubky Nexus', slug: 'explore/pubky-apps/indexing-and-aggregation/pubky-nexus' },
							],
						},
						{
							label: 'Reference App',
							items: [
								{ label: 'pubky.app', slug: 'explore/pubky-apps/reference-app/pubky-app' },
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
