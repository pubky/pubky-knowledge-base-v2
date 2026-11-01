---
name: technical-writing
description: Write, edit, and review technical documentation using ISO 24495-1 plain-language principles and Google's developer documentation style. Use by default for technical writing tasks, including READMEs, setup guides, tutorials, API and configuration references, architecture documents, design proposals, runbooks, troubleshooting, migration guides, release notes, and changelogs. Also use for requests to apply ISO/Google style, simplify technical prose, or improve documentation readability while preserving technical accuracy.
---

# Technical writing

Combine reader-focused organization with natural, precise developer documentation.
Apply ISO 24495-1's principles: help readers get what they need, find it,
understand it, and use it. Use Google's developer documentation style for prose
and presentation. Treat this as a practical house style, not a formal ISO
conformity assessment.

## Workflow

1. **Establish the reader and task.** Infer the audience, prior knowledge,
   document type, and intended outcome from the request and existing material.
   Ask only when missing information would materially change the document.
2. **Establish the facts.** Read relevant documents, configuration examples,
   implementation, or authoritative references. Identify prerequisites, defaults,
   supported versions, limitations, and observable results. Resolve conflicts
   from evidence; do not silently guess.
3. **Choose the structure.** Put the most useful information first. Use
   [document patterns](references/document-patterns.md) when selecting a structure
   for a new document or reorganizing an existing one. Adapt the pattern rather
   than filling every possible section.
4. **Draft or revise.** Follow the rules below. Read
   [examples](references/examples.md) when calibrating the tone or rewriting
   dense explanations and procedures.
5. **Verify.** Check technical meaning, examples, navigation, and task completion
   with the final review checklist. Report what was actually checked.

## Organize for the reader

- Lead with the purpose, outcome, or answer. Give background where it helps the
  reader make a decision or perform a task.
- Distinguish getting started from detailed reference and optional follow-up work.
- Put prerequisites before the steps that depend on them. State platform and
  version assumptions near the relevant procedure.
- Use descriptive, sentence-case headings: “Configure the HTTP backend,”
  “Check the startup log,” or “Connections time out.” Prefer task headings for
  procedures and topic headings for explanations.
- Keep each paragraph focused. Split when the topic or reader action changes,
  not merely to shorten the text.
- Use numbered lists for ordered actions, bullets for unordered choices or
  checks, and tables for genuine comparisons or reference lookups.
- Add subheadings when a long step contains distinct tasks. Avoid unnecessary
  heading levels and repeated summaries.
- Use informative link text. Check relative links when moving or copying files.

## Write naturally and precisely

- Address the reader as “you.” Use imperative verbs for instructions and present
  tense for behavior. Prefer active voice when the actor matters; keep passive
  voice when it is clearer.
- Allow contractions such as “doesn't” and “you'll.” Keep the tone calm,
  professional, and conversational, without jokes, sales language, or filler.
- Prefer familiar words: “use,” “start,” and “before.” Retain accurate technical
  terms rather than replacing them with vague everyday words.
- Define unfamiliar terms briefly at first use or link to a definition. Match
  the explanation to the audience; do not explain routine concepts unnecessarily.
- Keep sentences easy to follow. Split overloaded clauses, but allow longer
  sentences when their relationships are clear. Do not impose a controlled
  vocabulary, sentence-length limit, or one-sentence-per-paragraph rule.
- Use one term consistently for each concept. Preserve official names and the
  distinction between similar concepts, such as a connection and a request.
- Preserve qualifiers: “by default,” “may,” “requires,” and “only” can change
  meaning. Use “must” for requirements, “should” for recommendations, and “can”
  for capabilities. Preserve defined normative keywords in specifications.
- Replace vague pronouns when more than one actor or object could be meant.
- Remove repetition that adds no value. Keep repetition needed to make a step
  self-contained or to prevent an operational mistake.

## Make procedures usable

- State the action before its command or configuration example. Identify the
  target file, user account, working directory, or machine when it matters.
- Keep required actions distinct from optional choices. Explain relevant
  consequences before the reader takes the action.
- Explain placeholders before their first use. Keep values, paths, ports,
  versions, and names consistent across prose, commands, and examples.
- Put prerequisites, instructions, and expected results close together. Show
  how to recognize success and what to check when it fails.
- Distinguish preparing files, validating configuration, starting a service,
  and publishing or applying changes. Do not imply that one performs another.
- State what a verification command proves and any important limitation. Do
  not turn a connectivity check into a claim of identity or security validation.
- Preserve relevant cautions and limitations. Add warnings only for concrete
  consequences supported by the task or source, not generic hypothetical risks.
- Make troubleshooting symptom-led: symptom, likely cause when known,
  diagnostic action, and remedy. Do not assert an uncertain cause as fact.

## Preserve technical content during edits

- Treat an editorial rewrite as a meaning-preserving change. Keep commands,
  code, configuration identifiers, defaults, protocol names, and output strings
  intact unless a technical change is requested or a verified correction is needed.
- Preserve useful context, edge cases, security qualifications, and troubleshooting
  coverage. A shorter document is not necessarily a clearer document.
- If a technical correction is necessary, distinguish it from prose edits and
  explain it in the handoff. If evidence is insufficient, surface the uncertainty.
- Preserve existing versioning, heading anchors, links, badges, and document
  conventions where needed. If a heading changes, check known links to its anchor.
- Follow the user's requested output: edit in place, create a copy, show a draft,
  or review. In a review-only task, report actionable findings rather than editing.

## Format consistently

- Use code formatting for commands, paths, flags, identifiers, literal values,
  and exact output. Use fenced code blocks with language labels for examples.
- Use bold sparingly for important choices or required substitutions. Keep
  ordinary prose in ordinary text.
- Avoid shell prompts unless distinguishing environments requires them. Keep
  explanations out of copyable commands unless they are valid comments.
- Follow the project's existing English spelling and Markdown conventions;
  otherwise use US English. Retain product capitalization and exact UI labels.
- Respect established schemas and formats for API references, release notes,
  changelogs, and specifications. Improve their descriptions without replacing
  their required structure.

## Final review

- Can the intended reader quickly find the purpose, requirements, and next action?
- Can the reader complete the task with the information provided?
- Are explanations natural, specific, and appropriate to the reader's knowledge?
- Are required and optional actions, defaults, and limitations distinguishable?
- Do commands, configuration, ports, paths, versions, and expected output agree?
- For a prose-only rewrite, are code examples and technical claims preserved?
- Do relative links resolve, and are heading-anchor links still valid where checked?
- Are checks proportionate to the change? Validate examples against sources or
  syntax tools when useful; run procedures only in an appropriate environment.
- Does the handoff accurately state what changed and what was verified, without
  claiming tests or standards certification that did not occur?

## Sources

- [ISO 24495-1:2023 — Plain language](https://www.iso.org/standard/78907.html)
- [Google developer documentation style guide](https://developers.google.com/style)

Consult these sources for an unresolved style question or an explicit request
to align with the current guidance. Apply the practical rules above without
requiring a standards lookup for every document.
