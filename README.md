# Pubky Knowledge Base

[![Documentation Status](https://img.shields.io/badge/docs-live-success)](https://docs.pubky.org/)

Welcome to the Pubky Knowledge Base.

### [Access the Pubky Knowledge Base](https://docs.pubky.org/)

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

## AI-Readable Docs

AI agents and humans can read the docs as plain Markdown from:

- `https://docs.pubky.org/llms.txt`
- `https://docs.pubky.org/llms-full.txt`
- `https://docs.pubky.org/llms-small.txt`

`llms-small.txt` links to per-page Markdown files. You can also open them directly by adding `.md` to a docs path, for example `https://docs.pubky.org/getting-started.md` or `https://docs.pubky.org/explore/pubkycore/sdk.md`.

Locally, `npm run build` generates the same files in `dist/`.
