---
title: "Glossary"
---

Quick reference for terms used throughout the Pubky ecosystem.

| Term | Meaning in Pubky |
| --- | --- |
| [Aggregator / indexer](/explore/pubky-apps/indexing-and-aggregation/introduction/) | A service that collects records and organizes them for application queries. |
| [App Specs](/explore/pubky-apps/app-specs/) | Shared data models for social applications that interoperate with pubky.app. |
| [Credible Exit](/explore/concepts/credible-exit/) | The practical ability to leave a provider with your identity and usable data. |
| [Grant](/explore/pubky-protocol/authentication/) | A signed authorization for an application to act within approved scopes. |
| [Homeserver](/explore/pubky-protocol/homeserver/) | A server that stores data associated with users' public keys. |
| [Mainline DHT](/explore/technologies/mainline-dht/) | The distributed network used to publish and resolve PKARR records. |
| [Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) | An indexer and query API for Pubky's shared social data. |
| [PKARR](/explore/pubky-protocol/pkarr/introduction/) | Public Key Addressable Resource Records: signed discovery records addressed by a public key. |
| [PKDNS](/explore/technologies/pkdns/) | A DNS resolver that makes PKARR records available through DNS. |
| [Pubky](/overview/) | The protocol and ecosystem; also the name for a user's public-key identity. |
| [Pubky app](/explore/pubky-apps/introduction/) | Any application built on the Pubky protocol. |
| [pubky.app](/explore/pubky-apps/reference-app/pubky-app/) | The reference social application. |
| [Pubky Ring](/explore/technologies/pubky-ring/) | A key manager used to hold identities and approve application access. |
| [SDK](/explore/pubky-protocol/sdk/) | Client libraries for building applications on the protocol. |
| [Semantic Social Graph](/explore/concepts/semantic-social-graph/) | Relationships between people and content that preserve the meaning of each connection. |
| [Session](/explore/pubky-protocol/authentication/) | An application's authenticated access to a Homeserver. |

<a id="pubkytls"></a>

**PubkyTLS**
Pubky's TLS transport for Homeserver connections addressed by public key. See the [PKARR transport documentation](https://github.com/pubky/pkarr/blob/main/docs/integration.md) for the underlying public-key resolution and transport integration.
