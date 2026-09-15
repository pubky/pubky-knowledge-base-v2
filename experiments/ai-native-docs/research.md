# Pubky's AI documentation entry points

Research checked **September 14, 2026**. This is a documentation frontend experiment; the existing documentation bodies remain unchanged.

## Recommendation

Keep the landing page's existing design and ordinary documentation entry points. Replace the AI Kit destination with a visible AI resources box offering three clearly different resources: task skills, API context through Context7, and repository explanations through DeepWiki. Show all three without requiring a click to discover them. Keep the original provider shortcuts and one portable starter prompt under **pubky.org for your LLM**, and put per-page Markdown access beside the document title. Use a small index and relevant pages as the starting context.

The implementation preserves the original hero typography, tagline, button styling, triangle backdrop and SDK terminal. The resource box sits below the terminal, with oversized, dim decorative AI lettering behind the links. Moving network connections and an occasional shimmer follow the letter shapes to draw attention to the box, with a pause control and a static reduced-motion treatment. Pubky skills is the primary entry, with a larger title and more space. The secondary entries are a Context7 heading that links to its Pubky search, separate Context7 links for Homeserver and PKARR, and Homeserver on DeepWiki. Documentation pages offer **Markdown** and **Copy link** beside the title, wrapping below it on smaller screens, in place of the footer controls.

The biggest current gap is release accuracy. Adding more links will not fix references that teach older APIs.

## What Pubky has today

