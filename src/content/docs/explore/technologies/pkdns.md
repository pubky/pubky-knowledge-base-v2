---
title: "PKDNS: Public-Key DNS Server"
---

PKDNS resolves [PKARR](/explore/pubky-protocol/pkarr/introduction/) public-key domains through DNS, allowing clients configured to use it to look up records published on the [Mainline DHT](/explore/technologies/mainline-dht/).

It bridges public-key naming and software that expects a conventional DNS resolver. This is useful when experimenting with PKARR-backed domains outside a Pubky app. Ordinary Pubky app development uses the [SDK](/explore/pubky-protocol/sdk/) for discovery and does not require changing your system's DNS settings.

See the [PKDNS README](https://github.com/pubky/pkdns/blob/master/README.md) for client setup, supported records, server configuration, and links to the deployment guides.

DNS over HTTPS protects the connection to the chosen resolver; that resolver still sees the queries. See the [DoH privacy considerations](https://datatracker.ietf.org/doc/html/rfc8484#section-8).
