---
title: "Pubky: Open Protocol for Decentralized Web Applications"
---

![Pubky architecture diagram showing the relationship between public-key identities, PKARR records on Mainline DHT, Homeservers, and client applications](/images/pubky-homeserver.svg)

Pubky separates a user's identity from the service storing their data. The identity is a public key; [PKARR](/explore/pubky-protocol/pkarr/introduction/) connects it to a [Homeserver](/explore/pubky-protocol/homeserver/), and applications access that data through the [SDK](/explore/pubky-protocol/sdk/).

This separation supports [credible exit](/explore/concepts/credible-exit/): changing providers while keeping an identity. Data availability and recovery still depend on the copies you maintain. See the [Security Model](/explore/pubky-protocol/security-model/) for the trust boundaries.

## Where to start

- **Build an app:** follow the [Developer Guide](/explore/pubky-protocol/getting-started/).
- **Understand app design:** explore [Pubky App Architectures](/explore/pubky-apps/app-architectures/introduction/).
- **Run a Homeserver:** use the upstream [Install Guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/INSTALL.md) and [Deployment Guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/DEPLOY.md).
- **Work on the protocol:** the [Pubky repository](https://github.com/pubky/pubky-homeserver) contains the Homeserver, SDKs, local testnet, and examples.
