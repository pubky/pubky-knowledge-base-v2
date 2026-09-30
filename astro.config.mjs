// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';
import starlightLlmsTxt from 'starlight-llms-txt';
import rehypeBasePath from './plugins/rehype-base-path.mjs';
import remarkSnippet from './plugins/remark-snippet.mjs';
import remarkReleaseLinks from './plugins/remark-release-links.mjs';

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL || 'https://pubky.org',
	redirects: {
		'/explore/pubky-protocol/introduction/': {
			status: 301,
			destination: '/overview/',
		},
		'/explore/pubky-apps/introduction/': {
			status: 301,
			destination: '/build/app-architectures/',
		},
		'/explore/pubky-apps/app-specs/': {
			status: 301,
			destination: '/social-data/pubky-app-specs/',
		},
		'/faq/': {
			status: 301,
			destination: '/overview/',
		},
		'/explore/technologies/pubky-cli/': {
			status: 301,
			destination: '/build/developer-guide/',
		},
		'/tldr/': {
			status: 301,
			destination: '/overview/',
		},
		'/the-vision-of-pubky/': {
			status: 301,
			destination: '/overview/#the-broader-vision',
		},
		'/troubleshooting/': {
			status: 301,
			destination: '/contributing/#code-and-bug-reports',
		},
		'/explore/pubky-apps/eli5/': {
			status: 301,
			destination: '/build/app-architectures/',
		},
		'/explore/pubky-protocol/eli5/': {
			status: 301,
			destination: '/overview/',
		},
		'/explore/pubky-apps/reference-app/introduction/': {
			status: 301,
			destination: '/social-data/pubky-app/',
		},
		'/explore/pubky-apps/app-architectures/client-homeserver/': {
			status: 301,
			destination: '/build/app-architectures/',
		},
		'/explore/pubky-apps/app-architectures/custom-backend/': {
			status: 301,
			destination: '/build/app-architectures/',
		},
		'/explore/pubky-apps/app-architectures/global-aggregators/': {
			status: 301,
			destination: '/build/app-architectures/',
		},
		'/explore/pubky-apps/indexing-and-aggregation/aggregator/': {
			status: 301,
			destination: '/social-data/indexing-and-aggregation/',
		},
		'/explore/pubky-apps/indexing-and-aggregation/indexer/': {
			status: 301,
			destination: '/social-data/indexing-and-aggregation/',
		},
		'/explore/pubky-apps/indexing-and-aggregation/web-server/': {
			status: 301,
			destination: '/social-data/indexing-and-aggregation/',
		},
		'/explore/pubky-apps/reference-app/features/bookmarks/': {
			status: 301,
			destination: '/social-data/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/layouts/': {
			status: 301,
			destination: '/social-data/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/notifications/': {
			status: 301,
			destination: '/social-data/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/perspectives/': {
			status: 301,
			destination: '/social-data/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/posts/': {
			status: 301,
			destination: '/social-data/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/profiles/': {
			status: 301,
			destination: '/social-data/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/search/': {
			status: 301,
			destination: '/social-data/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/tags/': {
			status: 301,
			destination: '/social-data/pubky-app/',
		},
		'/explore/pubky-apps/reference-app/features/trends/': {
			status: 301,
			destination: '/social-data/pubky-app/',
		},
		'/explore/pubky-protocol/pkarr/architecture/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/pubky-protocol/pkarr/eli5/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/pubky-protocol/pkarr/expectations/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/pubky-protocol/pkarr/getting-started/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/pubky-protocol/pkarr/why-pkarr/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/technologies/dht/': {
			status: 301,
			destination: '/components/mainline-dht/',
		},
		'/explore/technologies/dns/': {
			status: 301,
			destination: '/components/pkdns/',
		},
		'/explore/technologies/doh/': {
			status: 301,
			destination: '/components/pkdns/',
		},
		'/explore/technologies/https/': {
			status: 301,
			destination: '/build/security-model/#transport-security',
		},
		'/explore/technologies/key-pair/': {
			status: 301,
			destination: '/build/security-model/#key-custody',
		},
		'/explore/technologies/pubky-moderation/': {
			status: 301,
			destination: '/learn/censorship-resistance/',
		},
		'/docs': {
			status: 301,
			destination: '/',
		},
		'/explore/pubkycore/introduction/': {
			status: 301,
			destination: '/overview/',
		},
		'/explore/pubky-protocol/getting-started/': {
			status: 301,
			destination: '/build/developer-guide/',
		},
		'/explore/pubkycore/getting-started/': {
			status: 301,
			destination: '/build/developer-guide/',
		},
		'/explore/pubkycore/eli5/': {
			status: 301,
			destination: '/overview/',
		},
		'/explore/pubkycore/authentication/': {
			status: 301,
			destination: '/build/authentication/',
		},
		'/explore/pubkycore/homeserver/': {
			status: 301,
			destination: '/components/homeserver/',
		},
		'/explore/pubkycore/api/': {
			status: 301,
			destination: '/components/homeserver/#http-api',
		},
		'/explore/pubky-protocol/api/': {
			status: 301,
			destination: '/components/homeserver/#http-api',
		},
		'/explore/pubkycore/sdk/': {
			status: 301,
			destination: '/build/sdk/',
		},
		'/explore/pubkycore/security-model/': {
			status: 301,
			destination: '/build/security-model/',
		},
		'/explore/pubkycore/pkarr/introduction/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/pubkycore/pkarr/why-pkarr/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/pubkycore/pkarr/getting-started/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/pubkycore/pkarr/expectations/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/pubkycore/pkarr/architecture/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/pubkycore/pkarr/eli5/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/concepts/credible-exit/': {
			status: 301,
			destination: '/learn/credible-exit/',
		},
		'/explore/concepts/censorship/': {
			status: 301,
			destination: '/learn/censorship-resistance/',
		},
		'/explore/pubky-protocol/developer-guide/': {
			status: 301,
			destination: '/build/developer-guide/',
		},
		'/explore/pubky-protocol/sdk/': {
			status: 301,
			destination: '/build/sdk/',
		},
		'/explore/pubky-apps/app-architectures/introduction/': {
			status: 301,
			destination: '/build/app-architectures/',
		},
		'/explore/pubky-protocol/authentication/': {
			status: 301,
			destination: '/build/authentication/',
		},
		'/explore/pubky-protocol/private-storage/': {
			status: 301,
			destination: '/build/private-storage/',
		},
		'/explore/pubky-protocol/security-model/': {
			status: 301,
			destination: '/build/security-model/',
		},
		'/explore/technologies/pubky-docker/': {
			status: 301,
			destination: '/build/pubky-docker/',
		},
		'/explore/technologies/pubky-explorer/': {
			status: 301,
			destination: '/build/pubky-explorer/',
		},
		'/explore/pubky-apps/pubky-app-specs/': {
			status: 301,
			destination: '/social-data/pubky-app-specs/',
		},
		'/explore/concepts/semantic-social-graph/': {
			status: 301,
			destination: '/social-data/semantic-social-graph/',
		},
		'/explore/pubky-apps/indexing-and-aggregation/introduction/': {
			status: 301,
			destination: '/social-data/indexing-and-aggregation/',
		},
		'/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/': {
			status: 301,
			destination: '/social-data/pubky-nexus/',
		},
		'/explore/pubky-apps/reference-app/pubky-app/': {
			status: 301,
			destination: '/social-data/pubky-app/',
		},
		'/explore/technologies/pubky-ring/': {
			status: 301,
			destination: '/use/pubky-ring/',
		},
		'/explore/technologies/pubky-passport/': {
			status: 301,
			destination: '/use/pubky-passport/',
		},
		'/explore/technologies/pubky-backup/': {
			status: 301,
			destination: '/use/pubky-backup/',
		},
		'/explore/pubky-protocol/homeserver/': {
			status: 301,
			destination: '/components/homeserver/',
		},
		'/explore/technologies/homegate/': {
			status: 301,
			destination: '/components/homegate/',
		},
		'/explore/pubky-protocol/pkarr/introduction/': {
			status: 301,
			destination: '/components/pkarr/',
		},
		'/explore/technologies/mainline-dht/': {
			status: 301,
			destination: '/components/mainline-dht/',
		},
		'/explore/technologies/pkdns/': {
			status: 301,
			destination: '/components/pkdns/',
		},
		'/explore/technologies/http-relay/': {
			status: 301,
			destination: '/components/http-relay/',
		},
		'/explore/technologies/pubky-noise/': {
			status: 301,
			destination: '/components/pubky-noise/',
		},
		'/explore/technologies/paykit/': {
			status: 301,
			destination: '/components/paykit/',
		},
	},
	base: process.env.BASE_PATH || '/',
	markdown: {
		remarkPlugins: [remarkSnippet, remarkReleaseLinks],
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
						'comparisons',
						'contributing',
						'getting-started',
						'glossary',
						'build/pubky-explorer',
						'use/pubky-ring',
						'social-data/indexing-and-aggregation',
						'social-data/pubky-app',
						'learn/censorship-resistance',
						'learn/credible-exit',
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
				PageTitle: './src/components/PageTitle.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/pubky' },
				{ icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/getpubky' },
				{ icon: 'telegram', label: 'Telegram', href: 'https://t.me/pubkycore' },
			],
			sidebar: [
				{
					label: 'Learn about Pubky',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'overview' },
						{ label: 'System Architecture', slug: 'architecture' },
						{ label: 'Comparisons', slug: 'comparisons' },
						{ label: 'Credible Exit', slug: 'learn/credible-exit' },
						{ label: 'Censorship Resistance', slug: 'learn/censorship-resistance' },
					],
				},
				{
					label: 'Use Pubky',
					collapsed: true,
					items: [
						{ label: 'Getting Started for Users', slug: 'getting-started' },
						{ label: 'Pubky Ring', slug: 'use/pubky-ring' },
						{ label: 'Pubky Passport', slug: 'use/pubky-passport' },
						{ label: 'Pubky Backup', slug: 'use/pubky-backup' },
					],
				},
				{
					label: 'Build an app',
					collapsed: true,
					items: [
						{ label: 'Developer Guide', slug: 'build/developer-guide' },
						{ label: 'SDK', slug: 'build/sdk' },
						{ label: 'App Architectures', slug: 'build/app-architectures' },
						{ label: 'Authentication', slug: 'build/authentication' },
						{ label: 'Private Storage', slug: 'build/private-storage' },
						{ label: 'Security Model', slug: 'build/security-model' },
						{ label: 'Pubky Docker', slug: 'build/pubky-docker' },
						{ label: 'Pubky Explorer', slug: 'build/pubky-explorer' },
					],
				},
				{
					label: 'Shared social data',
					collapsed: true,
					items: [
						{ label: 'pubky-app-specs', slug: 'social-data/pubky-app-specs' },
						{ label: 'Semantic Social Graph', slug: 'social-data/semantic-social-graph' },
						{ label: 'Indexing & Aggregation', slug: 'social-data/indexing-and-aggregation' },
						{ label: 'Pubky Nexus', slug: 'social-data/pubky-nexus' },
						{ label: 'pubky.app Reference App', slug: 'social-data/pubky-app' },
					],
				},
				{
					label: 'Components & services',
					collapsed: true,
					items: [
						{ label: 'Homeserver', slug: 'components/homeserver' },
						{ label: 'Homegate', slug: 'components/homegate' },
						{ label: 'PKARR', slug: 'components/pkarr' },
						{ label: 'Mainline DHT', slug: 'components/mainline-dht' },
						{ label: 'PKDNS', slug: 'components/pkdns' },
						{ label: 'HTTP Relay', slug: 'components/http-relay' },
						{ label: 'Pubky Noise', slug: 'components/pubky-noise' },
						{ label: 'Paykit', slug: 'components/paykit' },
					],
				},
				{
					label: 'Reference & community',
					collapsed: true,
					items: [
						{ label: 'Glossary', slug: 'glossary' },
						{ label: 'Resources', slug: 'resources' },
						{ label: 'Contributing', slug: 'contributing' },
					],
				},
			],
		}),
	],
});
