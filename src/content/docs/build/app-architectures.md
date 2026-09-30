---
title: "App Architectures"
---

Pubky applications use the [Pubky protocol](/overview/) for identity and data storage. Users publish records to their Homeservers; apps choose how to read them according to the queries they need. Writing a user's records still goes through their Homeserver, whichever read approach the app uses.

Apps can define their own schemas and backends, or reuse [pubky.app](/social-data/pubky-app/)'s profiles, posts, tags, and relationships through [pubky-app-specs](/social-data/pubky-app-specs/) without recreating its social interface.

| Approach | When it helps | What the application needs to handle |
| --- | --- | --- |
| Client to Homeserver | The app knows which users and paths it needs, such as a personal bookmark tool. | Fetching and presenting those records through the [SDK](/build/sdk/). |
| Custom backend | The app needs search, feeds, or relationships across many users. | Collecting relevant records, maintaining indexes, and serving queries. |
| Shared aggregator | Several clients need the same indexed data. | Choosing a service whose coverage and filtering policies suit the app. |

<span id="building-an-app"></span>

## Choosing a starting point

Direct access is enough for the [Developer Guide](/build/developer-guide/): the app writes a record and knows where to read it. A feed across many users needs more work. Fetching every user's records in the browser can become expensive, and the client still needs to discover which records matter.

An [indexing service](/social-data/indexing-and-aggregation/) can collect those records once and serve queries to many clients. [Pubky Nexus](/social-data/pubky-nexus/) supplies this for the shared social data model. If your app uses different data or needs different queries, a custom backend can index just what it needs.

These approaches can be combined. An app might read a known file directly from a Homeserver and use an indexer to find related content. It can also keep a local cache for responsive browsing, as the [pubky.app reference architecture](/social-data/pubky-app/#reference-architecture) demonstrates.

An indexer's results reflect its coverage and policies, and updates take time to reach its indexes. Decide whether that suits each screen in your app, particularly immediately after a user publishes a change.
