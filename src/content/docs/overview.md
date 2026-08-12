---
title: "Overview"
---

## Welcome to the Pubky Knowledge Base

This is the Pubky knowledge base: documentation, explainers and guides on [the Pubky protocol](/explore/pubky-protocol/introduction/), [PKARR](/explore/pubky-protocol/pkarr/introduction/) and [Pubky App](/explore/pubky-apps/introduction/). These documents are a work in progress, much like Pubky's protocols and applications!

## What is Pubky?

Pubky attempts to unlock the web by realizing our vision for a key-based, self-regulating web that puts users in control.

So far, Pubky does this by combining practical decentralized routing & identity ([PKARR](/explore/pubky-protocol/pkarr/introduction/)), with simple interoperable hosting ([Homeservers](/explore/pubky-protocol/homeserver/)) that allow for [censorship](/explore/concepts/censorship/) resistance and a [credible exit](/explore/concepts/credible-exit/), as well as a publishing application, Pubky App, that facilitates the creation of a [Semantic Social Graph](/explore/concepts/semantic-social-graph/), which can be used for filtering, discovery, matching and coordination.

Learn more about the overall vision here: [The Vision of Pubky](/the-vision-of-pubky/)

## Quick Start

- **[TLDR](/tldr/)**: 30-second overview of the entire ecosystem
- **[Getting Started](/getting-started/)**: User guide to Pubky identity, pubky.app, and your data
- **[Developer Guide](/explore/pubky-protocol/getting-started/)**: First steps for building on Pubky
- **[Glossary](/glossary/)**: Quick reference for key terms
- **[Comparisons](/comparisons/)**: How Pubky compares to other protocols
- **[Frequently Asked Questions (FAQ)](/faq/)**: 63+ questions answered

## For Users

### Try Pubky

