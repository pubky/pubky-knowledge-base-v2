---
title: "Introduction"
---

# Pubky Client

![pubkey-client](/images/pubky-header.png)

The Pubky client is the user-facing application for interacting with the Pubky social network. It is available as a progressive web app (PWA) and will eventually support desktop applications.

## Current Implementation

- **Live Application**: [pubky.app](https://pubky.app) - Production PWA currently operational
- **Backend**: Powered by [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) indexing service using Synonym hosted infrastructure
## Development Status

The web client is live at [pubky.app](https://pubky.app).

**For Developers**:
- **Building Compatible Clients**: Use [pubky-app-specs](https://www.npmjs.com/package/pubky-app-specs) as the authoritative data model specification.
- **Contributing**: Contributions welcome at [github.com/pubky/pubky-app](https://github.com/pubky/pubky-app)

Using the library analogy, the Pubky Client is like a personalized research assistant who takes the prepared documents from the librarian ([backend](/explore/pubky-apps/indexing-and-aggregation/introduction/)) and creates a customized report just for you. This report is designed to be easy to read and understand, with all the relevant information presented in a clear and concise manner.

- Users are able to take control of the data and exit the Synonym hosted services and run their own without hampering discoverability ([credible exit](/explore/concepts/credible-exit/)).

- Pubky client uses the open [Pubky protocol](/explore/pubky-protocol/introduction/) for nearly all features, allowing users to avoid censorship by choosing self-hosting or alternate hosts without losing followers or integrity. 

Future pubky.app versions may leverage [Paykit](/explore/technologies/paykit/) once infrastructure reaches production readiness to support creator monetization.

- Communities facilitate moderation and discovery around shared interests.
