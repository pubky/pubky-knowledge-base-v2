# Pubky Knowledge Base

[![Documentation Status](https://img.shields.io/badge/docs-live-success)](https://pubky.org/)

Welcome to the Pubky Knowledge Base.

### [Access the Pubky Knowledge Base](https://pubky.org/)

This site documents Pubky's vision, architecture, key concepts, and practical guides for the Pubky protocol and pubky.app.

## Contributing

For typos, broken links, or small improvements:

1. Fork this repository
2. Make your changes
3. Submit a pull request

For new pages or significant changes, open an issue first and follow the [Contributing Guide](src/content/docs/contributing.md).

### Checked code snippets

The [protocol Getting Started guide](src/content/docs/explore/pubky-protocol/getting-started.md) keeps a self-contained, checked walkthrough. Preserve that learning journey; link to maintained upstream examples for additional SDK workflows.

Its JavaScript/TypeScript examples live in `snippets/js/` and are included in Markdown by named section:

````md
```javascript snippet="snippets/js/src/example.ts:example"
```
````

Named sections use `// --8<-- [start:name]` and `// --8<-- [end:name]`. Install the locked snippet dependencies with `npm --prefix snippets/js ci`, then run `npm run check:snippets` to validate fence and reference rules, TypeScript types, ESLint rules (including deprecated APIs), and formatting. The build checks source inclusion and generated Markdown. Changes to SDK behavior also require testing the affected workflow; static checks cannot prove that signup or storage requests succeed.

## Related Resources

- **GitHub**: [github.com/pubky](https://github.com/pubky)
- **Pubky Homeserver**: [github.com/pubky/pubky-homeserver](https://github.com/pubky/pubky-homeserver) ([examples](https://github.com/pubky/pubky-homeserver/tree/main/examples))
- **Telegram**: [t.me/pubkycore](https://t.me/pubkycore)
- **Live App**: [pubky.app](https://pubky.app)

## Commands

Run commands from the project root:

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm --prefix snippets/js ci` | Install the locked tutorial dependencies |
| `npm run dev` | Start the local dev server at `localhost:4321` |
| `npm run build` | Build the site to `dist/` and generate AI-readable docs |
| `npm run check:snippets` | Validate snippet references, types, lint, and formatting |
| `npm run check:snippets:js` | Run the JavaScript/TypeScript snippet checks |
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

[llms-small.txt](https://pubky.org/llms-small.txt) links to per-page Markdown files. You can also open them directly by adding `.md` to a docs path, for example [pubky.org/getting-started.md](https://pubky.org/getting-started.md) or [pubky.org/explore/pubky-protocol/sdk.md](https://pubky.org/explore/pubky-protocol/sdk.md).

Locally, `npm run build` generates the same files in `dist/`.
