---
title: "Homeserver"
---

A Homeserver stores and serves data for public-key identities. Users choose their provider; [PKARR](/explore/pubky-protocol/pkarr/introduction/) lets applications discover that provider from the user's public key.

## Its role in an app

Think of a Homeserver as storage an application can use on the user's behalf. A user authorizes the app, and the app writes files within the permissions it receives. Other apps can read public files and interpret them when they understand the data format.

The Homeserver serves those files even when the user's device is offline, provided the service remains available. It does not decide what a social feed should show or how a search result should rank. An application or [indexer](/explore/pubky-apps/indexing-and-aggregation/introduction/) handles those views.

Users can choose a provider instead of operating a server themselves. Provider policies determine signup requirements and service limits. Keeping an identity independent of its provider enables [Credible Exit](/explore/concepts/credible-exit/), but moving files and updating discovery still require working tools and available copies.

The upstream [Private Storage guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/PRIVATE_STORAGE.md) defines the public and authenticated storage namespaces. Access control still trusts the operator; see the [Security Model](/explore/pubky-protocol/security-model/).

## Running a Homeserver

For installing, configuring, and running a Homeserver, follow the
[Install Guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/INSTALL.md). To make it
publicly reachable see the
[Deployment Guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/DEPLOY.md).

For local development and testing with a fixed-port testnet, follow the
[Pubky Testnet README](https://github.com/pubky/pubky-homeserver/blob/main/pubky-testnet/README.md).
For a full walkthrough of setting up a local stack and building your first app, see the
[Developer Guide](/explore/pubky-protocol/getting-started).

## HTTP API

For routes, parameters, and response schemas, use the maintained upstream specifications:

- **[Client OpenAPI](https://github.com/pubky/pubky-homeserver/blob/main/pubky-homeserver/openapi-client.yml)**: Authentication, file storage, event streams, and signup-token validation.
- **[Admin OpenAPI](https://github.com/pubky/pubky-homeserver/blob/main/pubky-homeserver/openapi-admin.yml)**: Server administration, signup tokens, user quotas, and WebDAV.

For app development, use the [SDK](/explore/pubky-protocol/sdk/), which handles authentication, Homeserver discovery, and transport.
