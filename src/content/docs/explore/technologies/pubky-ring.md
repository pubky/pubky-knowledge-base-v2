---
title: "Pubky Ring"
---

# Identity Manager for Pubky

> **Your keychain for the Pubky ecosystem. Manage your pubkys, authorize services, and stay in control with no accounts or passwords.**

## Overview

Pubky Ring is the self-custodial key manager for the Pubky ecosystem. It is a native mobile app for iOS and Android that lets users create, import, organize, back up, and use their pubkys, the public keys that identify them across Pubky applications.

Ring keeps identity keys under the user's control. Apps request scoped capabilities, and Ring lets the user approve or reject those requests without creating hosted identity accounts.

## What Ring Does

- Creates and imports Pubky identities.
- Stores identity keys locally on the user's device.
- Approves app authorization requests and homeserver sessions.
- Lets users view and revoke app access.
- Supports backup and migration flows for moving keys between devices.

## How It Fits Pubky

In a standard Pubky auth flow, an application creates a `pubkyauth://` request, the user approves it in Ring, and Ring returns the encrypted auth response through [HTTP Relay](/explore/technologies/http-relay/) so the app can complete session setup with the [Homeserver](/explore/pubkycore/homeserver/).

Ring is responsible for identity custody and user approval. [Paykit](/explore/technologies/paykit/) and [Pubky Noise](/explore/technologies/pubky-noise/) define their own payment and encrypted-link protocol details.

## Maintained References

- **Repository and app details**: [github.com/pubky/pubky-ring](https://github.com/pubky/pubky-ring)
- **Development setup, input formats, and release verification**: [Pubky Ring README](https://github.com/pubky/pubky-ring/blob/main/README.md)
- **Release artifacts**: [GitHub Releases](https://github.com/pubky/pubky-ring/releases)
- **Pubky auth overview**: [Authentication](/explore/pubkycore/authentication/)
- **Auth relay transport**: [HTTP Relay](/explore/technologies/http-relay/)

**Pubky Ring is the self-custodial identity foundation for the Pubky ecosystem.**
