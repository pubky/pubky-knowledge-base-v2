---
title: "Introduction"
---

Pubky apps use the [Pubky protocol](/explore/pubky-protocol/introduction/) for identity and data storage. Users publish data to their Homeservers, while applications provide ways to create, read, and interact with it. An app can work directly with Homeservers or use a backend for queries across many users' data.

[pubky.app](/explore/pubky-apps/reference-app/pubky-app/) is the reference social application. Its profiles, posts, tags, and relationships are also available to other applications that understand the shared social data model. An app can build on that data without reproducing the whole social interface.

## Building an app

- Start with [Getting Started](/explore/pubky-protocol/getting-started/) to read and write your first Homeserver record.
- Choose an [app architecture](/explore/pubky-apps/app-architectures/introduction/) according to the data and queries your app needs.
- Use [App Specs](/explore/pubky-apps/app-specs/) when working with pubky.app social data, and [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) when its indexed views are useful.

Apps with other purposes can define their own schemas and backends. Using the Pubky protocol does not require adopting the social data model.
