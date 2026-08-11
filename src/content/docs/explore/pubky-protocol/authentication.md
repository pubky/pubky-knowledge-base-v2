---
title: "authentication"
---

Pubky uses decentralized authentication where users control their own cryptographic keys. There are no central identity providers.

## Key Concepts

- **Authenticator**: Any software or hardware capable of [Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519) signing, such as [Pubky Ring](/explore/technologies/pubky-ring/).
- **Capabilities**: Permissions defining what an app can access (e.g., `/pub/pubky.app/:rw` has read and write permissions for path `/pub/pubky.app`).
- **AuthToken**: A signed, time-limited token granting access to the [Homeserver](/explore/pubky-protocol/homeserver/). Created by the Authenticator, processed by the [SDK](/explore/pubky-protocol/sdk/), and verified by the Homeserver.

## Participants

- **Authenticator**: App holding user's keypair (e.g., [Pubky Ring](/explore/technologies/pubky-ring/))
- **3rd Party App**: Application requesting access
- **[HTTP Relay](/explore/technologies/http-relay/)**: Forwards encrypted tokens between Ring and the app
- **[Homeserver](/explore/pubky-protocol/homeserver/)**: Verifies tokens and issues sessions

## User Flow with Pubky Ring

Apps display a QR code, the user scans it with [Pubky Ring](/explore/technologies/pubky-ring/), reviews permissions, and approves. The [HTTP Relay](/explore/technologies/http-relay/) securely forwards the encrypted AuthToken back to the app via the `/inbox` endpoint, which then exchanges it with the [Homeserver](/explore/pubky-protocol/homeserver/) for a session. Auth tokens are valid for a 3-minute window to account for clock drift and slow connections.

If an app reloads while approval is pending, the SDK can resume the flow from the original `authorizationUrl` using `resumeAuthFlow` (JavaScript) or `resume_auth_flow` (Rust). The URL contains the `client_secret`, so store it only in short-lived storage and delete it once the flow completes or is abandoned. Resume only works while the relay channel remains within its retention window, currently about 5 minutes.

The full protocol specification is documented in the [pubky-homeserver GitHub repository](https://github.com/pubky/pubky-homeserver/blob/main/docs/AUTH.md).

## Relay Security

The [HTTP Relay](/explore/technologies/http-relay/) encrypts tokens between the authenticator and the requesting app using a shared `client_secret`. The relay itself only sees encrypted blobs and cannot capture valid auth tokens. Messages are persisted for up to 5 minutes and deleted after retrieval. Resume depends on the saved `authorizationUrl`, which lets the SDK rebuild the same relay channel. If the user has not approved yet, the resumed flow keeps polling that channel. If the user approved while the app was refreshed or offline, the encrypted token must still be in `/inbox`, which keeps messages for up to 5 minutes. See [Security Model](/explore/pubky-protocol/security-model/) for the full trust analysis.

## Current Limitations

1. **Session Cookie Collision**: Currently, all sessions share a single authentication cookie. Logging into App B overwrites App A's session. This is unintended behavior, see [issue #122](https://github.com/pubky/pubky-homeserver/issues/122).

2. **No Key Delegation**: AuthToken must be signed by the user's main key.

## Trust Assumptions

**Key management software must be trusted**: [Pubky Ring](/explore/technologies/pubky-ring/) keeps keys out of third-party apps, but apps that handle keys directly must be fully trusted. This is inherent to any self-custody system.

## Session Management Rework (Planned)

The authentication system is being reworked to fix the cookie collision bug and improve multi-app support.
