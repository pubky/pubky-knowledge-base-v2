---
title: "Private Storage"
---

Apps can use `/priv/` on a [Homeserver](/components/homeserver/) for non-public, user-specific data, such as preferences or drafts. This keeps app state attached to the user's Pubky identity without publishing it for everyone to read. Private storage controls who can access the data; it does not encrypt it. The Homeserver can still read the contents unless the app encrypts them.

## Public and Private Storage

Files under `/pub/` are publicly readable. Access to `/priv/` requires an authenticated session for the data owner's identity, with capabilities covering the requested operation and path. This allows the owner and apps they authorize to access their private app data. `/priv/` alone does not provide sharing with other Pubky identities.

Existing `/pub/` data remains public. Choosing `/priv/` for private storage does not retract previously published copies.

## Privacy and Trust

Homeserver operators and privileged administrators can read unencrypted `/priv/` content. Apps that need confidentiality from the Homeserver must encrypt their data and manage the encryption keys themselves. See the [Security Model](/learn/security-model/) for the trust placed in Homeservers.

## Documentation

- [Private Storage guide](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/docs/PRIVATE_STORAGE.md) — Behavior, access rules, and security considerations.
- [SDK storage guide](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/pubky-sdk/README.md#storage-api-session--public) — Working with storage through the SDK.
- [Client OpenAPI specification](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/pubky-homeserver/openapi-client.yml) — HTTP API contracts.
