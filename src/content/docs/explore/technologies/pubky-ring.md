---
title: "Pubky Ring"
---

Pubky Ring is the key manager and identity application for the Pubky ecosystem. It holds your identity keys and lets you approve access requests from apps.

An app requests permission to use your identity and access particular data on your [Homeserver](/explore/pubky-protocol/homeserver/). You review that request in Ring, which issues a grant for the approved access. This lets an app work with your data without receiving your identity's private key. See [authentication](/explore/pubky-protocol/authentication/) for how the app, Ring, and Homeserver fit together.

Visit the [Pubky Ring website](https://pubkyring.app/) for downloads.

## Protecting your identity

Keep a separate backup of your identity key using Ring's backup options. Identity recovery and [backing up published data](/explore/technologies/pubky-backup/) serve different purposes: recovering a key does not recover data lost by a Homeserver.

## For app developers

Use the [Pubky SDK](/explore/pubky-protocol/sdk/) to request app authorization. The [Ring Simulator](https://simulator.pubkyring.app/) is an experimental browser authenticator for local testnet development; the [Getting Started guide](/explore/pubky-protocol/getting-started/) shows it alongside a working app.

For Ring's development setup and implementation, see the [Pubky Ring README](https://github.com/pubky/pubky-ring/blob/main/README.md).
