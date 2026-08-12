---
title: "Homeserver"
---

The Pubky network allows multiple, independent data stores, known as "Homeservers." This improves [censorship-resistance](/explore/concepts/censorship/) and prevents any single entity from controlling the flow of information, or locking people & data in as a walled garden.

Homeservers are meant to represent a primary place to retrieve data from a specific [PKARR](/explore/pubky-protocol/pkarr/introduction/) public key, but the user can redefine the location of their Homeserver at will by updating their [PKARR](/explore/pubky-protocol/pkarr/introduction/) record in the [Mainline DHT](/explore/technologies/mainline-dht/).

## Architecture

The Homeserver implementation consists of several components: the main HTTP API server (supporting both ICANN HTTP and [PubkyTLS](/glossary/#pubkytls)), an admin server, a Prometheus metrics server, and republishers that keep user and server keys alive on the DHT.

See the [repository](https://github.com/pubky/pubky-homeserver/tree/main/pubky-homeserver) for API details and configuration.

## Public vs Private Data

Current implementations only support public, unencrypted data. Encrypted data and guarded (access-controlled) data are planned — see [Security Model](/explore/pubky-protocol/security-model/) for the trust implications.

## Event Stream

Homeservers expose event streams for clients to sync data changes:

- `GET /events-stream` — SSE real-time stream with user and path filters. Primary event API, used by clients to subscribe to specific users on third-party homeservers without processing unwanted traffic
- `GET /events/` — Paginated event feed for all users on the homeserver (cursor-based, 1000 events per batch)


## Transport Security

Homeservers expose two endpoint types: a [PubkyTLS](/glossary/#pubkytls) direct endpoint (TLS with Raw Public Keys, RFC 7250) and an ICANN endpoint intended to sit behind a reverse proxy with standard X.509 TLS.

SDK clients running outside the browser (for example Rust CLI/server apps or native mobile apps using the SDK bindings) prefer the [PubkyTLS](/glossary/#pubkytls) direct endpoint. When the PKARR record also advertises an ICANN endpoint and the direct endpoint is unreachable, SDK clients automatically use the ICANN endpoint instead. Browsers and legacy clients use the ICANN endpoint from the start. See [Transport Security](/explore/pubky-protocol/security-model/#transport-security) for details.

This is useful for Homeservers whose direct [PubkyTLS](/glossary/#pubkytls) socket is not reachable from every network, for example behind NAT or a tunnel, while their ICANN domain remains reachable through conventional HTTPS infrastructure.

## User Data Control and Credible Exit

- The current network is being bootstrapped by Synonym's first Homeserver — over time, more independent Homeserver operators and Pubky applications are needed for the network to fully decentralize
- Anyone can run their own Homeserver and set their own terms
- Homeserver operators can use [Homegate](/explore/technologies/homegate/) for signup verification, implementing SMS or Lightning Network verification to prevent spam while preserving user privacy
- For practical [credible exit](/explore/concepts/credible-exit/), users should maintain local copies and snapshots with [Pubky Backup](/explore/technologies/pubky-backup/). Homeserver mirroring is planned but not yet implemented
- Users can migrate to a new Homeserver by signing up there, re-uploading their data, and updating their own [PKARR](/explore/pubky-protocol/pkarr/introduction/) record

See [Security Model](/explore/pubky-protocol/security-model/) for the full trust analysis and failure recovery scenarios.

## Running a Homeserver

> **Note:** Production deployment guides are not yet available. Easy deployment packages (Umbrel, apt, docker, start9) are under development.

For local development and testing, start PostgreSQL and configure `database_url`, then run:

```bash
cargo run -p pubky-homeserver
```

For the fixed-port local testnet, Docker-managed PostgreSQL, external PostgreSQL, and in-process
testnet usage, follow the
[Pubky Testnet README](https://github.com/pubky/pubky-homeserver/blob/main/pubky-testnet/README.md).
