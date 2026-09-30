---
title: "Homeserver"
---

A Homeserver stores and serves data for Pubky users. Users self-host their Homeserver or choose a provider. [PKARR](/components/pkarr/) lets applications discover the Homeserver from the user's public key.

## Its role in an app

Think of a Homeserver as storage an application can use on the user's behalf. A user authorizes the app, and the app writes files within the permissions it receives. Other apps can read public files and interpret them when they understand the data format.

The Homeserver serves those files even when the user's device is offline, provided the service remains available. It does not decide what a social feed should show or how a search result should rank. An application or [indexer](/social-data/indexing-and-aggregation/) handles those views.

The Pubky protocol separates identity from hosting, enabling [Credible Exit](/learn/credible-exit/), but moving files and updating discovery still require working tools and available copies.

Homeservers provide publicly readable `/pub/` storage and access-controlled (not encrypted) `/priv/` storage. See [Private Storage](/build/private-storage/) for an overview and guides. Access control still trusts the operator; see the [Security Model](/build/security-model/).

Homeservers provide [event streams](#http-api) that let apps and indexers follow changes to stored files.

Homeservers also support [storage locking](/build/sdk/#storage-locking) to help applications coordinate concurrent updates to the same file.

## Running a Homeserver

For installing, configuring, and running a Homeserver, follow the
[Install Guide](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/docs/INSTALL.md). To make it
publicly reachable see the
[Deployment Guide](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/docs/DEPLOY.md).

For local development and testing with a fixed-port testnet, follow the
[Pubky Testnet README](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/pubky-testnet/README.md).
For a full walkthrough of setting up a local stack and building your first app, see the
[Developer Guide](/build/developer-guide).

## HTTP API

For routes, parameters, and response schemas, use the specifications:

- **[Client OpenAPI](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/pubky-homeserver/openapi-client.yml)**: Authentication, file storage, event streams, and signup-token validation.
- **[Admin OpenAPI](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/pubky-homeserver/openapi-admin.yml)**: Server administration, signup tokens, user quotas, and WebDAV.

Admin access is privileged. Keep the admin interface private and protected, and provide admin credentials only to trusted operators. Ordinary applications should use the client API through the SDK.

For app development, use the [SDK](/build/sdk/), which handles authentication, Homeserver discovery, and transport.
