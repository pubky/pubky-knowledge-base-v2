---
title: "Mainline DHT"
---

Pubky uses BitTorrent's Mainline distributed hash table through [PKARR](/explore/pubky-protocol/pkarr/introduction/) to discover where a public key's services are hosted. Application data lives on [Homeservers](/explore/pubky-protocol/homeserver/); the DHT holds the discovery records.

Discovery records require periodic republishing to remain available. The underlying storage protocol is specified in [BEP 44](https://www.bittorrent.org/beps/bep_0044.html). For the Rust implementation, usage, and operational limitations, see the [Mainline README](https://github.com/pubky/mainline/blob/main/README.md).
