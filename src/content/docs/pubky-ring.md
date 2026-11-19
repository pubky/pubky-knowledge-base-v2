---
title: "Pubky Ring"
description: "Use Pubky Ring to manage and back up your Pubky identity, and approve or revoke app access."
---

Pubky Ring is the key manager and identity application for the Pubky ecosystem. It holds your identity keys and lets you approve access requests from apps.

An app requests permission to use your identity and access particular data on your [Homeserver](/homeserver/). You review that request in Ring, which issues a grant for the approved access. This lets an app work with your data without receiving your identity's private key. See [authentication](/authentication/) for how the app, Ring, and Homeserver fit together.

Visit the [Pubky Ring website](https://pubkyring.app/) for installs.

## Manage app access

Open your identity in Ring and select **Authorized Apps** to see its grants. Select a grant to review its permissions and expiration. To end access through that grant, choose **Revoke app access** and confirm with **Revoke**.

## Protecting your identity

Keep a separate backup of your identity key using Ring's backup options. Use [Pubky Backup](/pubky-backup/) to keep a copy of your Homeserver files.

## Use your identity with Bitkit

When setting up your Pubky profile in [Bitkit](https://bitkit.to/), you can choose an identity you already manage in Ring on the same device.

## Refresh Homeserver discovery

If apps are having trouble finding your Homeserver, go to **Settings** → **Republish records** and select **Republish all**. Ring refreshes the [PKARR records](/pkarr/) that point apps to the current Homeservers for your Ring-managed identities.

## For app developers

Use the [Pubky SDK](/sdk/) to request app authorization. The [Ring Simulator](https://simulator.pubkyring.app/) is an experimental browser authenticator for local testnet development; the [Developer Guide](/developer-guide/) shows it alongside a working app.

For Ring's development setup and implementation, see the [Pubky Ring README](https://github.com/pubky/pubky-ring/blob/main/README.md).
