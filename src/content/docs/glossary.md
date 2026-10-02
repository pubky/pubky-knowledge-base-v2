---
title: "Glossary"
---

Quick reference for terms used throughout the Pubky ecosystem.

---

## A

**Aggregator**
A service that collects and organizes data from multiple [Homeservers](/homeserver/) to enable search, feeds, and discovery features. See [Aggregator](/indexing-and-aggregation/).

**Authentication**
The process of proving ownership of a public key through cryptographic signatures, enabling secure access to Homeservers without passwords. See [details](/authentication/).

## C

**Grant**
A cryptographically signed authorization that gives a specific application scoped read and/or write access to a user's data. It expires and is bound to the application's proof-of-possession key.

**Censorship Resistance**
The property of being difficult or impossible to block, censor, or control by any single authority. Pubky achieves this through decentralized [Mainline DHT](/mainline-dht/) and distributed [Homeservers](/homeserver/).

**[Credible Exit](/credible-exit/)**
The ability to leave a service provider (Homeserver, app, etc.) without losing your data, identity, or social connections. A core principle of Pubky's architecture.

## D

**[Distributed Hash Table (DHT)](/mainline-dht/)**
A decentralized key-value storage system distributed across many nodes. Pubky uses [Mainline DHT](/mainline-dht/) for storing [PKARR](/pkarr/) records.

**[Domain Name System (DNS)](/pkdns/)**
Traditional system for translating domain names to IP addresses. [PKDNS](/pkdns/) extends this to support public-key domains.

