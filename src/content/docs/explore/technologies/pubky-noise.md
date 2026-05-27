---
title: "Pubky Noise"
---

**Encrypted Pubky Homeserver Communication**

> **Note:** Pubky Noise is under active development and is **not production-ready**. Use the maintained upstream README and crate docs for current implementation details.

## Overview

Pubky Noise is a Rust library for encrypted peer-to-peer communication over [Pubky Homeservers](/explore/pubkycore/homeserver/) using the [Noise Protocol Framework](https://noiseprotocol.org/).

Instead of requiring a direct socket between peers, Pubky Noise uses Pubky Homeservers as an encrypted message transport. Each peer writes encrypted handshake or application messages to their own Homeserver, and the counterparty reads them from there.

This makes private application protocols possible on top of Pubky's existing identity, storage, and discovery layers.

## How It Fits Pubky

- Pubky identities name the peers.
- Homeservers carry encrypted messages without seeing plaintext contents.
- Higher-level protocols define their own message schemas and private coordination flows.
- Pubky Noise sits above Pubky Core; it is not part of the core storage or authentication API.

## Current Uses

[Paykit](/explore/technologies/paykit/) uses Pubky Noise links for private payment coordination. Other private messaging, file-transfer coordination, or application-specific encrypted flows may build on it once the protocol stabilizes.

## Maintained References

- **Repository and implementation details**: [github.com/pubky/pubky-noise](https://github.com/pubky/pubky-noise)
- **Crate**: [crates.io/crates/pubky-noise](https://crates.io/crates/pubky-noise)
- **Noise Protocol Framework**: [noiseprotocol.org](https://noiseprotocol.org/)
- **Paykit**: [private payment coordination](/explore/technologies/paykit/)
- **Homeserver**: [storage layer used for encrypted message transport](/explore/pubkycore/homeserver/)

**Important:** Do not use Pubky Noise in production applications yet. The implementation is a work in progress and subject to security review and breaking changes.
