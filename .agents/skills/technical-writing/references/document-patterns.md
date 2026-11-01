# Document patterns

Choose the sections that help readers achieve the document's purpose. Treat
these patterns as starting points, not required templates. Preserve established
repository formats and avoid empty or speculative sections.

## Contents

- [README](#readme)
- [Setup guide or tutorial](#setup-guide-or-tutorial)
- [API or configuration reference](#api-or-configuration-reference)
- [Architecture document or design proposal](#architecture-document-or-design-proposal)
- [Runbook or troubleshooting guide](#runbook-or-troubleshooting-guide)
- [Migration guide](#migration-guide)
- [Release notes and changelogs](#release-notes-and-changelogs)

## README

Help readers decide whether the project fits their needs and get started.

Suggested order:

1. Name and a short explanation of what the project does.
2. Relevant capabilities or a simple system diagram, if useful.
3. Prerequisites and the shortest supported path to a working setup.
4. A basic example or links to setup guides, with clear choices between them.
5. An explanation of behavior needed to use the project correctly.
6. Links to configuration, terminology, contribution, and release information.

Keep the introduction concrete. Avoid marketing claims and a full configuration
reference. Explain unfamiliar architecture after giving readers a way to start,
unless they need that explanation to choose a setup.

## Setup guide or tutorial

Help readers reach a specific working state in a defined environment.

Suggested order:

1. Outcome, scope, and platform or version assumptions.
2. Prerequisites and placeholder substitutions.
3. Numbered steps in execution order.
4. Verification of the completed setup.
5. Optional adaptations and maintenance tasks.
6. Symptom-led troubleshooting and next steps.

Within a step, give the instruction, command or example, and relevant expected
result. Use subheadings for distinct tasks within a long step. Keep explanatory
background brief and close to the action it explains.

Distinguish a tutorial's learning goals from a setup guide's operational outcome.
Include recovery or cleanup when the procedure leaves state that readers need
to manage; do not invent unnecessary cleanup work.

## API or configuration reference

Help readers find exact behavior without reading a narrative from start to finish.

- Group related settings or operations and use stable, searchable headings.
- For each setting, give its name, type, default or required status, accepted
  values, effect, constraints, and interactions when known.
- For each API operation, give its purpose, inputs, response, errors, and an
  example as appropriate. Keep authentication and version assumptions visible.
- Distinguish omitted values from explicit disabling values and empty values.
- Explain precedence between configuration sources when relevant.
- Keep descriptions standalone enough to support lookup. Use tables for compact
  facts and prose for behavior that needs explanation.
- Link to a guide for multi-step workflows instead of hiding them in reference entries.

Do not fabricate defaults, error codes, guarantees, or supported combinations.
Mark unresolved facts during drafting and resolve or surface them before delivery.

## Architecture document or design proposal

Help readers understand a system or evaluate a decision.

Suggested sections:

- Purpose and scope.
- Context, requirements, and constraints.
- Components, responsibilities, and interfaces.
- Data flow or request lifecycle.
- Important decisions and their reasons.
- Tradeoffs, limitations, and failure behavior.
- Open questions and links to related implementation or decisions.

For proposals, separate current behavior from proposed behavior. Include
alternatives and rollout considerations when they matter to the decision. For
an existing system, describe observed or documented behavior rather than an
idealized design. Use diagrams only when they clarify relationships or flow.

## Runbook or troubleshooting guide

Help operators recognize a condition, diagnose it, and restore the intended state.

Suggested order:

1. Symptom or trigger and affected scope.
2. Access, environment, and prerequisites.
3. Diagnostic steps with expected observations.
4. Actions selected by those observations.
5. Recovery verification.
6. Rollback or escalation when applicable.

Distinguish read-only checks from commands that change state. State the target
environment and concrete impact before disruptive actions. Explain ambiguous
results and preserve uncertainty about causes. Include rollback or escalation
only when there is a supported process, not an invented one.

## Migration guide

Help readers move from a known starting version or configuration to a target.

- State supported source and target versions.
- Explain breaking changes and who is affected.
- Put required preparations before the migration actions.
- Show old and new syntax side by side when useful.
- Include post-migration checks and compatibility limitations.
- Describe supported rollback or recovery options when available.

Keep replacement names and commands exact. Explain whether changes require a
restart, apply automatically, or affect stored data or external consumers.

## Release notes and changelogs

Help readers understand what changed and whether they need to act.

- Preserve the project's release, version, and category format.
- State user-visible changes concretely instead of listing vague improvements.
- Identify breaking changes and link to migration instructions when available.
- Include affected behavior, relevant limitations, and required action.
- Keep entries concise. Put implementation detail in developer-facing sections
  only when it helps the intended reader.
