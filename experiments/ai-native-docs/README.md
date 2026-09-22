# Pubky docs, ready for your agent

A static frontend vibe of [pubky.org](https://pubky.org/), built from the default branch of [pubky/pubky-knowledge-base-v2](https://github.com/pubky/pubky-knowledge-base-v2) at `a38de41a438126f4d27fc9fb743546792a0aca80`.

Source: [gcomte/pubky-knowledge-base-vibed, vibe/ai-native-docs](https://github.com/gcomte/pubky-knowledge-base-vibed/tree/vibe/ai-native-docs).

Live experiment: **[pubky-ai-docs-vibe.vercel.app](https://pubky-ai-docs-vibe.vercel.app/)**.

The landing page keeps the original hero heading, tagline, pill buttons, triangle backdrop and SDK terminal with npm, React Native and Rust tabs. A single resource frame below the terminal leads with Pubky skills as the primary entry, using a larger title and aligned text. Supporting links are grouped beneath it, without nested panels or divider lines across the artwork. Context7's Pubky search and its Homeserver and PKARR indexes, and DeepWiki, remain visible below it. A dense, closely connected network forms the widely spaced **AI** letters behind the entries in place of a visible heading; the region retains an accessible name. Bright nodes and connections keep the moving letter shapes clear, while an occasional light sweep illuminates the network itself. Reduced-motion preferences and browsers without JavaScript receive the static mesh. All entries appear without opening a menu. The original Claude, ChatGPT, Cursor, Gemini and Grok icon row appears under **pubky.org for your LLM**, alongside a compact **Prompt** copy button, with more space above and no flashing arrow or border. The portable starter prompt and show-prompt fallback remain available.

On documentation pages, **Markdown** and **Copy link** controls sit beside the title, or below it on smaller screens. They replace the former “AI-friendly version” footer row. The existing documentation bodies and Markdown export pipeline are retained. Standard HTML links advertise the documentation index and each page's Markdown alternative.

This adapts the supplied `vibe-self-host` workflow to a static documentation frontend. It needs no Pubky backend, account, test key or Docker stack. The registry PR is deferred at the developer's request; [experiment.json](experiment.json) records provenance and is not a registry manifest.

## Review

- [Research and recommendations](research.md)

Repeatable build and browser checks are documented in the [repository README](../../README.md#browser-checks). The browser suite covers resource visibility, clipboard feedback and fallbacks, SDK tabs, Markdown actions, responsive layouts, no-JavaScript behavior, and reduced-motion/network cleanup. The original one-off screenshots and JSON check reports are not retained in the repository.

## Run locally

Use the repository's existing dependencies and commands:

```bash
PUBKY_DOCS_VIBE=true npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

The build also validates generated Markdown and its links. `PUBKY_DOCS_VIBE=true` excludes the production analytics script and emits `noindex`. This flag is used for the experiment deployment. Without it, the normal production behavior is preserved.

The prompt and generated Markdown retain canonical `https://pubky.org` references so an agent starts from maintained official documentation. Browser navigation remains on the preview site. No runtime secrets or environment variables are needed.

## Hosting

Deploy only the tested static output on a separate Vercel project. The build output configuration adds `X-Robots-Tag: noindex` to every response, serves files directly, and uses the generated `404.html` for missing routes. The upstream site and deployment workflow are not deployment targets for this experiment.

Package a completed build using [vercel-output.json](vercel-output.json) as `.vercel/output/config.json`, and copy `dist/` to `.vercel/output/static/`. Link the directory to the separate experiment project, then use `vercel deploy --prebuilt --prod`. The `--prod` target here is the experiment project's public alias; it does not deploy to pubky.org.

The public branch contains the source and research; no registry PR is opened.
