# Pubky docs, ready for your agent

A static frontend vibe of [pubky.org](https://pubky.org/), built from the default branch of [pubky/pubky-knowledge-base-v2](https://github.com/pubky/pubky-knowledge-base-v2) at `a38de41a438126f4d27fc9fb743546792a0aca80`.

Source: [gcomte/pubky-knowledge-base-vibed, vibe/ai-native-docs](https://github.com/gcomte/pubky-knowledge-base-vibed/tree/vibe/ai-native-docs).

Live experiment: **[pubky-ai-docs-vibe.vercel.app](https://pubky-ai-docs-vibe.vercel.app/)**.

The landing page keeps the original hero heading, tagline, pill buttons, triangle backdrop and SDK terminal with npm, React Native and Rust tabs. A visible resource box below the terminal leads with Pubky skills as the primary entry, using a larger title and more space. Context7's Pubky search and its Homeserver and PKARR indexes, and DeepWiki, remain visible below it. Dim, tilted **AI** lettering sits behind the entries in place of a visible heading; the region retains an accessible name. A moving network of points and connections follows the letter shapes, with an occasional light sweep. A discreet pause control lets readers stop the motion. Reduced-motion preferences and browsers without JavaScript receive the static mesh. All entries appear without opening a menu. The original Claude, ChatGPT, Cursor, Gemini and Grok icon row appears under **pubky.org for your LLM**, alongside a compact **Prompt** copy button, with more space above and no flashing arrow or border. The portable starter prompt and show-prompt fallback remain available.

On documentation pages, **Markdown** and **Copy link** controls sit beside the title, or below it on smaller screens. They replace the former “AI-friendly version” footer row. The existing documentation bodies and Markdown export pipeline are retained. Standard HTML links advertise the documentation index and each page's Markdown alternative.

This adapts the supplied `vibe-self-host` workflow to a static documentation frontend. It needs no Pubky backend, account, test key or Docker stack. The registry PR is deferred at the developer's request; [experiment.json](experiment.json) records provenance and is not a registry manifest.

## Review

- [Research and recommendations](research.md)
- [Original landing, desktop](evidence/before-desktop.png)
- [Updated landing, desktop](evidence/after-desktop.png)
- [Updated landing, mobile](evidence/after-mobile.png)
- [AI resources, desktop](evidence/ai-resources-desktop.png)
- [AI resources, mobile](evidence/ai-resources-mobile.png)
- [Document title actions, desktop](evidence/doc-actions-desktop.png)
- [Document title actions, mobile](evidence/doc-actions-mobile.png)
- [Browser check results](evidence/browser-checks.json)
- [Network motion and layout checks](evidence/mesh-checks.json)
- [Public deployment checks](evidence/public-checks.json)

Validation passed: production build and generated-Markdown checks; all 22 internal homepage links; Markdown endpoints and discovery metadata; six viewport widths from 320 to 1920 pixels for the hero and short/long document titles; restored provider destinations, encoded prompts and icon assets; visible resource links without a disclosure; touch targets and keyboard focus; clipboard success and failure fallbacks; SDK tabs and command copying; and native links/disclosures without JavaScript. Network checks confirm changing rendered frames, a shimmer every 12 seconds, mouse and keyboard pause/resume, suspension offscreen and when hidden, live reduced-motion changes, and static fallbacks without JavaScript or canvas. The lettering stays vertically centered at 90% of its prior size; Skills has the largest resource heading, and desktop launcher/card bottom edges align. No browser runtime errors were observed. Security review of the changed execution paths found no actionable issues. The static deployment configuration is unchanged.

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

The public branch contains the source, research and visual evidence; no registry PR is opened.
