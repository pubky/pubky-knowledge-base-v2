---
title: "Glossary"
---

Quick reference for terms used throughout the Pubky ecosystem.

---

## A

**Aggregator**
A service that collects and organizes data from multiple [Homeservers](/explore/pubkycore/homeserver/) to enable search, feeds, and discovery features. See [Aggregator](/explore/pubky-apps/indexing-and-aggregation/aggregator/).

**Authentication**
The process of proving ownership of a public key through cryptographic signatures, enabling secure access to Homeservers without passwords. See [details](/explore/pubkycore/authentication/).

## C

**Capability Token**
A cryptographically signed token that grants third-party applications limited access to a user's data on their Homeserver, similar to OAuth access tokens.

**Censorship Resistance**
The property of being difficult or impossible to block, censor, or control by any single authority. Pubky achieves this through decentralized [Mainline DHT](/explore/technologies/mainline-dht/) and distributed [Homeservers](/explore/pubkycore/homeserver/).

**[Credible Exit](/explore/concepts/credible-exit/)**
The ability to leave a service provider (Homeserver, app, etc.) without losing your data, identity, or social connections. A core principle of Pubky's architecture.

## D

**[Distributed Hash Table (DHT)](/explore/technologies/dht/)**
A decentralized key-value storage system distributed across many nodes. Pubky uses [Mainline DHT](/explore/technologies/mainline-dht/) for storing [PKARR](/explore/pubkycore/pkarr/introduction/) records.

**[Domain Name System (DNS)](/explore/technologies/dns/)**
Traditional system for translating domain names to IP addresses. [PKDNS](/explore/technologies/pkdns/) extends this to support public-key domains.

**[DNS over HTTPS (DoH)](/explore/technologies/doh/)**
Protocol for encrypting DNS queries using HTTPS, preventing surveillance and tampering.

## H

**[Homeserver](/explore/pubkycore/homeserver/)**
A web server that stores user data in a key-value format. Users can run their own or choose any provider. Data is stored per public key and accessed via HTTP/HTTPS.

**[Homegate](/explore/technologies/homegate/)**
A signup verification service for Homeservers, providing SMS and Lightning Network payment verification to prevent spam while preserving privacy.

## I

**Indexer**
See **Aggregator**. A service that crawls and indexes data from Homeservers to provide search and discovery features.

## J

**[Jeb](/explore/technologies/jeb-pubky-ai-bot/)**
AI-powered bot for the Pubky social network, providing post summaries and fact-checking capabilities using LLMs and web search.

## K

**[Key Pair](/explore/technologies/key-pair/)**
A pair of cryptographic keys (public and private) used for identity, authentication, and encryption. In Pubky, your public key IS your identity.

## M

**[Mainline DHT](/explore/technologies/mainline-dht/)**
The Distributed Hash Table used by BitTorrent, with 10+ million nodes globally. Pubky uses it to store [PKARR](/explore/pubkycore/pkarr/introduction/) records, providing censorship-resistant discovery.

## N

**[Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/)** (Pubky Nexus)
Production-grade indexing and aggregation service for Pubky App. Provides high-performance social graph API, search, and real-time notifications.

**[Noise](/explore/technologies/pubky-noise/)** (Pubky Noise)
Noise Protocol implementation for encrypted peer-to-peer communication in the Pubky ecosystem (work in progress).

## P

**[Paykit](/explore/technologies/paykit/)**
Payment protocol built on Pubky for payment discovery and coordination across Bitcoin, Lightning, and other methods (work in progress).

**[PKARR](/explore/pubkycore/pkarr/introduction/)** (Public Key Addressable Resource Records)
Self-issued, signed DNS-like records published to the Mainline DHT. Each record is tied to a public key and contains information like Homeserver locations.

**[PKDNS](/explore/technologies/pkdns/)**
DNS server that resolves public-key domains by fetching PKARR records from the Mainline DHT, bridging traditional DNS with decentralized identity.

**Public Key**
The public half of a cryptographic key pair. In Pubky, this serves as your permanent, self-sovereign identity (often called a "pubky").

**Pubky**
1. The decentralized web protocol and ecosystem
2. A user's public-key identity (e.g., "my pubky is z4e8s...")

**[Pubky App](/explore/pubky-apps/introduction/)**
Social media application demonstrating Pubky Core capabilities. Live at [pubky.app](https://pubky.app).

**[Pubky CLI](/explore/technologies/pubky-cli/)**
Command-line tool for interacting with Pubky Homeservers, providing user operations, admin functions, and testing utilities.

**[Pubky Core](/explore/pubkycore/introduction/)**
The foundational protocol, Homeserver implementation, and SDK for building decentralized applications on Pubky.

**[Pubky Docker](/explore/technologies/pubky-docker/)**
Docker Compose orchestration for running the complete Pubky Social stack locally with one command.

**[Pubky Explorer](/explore/technologies/pubky-explorer/)**
Web-based file browser for exploring public data on Pubky Homeservers. Available at [explorer.pubky.app](https://explorer.pubky.app).

**[Pubky Ring](/explore/technologies/pubky-ring/)**
Mobile key manager app (iOS/Android) for securely managing pubkys, authorizing applications, and handling sessions.

**pubky-app-specs**
Formal data model specifications for Pubky App, defining structures for users, posts, tags, and other social features. Ensures interoperability between different client implementations.

## R

**Recovery File**
Encrypted backup of a user's private key and identity information, protected by a passphrase. Used for key recovery and migration between devices.

## S

**[SDK](/explore/pubkycore/sdk/)** (Software Development Kit)
Client libraries for building Pubky applications, available in Rust, JavaScript/WASM, and native mobile (iOS/Android).

**Self-Sovereign Identity**
Identity that is fully controlled by the individual, not dependent on any centralized authority or service provider. Pubky implements this via cryptographic key pairs.

**[Semantic Social Graph](/explore/concepts/semantic-social-graph/)**
A social network where relationships are tagged with meaningful metadata, enabling personalized content filtering, trust-based discovery, and user-controlled feeds.

**Session**
A time-limited authentication state that allows a client to access a Homeserver without repeatedly signing requests with the private key.

## T

**Tag**
User-defined label attached to posts, files, or other users to add semantic meaning and enable filtering/discovery in the [Semantic Social Graph](/explore/concepts/semantic-social-graph/).

## W

**Web of Trust**
Traditional model where trust propagates through social connections. Pubky extends this with the [Semantic Social Graph](/explore/concepts/semantic-social-graph/), adding semantic context to trust relationships.

---

## Quick Links

- **[Main Documentation](/)**: Full knowledge base
- **[Getting Started](/getting-started/)**: Get started with Pubky
- **[FAQ](/faq/)**: Frequently asked questions
- **[Comparisons](/comparisons/)**: How Pubky compares to alternatives
- **[Vision](/the-vision-of-pubky/)**: Why we're building Pubky

