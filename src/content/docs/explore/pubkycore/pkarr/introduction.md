---
title: "introduction"
---

## Public-Key Addressable Resource Records

[PKARR](https://github.com/pubky/pkarr) is a revolutionary system that bridges the gap between the Domain Name System ([DNS](/explore/technologies/dns/)) and peer-to-peer overlay networks. It allows self-issued public keys to function as sovereign, publicly addressable domains. This means that anyone with a private key can have a domain that is accessible to everyone.

The core idea is to streamline the process of publishing and resolving resource records for keys, leveraging the Distributed Hash Table ([DHT](/explore/technologies/dht/)) for efficient and scalable data distribution.

## Key Features

- **Simplicity**: PKARR streamlines the integration between [DNS](/explore/technologies/dns/) and peer-to-peer networks.
- **Sovereignty**: Public keys can be used as domains, enabling users to maintain control over their digital identities.
- **Accessibility**: The system is designed to be accessible to anyone capable of maintaining a private key. [Pubky Ring](/explore/technologies/pubky-ring/) provides a user-friendly mobile app for managing these keys securely.
- **Scalability and Resilience**: Designed with scalability and resilience in mind, using the [Mainline DHT](/explore/technologies/mainline-dht/) for storing ephemeral data, and employing caching strategies to minimize [DHT](/explore/technologies/dht/) traffic.
- **Compatibility with Existing Applications**: Supports existing applications through [DNS](/explore/technologies/dns/) over [HTTPS](/explore/technologies/https/) ([DoH](/explore/technologies/doh/)) queries to PKARR servers, ensuring broad compatibility.

## How It Works

1. **Publishing Records**: To publish resource records for a key, create a small encoded [DNS](/explore/technologies/dns/) packet (<= 1000 bytes), sign it, and publish it on the DHT. This can be done directly or through a relay if necessary.
2. **Resolving Records**: To find resources associated with a key, applications can query the [DHT](/explore/technologies/dht/) directly or through a relay, verifying the signature themselves.
3. **Fallback for Existing Applications**: Applications unaware of PKARR can make normal [DNS](/explore/technologies/dns/) Queries over [HTTPS](/explore/technologies/https/) (DoH) to PKARR servers, ensuring accessibility.
4. **Caching and Republishing**: Both clients and PKARR servers cache records extensively to improve scalability. The [DHT](/explore/technologies/dht/) drops records after a few hours, necessitating periodic republishing to keep records alive.

For more technical details on PKARR's architecture and how it works, refer to the [architecture](/explore/pubkycore/pkarr/architecture/) note.

## Getting Started

[To start using PKARR](2.Getting%20Started%20with%20Pkarr.md), you can visit the [web app demo](https://pkdns.net) or explore the Rust examples provided in [PKARR repository](https://github.com/pubky/pkarr).

To access public-key domains from your browser, use [PKDNS](/explore/technologies/pkdns/), a DNS server that resolves PKARR records. You can use public [PKDNS](/explore/technologies/pkdns/) instances or run your own server—see the [PKDNS](/explore/technologies/pkdns/) documentation for setup instructions.
