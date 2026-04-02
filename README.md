# Pubky Knowledge Base

[![Documentation Status](https://img.shields.io/badge/docs-live-success)](https://pubky.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Welcome to the Pubky Knowledge base - we are excited to have you here!

### [Access the Pubky Knowledge Base](https://docs.pubky.org/)

> **The current Knowledge base is a mix of reality, plans and visions.**

The Knowledge Base is a comprehensive resource that encompasses our vision for Pubky, along with detailed explanations of the architecture for both Pubky Core and Pubky App, as well as key concepts and practical guides.

## Contributing to Documentation

We kindly ask you to help us improve this documentation for a clearer, more accurate, and concise knowledge base.

### Quick Fixes

For typos, broken links, or small improvements:
1. Fork this repository
2. Make your changes
3. Submit a pull request

### Larger Contributions

For new pages or significant changes:
1. Open an issue to discuss your plans first
2. Follow the [[Contributing]] guide
3. Test locally before submitting

See our full **[[Contributing|Contributing Guide]]** for detailed instructions.

## Related Resources

- **Official Website**: [pubky.org](https://pubky.org/)
- **Main Repository**: [github.com/pubky/pubky-core](https://github.com/pubky/pubky-core)
- **Telegram**: [t.me/pubkycore](https://t.me/pubkycore)
- **Live App**: [pubky.app](https://pubky.app)

## License

This documentation is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run generate-llms:full` | Generate `public/llms-full.txt` (deterministic) |
| `npm run generate-llms`   | Generate both `llms-full.txt` and `llms.txt` (requires Claude CLI) |

## AI-Accessible Documentation (llms.txt)

This project generates machine-readable documentation files following the [llms.txt](https://llmstxt.org/) spec, so AI models can load the full Pubky docs as context.

### Files

| File | Description | Generation |
|------|-------------|------------|
| `public/llms-full.txt` | Complete docs content (~380 KB, all pages concatenated + resources) | Deterministic script |
| `public/llms.txt` | Summary index with section links and one-line descriptions | Claude CLI |
| `.llms-generation` | Commit hash of when the files were last generated | Auto-written |

### How to regenerate

After changing any documentation in `src/content/docs/`:

```bash
# Generate both files (requires Claude CLI to be installed and authenticated)
npm run generate-llms

# Or generate only llms-full.txt (no Claude CLI needed)
npm run generate-llms:full
```

Review the git diff of the generated files before committing. The `llms.txt` summary is AI-generated and should be checked for accuracy.

Commit all three files together: `public/llms-full.txt`, `public/llms.txt`, and `.llms-generation`.

### CI freshness check

A GitHub Actions workflow (`.github/workflows/check-llms-freshness.yml`) runs on every push/PR to `main`. It compares the commit hash in `.llms-generation` against HEAD to detect if any docs files have changed since the last generation. If docs changed, the check fails with a list of modified files.

### Why not automated in CI?

The `llms.txt` generation uses Claude CLI. Running it in CI (GitHub Action) requires a Claude API subscription. For now, generation runs locally and is pushed manually.
