---
title: "Pubky Nexus"
---

Pubky Nexus indexes public social data from [Homeservers](/explore/pubky-protocol/homeserver/) and exposes it through an API used by [pubky.app](/explore/pubky-apps/reference-app/pubky-app/) and compatible clients. It understands the [App Specs](/explore/pubky-apps/app-specs/) data model; it is an application service, not a requirement for every Pubky app.

## When Nexus is useful

Use Nexus when your app needs views across social records, such as feeds, search results, replies, or tags and follow relationships. It lets the client request an indexed result instead of locating and combining each record itself. The [semantic social graph](/explore/concepts/semantic-social-graph/) explains how these relationships support contextual views.

Applications publish changes to users' Homeservers. Nexus watches Homeserver event feeds, fetches relevant public records, and updates its indexes. Clients then query those indexes. The [pubky.app reference architecture](/explore/pubky-apps/reference-app/pubky-app/#reference-architecture) shows how this works alongside a browser's local cache.

Nexus does not write a user's posts on their behalf, and its index does not replace Homeserver storage. A missing API result can mean that the instance has not indexed the record; it does not by itself mean the original record is absent. Instance coverage and indexing delay matter when building a client.

## Using or running Nexus

Use the maintained upstream sources for implementation and operation:

- [Nexus README](https://github.com/pubky/pubky-nexus): architecture, setup, configuration, migrations, and testing.
- [API reference](https://nexus.pubky.app/swagger-ui/): endpoints and response schemas for the public instance.
- [Indexing coverage and Homeserver configuration](https://github.com/pubky/pubky-nexus/blob/main/docs/decentralization.md): how an instance selects Homeservers and users to index.