**[DNS over HTTPS (DoH)](/pkdns/#dns-over-https-doh)**
Protocol for encrypting DNS queries using HTTPS, preventing surveillance and tampering.

## G

**Guarded Data**
See [Private Storage](/glossary/#private-storage). The [Security Model](/security-model/#guarded-data) uses "guarded" to distinguish access-controlled data from encrypted data.

## H

**[Homeserver](/homeserver/)**
A web server that stores user data in a filesystem over a simple HTTP API. Internally, PostgreSQL tracks metadata such as users, quotas, sessions, and events. Users can run their own or choose any provider. Data is stored per public key and accessed via HTTP/HTTPS.

**[Homegate](/homegate/)**
A signup verification service for Homeservers, providing SMS and Lightning Network payment verification to prevent spam while preserving privacy.

**[Homeserver CLI](https://github.com/pubky/pubky-homeserver/tree/{{pinned_homeserver_release}}/homeservercli)**
Command-line tool for interacting with Pubky Homeservers, providing user operations, admin functions, and testing utilities.

## I

**Indexer**
See **Aggregator**. A service that crawls and indexes data from Homeservers to provide search and discovery features.

## K

**[Key Pair](/security-model/#key-custody)**
A pair of cryptographic keys (public and private) used for identity, authentication, and encryption. In Pubky, your public key IS your identity.

## M

**[Mainline DHT](/mainline-dht/)**
The Distributed Hash Table used by BitTorrent, with 10+ million nodes globally. Pubky uses it to store [PKARR](/pkarr/) records, providing censorship-resistant discovery.

## N

**[Nexus](/pubky-nexus/)** (Pubky Nexus)
Production-grade indexing and aggregation service for [pubky.app](/pubky-app/). Provides high-performance social graph API, search, and real-time notifications.

**[Noise](/pubky-noise/)** (Pubky Noise)
Noise Protocol implementation for encrypted peer-to-peer communication in the Pubky ecosystem (work in progress).

## P

**[Paykit](/paykit/)**
Payment protocol built on Pubky for payment discovery and coordination across multiple payment methods, including Bitcoin on-chain and Lightning (work in progress).

**[PKARR](/pkarr/)** (Public Key Addressable Resource Records)
Self-issued, signed DNS-like records published to the Mainline DHT. Each record is tied to a public key and contains information like Homeserver locations.

**[PKDNS](/pkdns/)**
DNS server that resolves public-key domains by fetching PKARR records from the Mainline DHT, bridging traditional DNS with decentralized identity.

<span id="private-storage"></span>

**[Private Storage](/private-storage/)**
Storage under `/priv/` on a [Homeserver](/homeserver/), readable only with an authenticated session for the data owner's identity and capabilities covering the requested path. It provides access control, not encryption; apps that need confidentiality from the operator encrypt the data themselves.

**Proof of Possession (PoP)**
A cryptographic check that an application controls the private key bound to a grant. The application presents a signed PoP proof when exchanging the grant for a bearer token, so the grant cannot be used on its own. See [Authentication](/authentication/).

**Public Key**
The public half of a cryptographic key pair. In Pubky, this serves as your permanent, self-sovereign identity (often called a "pubky").

**Pubky**
1. The decentralized web protocol and ecosystem, formally known as the [Pubky protocol](/overview/)
2. A user's public-key identity (e.g., "my pubky is z4e8s...")

**Pubky app**
Any application built on the [Pubky protocol](/overview/). A Pubky app uses the Pubky [SDK](/sdk/) and [Homeservers](/homeserver/) for authentication and data storage. See [App Architectures](/app-architectures/).

**[pubky.app](/pubky-app/)**
The reference implementation of a Pubky app — a decentralized social media application built by Synonym, live at [pubky.app](https://pubky.app). It demonstrates how to build social applications on the Pubky protocol using [Nexus](/pubky-nexus/) for indexing and the [pubky-app-specs](/pubky-app-specs/) data model.

**[Pubky Backup](/pubky-backup/)**
Desktop app for keeping local copies of published Homeserver data. Current app details are in the [Pubky Backup README](https://github.com/pubky/pubky-backup/blob/main/README.md).

**[Pubky Protocol](/overview/)**
The protocol encompassing the Homeserver, SDK, PKARR and specifications for building decentralized applications on Pubky.

<span id="pubkytls"></span>

**PubkyTLS**
Pubky's TLS transport for Homeserver connections addressed by public key. It uses TLS with Raw Public Keys (RFC 7250), so the server public key is verified directly instead of through an X.509 certificate authority chain.

**[Pubky Docker](/pubky-docker/)**
Docker Compose orchestration for running the complete Pubky Social stack locally with one command.

**[Pubky Explorer](/pubky-explorer/)**
Web-based file browser for exploring public data on Pubky Homeservers. Available at [explorer.pubky.app](https://explorer.pubky.app).

**[Pubky Ring](/pubky-ring/)**
Mobile key manager app (iOS/Android) for securely managing pubkys, authorizing applications, and handling sessions.

**[pubky-app-specs](/pubky-app-specs/)**
Formal data model specifications for [pubky.app](/pubky-app/), defining structures for users, posts, tags, and other social features. Any Pubky app that follows these specs can interoperate with pubky.app and its ecosystem.

## R

**Recovery File**
Encrypted backup of a user's private key and identity information, protected by a passphrase. Used for key recovery and migration between devices.

## S

**[SDK](/sdk/)** (Software Development Kit)
Client libraries for building Pubky applications, available in Rust, JavaScript/WASM, and native mobile (iOS/Android).

**Self-Sovereign Identity**
Identity that is fully controlled by the individual, not dependent on any centralized authority or service provider. Pubky implements this via cryptographic key pairs.

**[Semantic Social Graph](/semantic-social-graph/)**
A social network where relationships are tagged with meaningful metadata, enabling personalized content filtering, trust-based discovery, and user-controlled feeds.

**Session**
A time-limited authentication state that allows a client to access a Homeserver without repeatedly signing requests with the private key.

## T

**Tag**
User-defined label attached to posts, files, or other users to add semantic meaning and enable filtering/discovery in the [Semantic Social Graph](/semantic-social-graph/).

## W

**Web of Trust**
Traditional model where trust propagates through social connections. Pubky extends this with the [Semantic Social Graph](/semantic-social-graph/), adding semantic context to trust relationships.