| Resource | What the audit found | Decision |
| --- | --- | --- |
| [Official LLM index](https://pubky.org/llms.txt), [compact index](https://pubky.org/llms-small.txt), [full export](https://pubky.org/llms-full.txt) | Public and working. The compact index links to 67 individual Markdown pages. The full export is roughly 421,000 characters and includes broad background and landing-page material. | Keep all URLs; default to selective retrieval through the compact index. Keep the full bundle optional. |
| [AI Kit](https://github.com/pubky/pubky-ai-kit/blob/main/pubky-dev-context.md) | Last changed May 27. Examples still use older authentication patterns, including `startAuthFlow`. | Remove the landing-page CTA. Retain the upstream URL for existing users until its owner adds a migration notice. |
| [Pubky Agent Skills](https://github.com/pubky/agent-skills) | Public replacement for the AI Kit; four focused skills, source provenance and verification machinery. Recent repository activity does not mean every reference is current. | Offer a link to review the workflows. Refresh the references before making installation the recommended first step. |
| [Homeserver on Context7](https://context7.com/pubky/pubky-homeserver) | Reported an update about five hours before the audit; 546 snippets. Sampled examples use grant authentication and link to upstream sources. | Useful for API lookup in an agent that has Context7 configured. |
| [PKARR on Context7](https://context7.com/pubky/pkarr) | Reported an update one month ago; sampled configuration still targets version 7, while [v8.0.1](https://github.com/pubky/pkarr/releases/tag/v8.0.1) is released. The older example also exists upstream. | Offer as a secondary library link. Check both source and package version; a recent index can faithfully reproduce stale documentation. |
| [Homeserver on DeepWiki](https://deepwiki.com/pubky/pubky-homeserver) | Reported a September 14 index at `fdf378`, the v0.12.0 release commit. Provides extensive architecture explanations and source citations. | Good for understanding the implementation. Label it as AI generated and verify claims against source. |

### The skills refresh is substantive

The [JavaScript SDK reference](https://github.com/pubky/agent-skills/blob/main/skills/pubky/references/sdk-js.md) says npm latest is 0.9.3 and grant authentication is unpublished. Its [provenance file](https://github.com/pubky/agent-skills/blob/main/maintenance/provenance/pubky/sdk-js.json) records generation on June 30. The [current SDK release](https://github.com/pubky/pubky-homeserver/releases/tag/v0.12.0) is 0.12.0; the [v0.10 migration guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/v0.10-migration/README.md) explains the move to grant authentication.

The [shipped-versus-planned reference](https://github.com/pubky/agent-skills/blob/main/skills/pubky/references/shipped-vs-planned.md) says `/priv` is unreleased. [v0.10.0](https://github.com/pubky/pubky-homeserver/releases/tag/v0.10.0) shipped it as **alpha, explicitly unsuitable for production**. References need to distinguish released, experimental and recommended behavior.

I inspected content and provenance; I did not install the skill collection or execute its maintenance pipeline. Its structure is promising, but this audit does not certify workflow correctness.

The existing [resources page](https://pubky.org/resources/) already lists AI tools, including an obsolete Context7 Homeserver path, `/pubky/pubky-core`. That URL can return HTTP 200 without a usable index. The new landing uses `/pubky/pubky-homeserver`; correcting the old resources page remains a follow-up so the experiment preserves the requested docs.

## Examples worth borrowing from

1. **[Supabase AI Tools](https://supabase.com/docs/guides/ai-tools)** — the closest match for information structure: explain the different jobs of tools, skills and prompts. Its [Postgres skill](https://www.skills.sh/supabase/agent-skills/supabase-postgres-best-practices) reported about 400,200 installs when checked.
2. **[Cloudflare documentation](https://developers.cloudflare.com/)** — keep the ordinary getting-started route prominent and provide an explicit agent path with a portable prompt. This is the closest homepage reference.
3. **[Stripe's agent resources](https://docs.stripe.com/agents)** — lead with a usable setup, while leaving machine-readable files available underneath. Stripe reports agent docs traffic grew over tenfold in 2025 and reached nearly 40% of documentation traffic in its [June 2026 account](https://stripe.com/blog/stripe-projects-adds-new-agents-providers-developer-controls).

These have demonstrated ecosystem use or established developer audiences. That is **not evidence that their current AI landing-page layouts were comparatively user-tested**. Their relevance to Pubky is a design judgment. [Vercel's resource hub](https://vercel.com/docs/agent-resources) is useful for a secondary page, but its number of choices is more than Pubky needs on the homepage. [Svelte's AI tools](https://svelte.dev/docs/ai/tools) are a useful future example of a server providing code validation beyond documentation lookup.

## Concepts with useful evidence

**Small pointers, relevant context.** [Anthropic's context-engineering guidance](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) supports keeping identifiers and retrieving details when needed. Pubky should supply component, version and source pointers, then load the relevant reference or workflow.

**`llms.txt` remains useful infrastructure.** The [proposal's v2](https://llmstxt.org/) was updated August 10, 2026. It emphasizes a compact index, Markdown pages, and ordinary `alternate` / `describedby` discovery links. It is a proposal, not a guarantee that every agent discovers or follows the file. This experiment adds the HTML discovery links to the existing exports.

**Test skills rather than assuming they help.** [Vercel's Next.js evaluation](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) favored a compact version-specific docs index over a docs skill in its particular tasks. It also recommends skills for explicit workflows. An [independent study](https://arxiv.org/abs/2602.11988) found unnecessary context-file requirements can lower success and increase cost. These results support minimal instructions and Pubky-specific evaluations, not a universal winner between skills and context files.

## What to pursue next

1. **Release accuracy first.** Refresh SDK and shipped-state skill references, fix obsolete resource links, and record the package version and upstream commit each reference was verified against. The Homeserver already has a [Context7 release-refresh workflow](https://github.com/pubky/pubky-homeserver/blob/main/.github/workflows/context7-sync.yml); extend that maintenance discipline to skills rather than creating parallel documentation copies.
2. **A small integration evaluation.** Test finding the correct SDK, implementing a basic data flow, handling authentication correctly, and running a local testnet. Compare official docs alone, Context7 and the relevant skill. Record completion, incorrect APIs and retrieval failures. [Stripe's integration benchmark](https://stripe.com/blog/can-ai-agents-build-real-stripe-integrations) and [Supabase Evals](https://supabase.com/evals) are useful precedents.
3. **Consider copying Markdown contents.** The experiment now moves the existing Markdown link and copy-link action from the footer to the document title area. A possible later addition is copying the page Markdown itself, generated from the same documentation source.
4. **A small agent starter map.** Maintain a short map of Pubky components and authoritative, version-aware sources. Use skills for repeatable tasks rather than duplicating the entire reference manual.
5. **Selected skill setup once the references are verified.** Link to upstream installation instructions, then simplify setup for the useful workflows. Avoid maintaining editor-specific commands on the homepage.

Defer an embedded chatbot and a first-party docs MCP server. Context7 already supplies a retrieval path; a custom server should solve a measured gap such as version guarantees, cross-repository navigation or validation. Agent-operated account or infrastructure tools are a separate project. Nexus Scout is already available as a task-specific skill, but belongs in the relevant workflow rather than general SDK onboarding.

## Deliberately removed from the landing

The AI Kit destination, fixed token-count promises, and the launcher's flashing arrow, border highlight and “LLM Support” annotation. The starter prompt does not fetch the full documentation bundle by default. The original provider icon row is retained, while the visible AI resources box gives each resource a concrete purpose and carries the mesh accent. Existing documentation URLs remain intact.
