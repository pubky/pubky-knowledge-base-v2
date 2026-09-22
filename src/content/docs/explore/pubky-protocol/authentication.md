---
title: "authentication"
---

Pubky uses decentralized authentication where users control their own cryptographic keys. There are no central identity providers.

## Key Concepts

- **Authenticator**: Any software or hardware capable of [Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519) signing, such as [Pubky Ring](/explore/technologies/pubky-ring/).
- **Capabilities**: Permissions defining what an app can access (e.g., `/pub/pubky.app/:rw` has read and write permissions for the `/pub/pubky.app/` directory).
- **Grant**: A signed authorization that binds capabilities to an app's client ID and proof-of-possession key.
- **Proof-of-possession (PoP) key**: An app-specific key required to use a grant.

## Participants

- **Authenticator**: App holding user's keypair (e.g., [Pubky Ring](/explore/technologies/pubky-ring/))
- **3rd Party App**: Application requesting access
- **[HTTP Relay](/explore/technologies/http-relay/)**: Forwards encrypted grants between Ring and the app
- **[Homeserver](/explore/pubky-protocol/homeserver/)**: Verifies grants and issues sessions

## User Flow with Pubky Ring

Apps display a QR code that users scan with [Pubky Ring](/explore/technologies/pubky-ring/). The user reviews the requested permissions and approves them, allowing the app to establish a session with their [Homeserver](/explore/pubky-protocol/homeserver/).

## Grant Lifecycle

Grant-based signup uses a short-lived root-capability signup grant to create an account without creating a session. Applications then establish sessions with their own scoped grants and can inspect the current grant-backed session's metadata.

A session with the exact root capability `/:rw` can list and revoke active grants. This access should be reserved for trusted identity or session managers. Signing out of a grant-backed session revokes its backing grant, and revoking any grant invalidates every bearer session issued from it. See the [API Reference](/explore/pubky-protocol/api/#grant-endpoints) for the raw endpoints.

## Relay Security

The [HTTP Relay](/explore/technologies/http-relay/) encrypts grants between the authenticator and the requesting app using a shared relay secret. The relay itself only sees encrypted blobs. A grant also requires the app's matching PoP key before it can be exchanged for a bearer token. Messages are persisted for up to 5 minutes and deleted after retrieval. See [Security Model](/explore/pubky-protocol/security-model/) for the full trust analysis.

## Trust Assumptions

**Key management software must be trusted**: [Pubky Ring](/explore/technologies/pubky-ring/) keeps keys out of third-party apps, but apps that handle keys directly must be fully trusted. This is inherent to any self-custody system.