1. **[Pubky Ring](/explore/technologies/pubky-ring/)** - Download the mobile key manager app (iOS/Android)
2. **[Pubky.app](https://pubky.app)** - Try the social media application
3. **[Pubky Explorer](/explore/technologies/pubky-explorer/)** - Browse your data at [explorer.pubky.app](https://explorer.pubky.app)
4. **[Pubky Backup](/explore/technologies/pubky-backup/)** - Keep local copies of your published Homeserver data

### Identity Management

🔐 **[Pubky Ring](/explore/technologies/pubky-ring/)** is the key manager app for the Pubky ecosystem. Native mobile app (iOS/Android) for managing your pubkys, authorizing apps, and controlling sessions.

- [Pubky Ring Overview](/explore/technologies/pubky-ring/) - Your keychain for decentralized identity
- [Official Repository](https://github.com/pubky/pubky-ring) - React Native mobile app

## For Developers: The Pubky Protocol

🏗️ **[Pubky protocol](/explore/pubky-protocol/introduction/)** is the open protocol and infrastructure for building censorship-resistant web applications.

### Core Documentation

- [Pubky Protocol Overview](/explore/pubky-protocol/introduction/) - Homeserver, PKARR and SDK
- [Developer Guide](/explore/pubky-protocol/getting-started/) - First steps for building on Pubky
- [SDK Documentation](/explore/pubky-protocol/sdk/) - Client libraries (Rust, JavaScript, iOS, Android)
- [API Reference](/explore/pubky-protocol/api/) - RESTful HTTP API specification
- [Architecture Overview](/architecture/) - System design and data flow
- [Homeserver Documentation](/explore/pubky-protocol/homeserver/) - Deploy and configure Homeservers
- [Security Model](/explore/pubky-protocol/security-model/) - Threat landscape, trust assumptions, and credible exit

### Infrastructure

- [Homegate](/explore/technologies/homegate/) - Signup verification service for Homeservers (SMS + Lightning)
- [PKDNS](/explore/technologies/pkdns/) - DNS server for resolving public-key domains
- [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) - Production indexing service
- [HTTP Relay](/explore/technologies/http-relay/) - Auth token forwarding for authentication flows
- [Pubky Backup](/explore/technologies/pubky-backup/) - Desktop backup for data portability and credible exit
- [Pubky Moderation](/explore/technologies/pubky-moderation/) - Content moderation service

### Resources

- [Official Pubky Homeserver Repository](https://github.com/pubky/pubky-homeserver) - MIT licensed
- [Rust API Docs](https://docs.rs/pubky) - Rust crate documentation
- [NPM Package](https://www.npmjs.com/package/@synonymdev/pubky) - JavaScript/TypeScript bindings

## Developer Tools

🛠️ **Pubky Ecosystem Tools** - Utilities for development, debugging, and exploration:

- **[Pubky Docker](/explore/technologies/pubky-docker/)** - One-click Docker stack for running the complete Pubky Social environment locally
- **[Pubky Explorer](/explore/technologies/pubky-explorer/)** - Web-based file browser for Homeserver data ([explorer.pubky.app](https://explorer.pubky.app))
- **[Pubky Backup](/explore/technologies/pubky-backup/)** - Desktop app for local `/pub/...` data backups and snapshots
- **[Pubky CLI](/explore/technologies/pubky-cli/)** - Command-line tool for Homeserver management and testing
- **PKDNS Digger** - Web-based DNS record lookup tool for PKARR domains ([github.com/pubky/pkdns-digger](https://github.com/pubky/pkdns-digger))

## Pubky.app: Social Application

**[Pubky.app](/explore/pubky-apps/introduction/)** is a decentralized social media application built on the Pubky protocol.

### Current Status

- **Live Application**: [https://pubky.app](https://pubky.app) - Production PWA currently operational
- **Web Client**: [pubky.app](/explore/pubky-apps/reference-app/pubky-app/) ([github.com/pubky/pubky-app](https://github.com/pubky/pubky-app))
- **Data Model Specification**: [App Specs](/explore/pubky-apps/app-specs/) ([pubky-app-specs](https://github.com/pubky/pubky-app-specs)) - Formal schema definitions for interoperability

### Backend Infrastructure

🚀 **[Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/)** is the production indexing and aggregation service that powers Pubky App's social features.

- [Pubky Nexus Overview](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) - Real-time social graph aggregation and high-performance API
- [Official Repository](https://github.com/pubky/pubky-nexus) - Open source Rust implementation
- [Live API](https://nexus.pubky.app/swagger-ui/) - Production REST API with Swagger UI
- [Staging API](https://nexus.staging.pubky.app/swagger-ui/) - Latest development version

## Key Concepts

Understand the fundamental ideas behind Pubky:

- **[Semantic Social Graph](/explore/concepts/semantic-social-graph/)** - Tagged relationships and user-controlled filtering
- **[Censorship Resistance](/explore/concepts/censorship/)** - Why centralized platforms fail
- **[Credible Exit](/explore/concepts/credible-exit/)** - Freedom to switch providers without losing data
- **[PKARR](/explore/pubky-protocol/pkarr/introduction/)** - Public key addressable resource records
- **[Mainline DHT](/explore/technologies/mainline-dht/)** - Distributed hash table for discovery

## Work in Progress: Payment Protocol

⚠️ **[Paykit](/explore/technologies/paykit/)** is a work-in-progress payment protocol built on Pubky for payment discovery and coordination. Not production-ready.

- [Paykit Overview](/explore/technologies/paykit/) - Current state and architecture
- [Repository](https://github.com/pubky/paykit-rs) - Project status and docs
- [Payment Endpoint Identifier Spec](https://github.com/pubky/paykit-rs/blob/master/specs/payment-endpoint-identifier.md) - Identifier convention

## Work in Progress: Encrypted Communication

⚠️ **[Pubky Noise](/explore/technologies/pubky-noise/)** is a Noise Protocol implementation (work in progress) for encrypted peer-to-peer communication in the Pubky ecosystem. Not production-ready.

- [Pubky Noise](/explore/technologies/pubky-noise/) - Encrypted communication for Pubky (WIP)
- [Repository](https://github.com/pubky/pubky-noise) - WIP

## Community & Support

- **[Getting Started](/getting-started/)** - User onboarding guide
- **[Developer Guide](/explore/pubky-protocol/getting-started/)** - Developer onboarding guide
- **[FAQ](/faq/)** - Frequently asked questions
- **[Troubleshooting](/troubleshooting/)** - Common issues and solutions
- **[Contributing](/contributing/)** - How to contribute to Pubky
- **Telegram**: [t.me/pubkycore](https://t.me/pubkycore)
- **GitHub**: [github.com/pubky](https://github.com/pubky)

---

**Ready to get started? Use the [user guide](/getting-started/) or the [developer guide](/explore/pubky-protocol/getting-started/).**
