# Pubky Knowledge Base

[![Documentation Status](https://img.shields.io/badge/docs-live-success)](https://pubky.org/)

Welcome to the Pubky Knowledge Base.

### [Access the Pubky Knowledge Base](https://pubky.org/)

This site documents Pubky's vision, architecture, key concepts, and practical guides for Pubky Core and pubky.app.

## Contributing

For typos, broken links, or small improvements:

1. Fork this repository
2. Make your changes
3. Submit a pull request

For new pages or significant changes, open an issue first and follow the [Contributing Guide](src/content/docs/contributing.md).

## Related Resources

- **GitHub**: [github.com/pubky](https://github.com/pubky)
- **Pubky Core**: [github.com/pubky/pubky-core](https://github.com/pubky/pubky-core) ([examples](https://github.com/pubky/pubky-core/tree/main/examples))
- **Telegram**: [t.me/pubkycore](https://t.me/pubkycore)
- **Live App**: [pubky.app](https://pubky.app)

## Commands

Run commands from the project root:

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server at `localhost:4321` |
| `npm run build` | Build the site to `dist/` and generate AI-readable docs |
| `npm run preview` | Preview the production build locally |
| `npm run astro ...` | Run Astro CLI commands |

## Social Cards (Open Graph)

Shared links render a 1200×630 preview card. The homepage uses the static
default card; every other page gets one generated at build time from a single
template, with the page's frontmatter `title` composited in as the subtitle
(clamped to 3 lines). Generation lives in `src/lib/og.ts` and the
`src/pages/og/[...slug].png.ts` endpoint; per-page `og:image` tags are emitted
by `src/components/Head.astro`.

- **Update the card design**: replace `src/assets/og/og-card-template.png`
  (headline + logo + pattern, no subtitle) and `public/images/og-default.png`
  (the homepage card), then rebuild.
- **Preview locally**: `og:image` is an absolute URL, so the previewed page
  must match the build's `site`. Build with the preview origin, e.g.
  `SITE_URL=http://localhost:4321 npm run build && npm run preview`, otherwise
  the tags point at production and the image won't load locally.

## AI-Readable Docs

AI tools can reference the docs through these plain Markdown endpoints:

- [https://pubky.org/llms.txt](https://pubky.org/llms.txt)
- [https://pubky.org/llms-full.txt](https://pubky.org/llms-full.txt)
- [https://pubky.org/llms-small.txt](https://pubky.org/llms-small.txt)

[llms-small.txt](https://pubky.org/llms-small.txt) links to per-page Markdown files. You can also open them directly by adding `.md` to a docs path, for example [pubky.org/getting-started.md](https://pubky.org/getting-started.md) or [pubky.org/explore/pubkycore/sdk.md](https://pubky.org/explore/pubkycore/sdk.md).

Locally, `npm run build` generates the same files in `dist/`.
