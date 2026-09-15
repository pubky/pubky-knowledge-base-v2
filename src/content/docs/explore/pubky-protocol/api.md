---
title: "Homeserver APIs"
---

[Homeservers](/explore/pubky-protocol/homeserver/) expose separate APIs for applications and administration. The upstream OpenAPI specifications are the maintained references for endpoints, authentication requirements, request parameters, and response schemas.

<span id="grant-endpoints"></span>

## Client API

The [client OpenAPI specification](https://github.com/pubky/pubky-homeserver/blob/main/pubky-homeserver/openapi-client.yml) covers application authentication, file storage, and event streams.

For application development, use the [Pubky SDK](/explore/pubky-protocol/sdk/) to handle discovery, authentication, and transport. See the [Developer Guide](/explore/pubky-protocol/getting-started/) for application workflows and [Authentication](/explore/pubky-protocol/authentication/) for the user approval flow.

## Admin API

The [admin OpenAPI specification](https://github.com/pubky/pubky-homeserver/blob/main/pubky-homeserver/openapi-admin.yml) covers operator tasks such as managing signup tokens, users, quotas, and administrative file access.

Admin access is privileged. Keep the admin interface private and protected, and provide admin credentials only to trusted operators. Ordinary applications should use the client API through the SDK.

For installation and public deployment, follow the [Install Guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/INSTALL.md) and [Deployment Guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/DEPLOY.md). The [Security Model](/explore/pubky-protocol/security-model/) explains the trust placed in Homeserver operators.
