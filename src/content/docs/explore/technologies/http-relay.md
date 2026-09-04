---
title: "HTTP Relay"
---

HTTP relay service for forwarding encrypted grants during Pubky [authentication](/explore/pubky-protocol/authentication/) flows.

- **GitHub**: [`pubky/http-relay`](https://github.com/pubky/http-relay)
- **Crate**: [`http-relay`](https://crates.io/crates/http-relay)
- **Releases**: [GitHub Releases](https://github.com/pubky/http-relay/releases)
- **Default endpoint**: `https://httprelay.pubky.app/inbox`
- **License**: MIT
- **Language**: Rust

## Why a Relay?

In the Pubky Auth flow, a third-party app needs to receive a grant from the user's authenticator ([Pubky Ring](/explore/technologies/pubky-ring/)). The challenge:
- The app may be a web page with no backend
- The authenticator is a mobile app
- They need to exchange data without direct connectivity

The relay solves this by providing a temporary rendezvous point where encrypted grants can be deposited and retrieved.

## How It Works

The relay uses the `/inbox` endpoint:

1. **App generates a relay secret and PoP key** and starts long-polling the relay inbox channel
2. **App shows a QR code** containing the relay details, client ID, capabilities, and PoP public key
3. **Ring scans the QR code**, signs the grant, and encrypts it with the relay secret
4. **Ring POSTs** the encrypted grant to the relay inbox
5. **App retrieves** the message via long-poll GET, decrypts it, and acknowledges via DELETE

The `/inbox` endpoint persists messages server-side for up to 5 minutes. The producer can verify delivery via `/ack` and `/await` sub-endpoints.

The relay only ever sees encrypted blobs — it cannot read the grant.

SDK clients can resume an in-progress grant flow only if they save both the relay state and the matching PoP key. Delete saved flow state once the flow completes or is abandoned.

See [Authentication](/explore/pubky-protocol/authentication/) for a conceptual overview. For implementation details, use the [Rust](https://docs.rs/pubky) or [JavaScript/TypeScript](https://pubky.github.io/pubky-homeserver/js-sdk-typedoc/) SDK reference.

## Self-Hosting

The relay is designed to be self-hostable for reduced latency, privacy, and reliability. Use the [`pubky-http-relay`](https://github.com/pubky/pubky-http-relay) crate as a dependency in your Rust project.

Apps can specify a custom relay URL via the [SDK](/explore/pubky-protocol/sdk/).
