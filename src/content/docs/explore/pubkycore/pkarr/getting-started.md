---
title: "Getting Started with PKARR"
---

This guide will help you understand how to publish and resolve resource records using [PKARR](/explore/pubkycore/pkarr/introduction/).

## Publishing Resource Records

To publish resource records for your key, you need to sign a small encoded [DNS](/explore/technologies/dns/) packet (<= 1000 bytes) and publish it on the DHT. This can be done through a relay if necessary.

## Resolving Resource Records

To resolve some key's resources, applications can query the [DHT](/explore/technologies/dht/) directly or through a relay. They will then verify the signature themselves.

## DNS Queries Over HTTPS

Existing applications unaware of [PKARR](/explore/pubkycore/pkarr/introduction/) can make normal [DNS](/explore/technologies/dns/) Queries over [HTTPS](/explore/technologies/https/) ([DoH](/explore/technologies/doh/)) to [PKARR](/explore/pubkycore/pkarr/introduction/) servers.

## Caching and Scalability

Clients and [PKARR](/explore/pubkycore/pkarr/introduction/) servers cache records extensively to minimize [DHT](/explore/technologies/dht/) traffic and improve scalability. The [DHT](/explore/technologies/dht/) drops records after a few hours, so it's important to republish records periodically.

## Next Steps

For more technical details on [PKARR](/explore/pubkycore/pkarr/introduction/)'s architecture and how it works, refer to the [architecture](/explore/pubkycore/pkarr/architecture/) note.
