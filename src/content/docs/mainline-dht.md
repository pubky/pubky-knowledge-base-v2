---
title: "Mainline DHT"
---

Pubky uses BitTorrent's Mainline distributed hash table through [PKARR](/pkarr/) to discover where a public key's services are hosted. Application data lives on [Homeservers](/homeserver/); the DHT holds the discovery records.

Discovery records require periodic republishing to remain available. The underlying storage protocol is specified in [BEP 44](https://www.bittorrent.org/beps/bep_0044.html). For the Rust implementation, usage, and operational limitations, see the [Mainline README](https://github.com/pubky/mainline/blob/main/README.md).

## Cloud network reachability

Direct DHT access has shown low reachability on some AWS and GCP deployments: lookups can miss records and publication can reach too few peers, even when joining the network succeeds. The [reported failures](https://github.com/pubky/mainline/issues/56) and [reachability investigation](https://github.com/pubky/mainline/issues/104) have not established a single cause.

PKARR relays can provide a path through another network, provided the relay itself has working DHT connectivity. Relay clients can also encounter [timeouts during uncached lookups](https://github.com/pubky/pkarr/issues/240). See the [PKARR backend configuration guide](https://github.com/pubky/pkarr/blob/main/docs/integration.md#backend-configuration) for choosing direct DHT access, relays, or both.
