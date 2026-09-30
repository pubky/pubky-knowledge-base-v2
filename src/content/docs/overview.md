---
title: "Overview"
---

## What is Pubky?

Pubky is an open protocol for applications built around public-key identities and user-chosen hosting. A public key identifies the user; [PKARR](/components/pkarr/) lets applications discover the user's [Homeserver](/components/homeserver/).

The protocol provides identity, discovery, and storage. Applications decide how to use that storage and access it through the [SDK](/build/sdk/). [pubky.app](/social-data/pubky-app/) is a social application built on it, with shared data models and an indexer for feeds and search.

![Pubky architecture diagram showing the relationship between public-key identities, PKARR records on Mainline DHT, Homeservers, and client applications](/images/pubky-homeserver.svg)

## Why Pubky exists

Pubky's goal is a web where people control their identities, choose where their data lives, and decide how to discover and filter information.

On a service that owns both your account and its database, changing applications often means starting again. Pubky separates those responsibilities:

- **Your identity can outlast a provider.** Applications identify you by your public key, and discover where your data is hosted. Changing hosts does not require a new identifier. Making that move practical also requires your key, usable copies of your data, and migration tooling; see [Credible Exit](/learn/credible-exit/).
- **Less dependence on a single service.** User-chosen hosting and decentralized discovery support [Censorship Resistance](/learn/censorship-resistance/).
- **Different apps can work with the same data.** A post or profile can be read by another app that understands its format. The [shared social specifications](/social-data/pubky-app-specs/) make this possible for pubky.app's data, while other apps can define formats suited to their own purpose.
- **The view of the data can change independently.** Clients and indexers can offer different feeds, search results, or filters. Relationships and tags supply context for those views through the [Semantic Social Graph](/social-data/semantic-social-graph/).

For a developer, this means building on familiar web applications and HTTP storage while letting users choose their identity and hosting. An app can access a user's files directly or use an indexer when it needs to search across many users. The [architecture overview](/architecture/) explains how those pieces fit together.

These choices do not eliminate trust in software or hosting providers. The [Security Model](/build/security-model/) explains key custody, public data, and what a Homeserver operator can do.

## The broader vision

The **Atomic Economy** extends these ideas into a broader vision of economic and social coordination. Start with [The Atomic Economy: Reclaiming Society from the Inside Out](https://medium.com/pubky/the-atomic-economy-reclaiming-society-from-the-inside-out-574504dfe326), then explore the original [essays and talks](/resources/#philosophical-foundations). These describe motivations and possibilities; [Architecture](/architecture/) explains the implemented components and their boundaries.

<span id="where-to-start"></span>

## Quick Start

- **Try Pubky:** [First Steps](/getting-started/) introduces the user journey.
- **Build an app:** the [Developer Guide](/build/developer-guide/) walks through writing and reading your first Pubky data.
- **Choose an app design:** compare [App Architectures](/build/app-architectures/).
- **Understand the system:** [Architecture](/architecture/) explains the component boundaries; the [Security Model](/build/security-model/) covers trust and limitations.
- **Run a Homeserver:** follow the [Install Guide](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/docs/INSTALL.md) and [Deployment Guide](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/docs/DEPLOY.md).
- **Work on the protocol:** the [Pubky repository](https://github.com/pubky/pubky-homeserver) contains the Homeserver, SDKs, local testnet, and examples.
- **Find a project or tool:** use the [Resources](/resources/) directory.
