---
title: "Pubky Nexus"
---

[Pubky Nexus](https://github.com/pubky/pubky-nexus) indexes public social data from [Homeservers](/homeserver/) using the [pubky-app-specs](/pubky-app-specs/) data model and serves it through an API for [pubky.app](/pubky-app/) and compatible clients. It is an application service, not a requirement for every Pubky app.

## When Nexus is useful

Use Nexus when your app needs views across social records, such as feeds, search results, replies, or tags and follow relationships. It lets the client request an indexed result instead of locating and combining each record itself. The [semantic social graph](/semantic-social-graph/) explains how these relationships support contextual views.

Applications publish changes to users' Homeservers. Nexus watches Homeserver event feeds, fetches relevant public records, and updates its indexes. Clients then query those indexes. The [pubky.app reference architecture](/pubky-app/#reference-architecture) shows how this works alongside a browser's local cache.

Nexus does not write a user's posts on their behalf, and its index does not replace Homeserver storage. A missing API result can mean that the instance has not indexed the record; it does not by itself mean the original record is absent. Instance coverage and indexing delay matter when building a client.

## Using or running Nexus

For implementation and operation, see:

- [Nexus README](https://github.com/pubky/pubky-nexus): architecture, setup, configuration, migrations, and testing.
- [API reference](https://nexus.pubky.app/swagger-ui/): endpoints and response schemas for the public instance.
- [Indexing coverage and Homeserver configuration](https://github.com/pubky/pubky-nexus/blob/main/docs/decentralization.md): how an instance selects Homeservers and users to index.
