---
title: "Introduction"
---

Pubky applications choose how to read data according to the queries they need. Homeservers provide storage; application backends can build views across that data. Writing a user's records still goes through their Homeserver, whichever read approach the app uses.

| Approach | When it helps | What the application needs to handle |
| --- | --- | --- |
| Client to Homeserver | The app knows which users and paths it needs, such as a personal bookmark tool. | Fetching and presenting those records through the [SDK](/explore/pubky-protocol/sdk/). |
| Custom backend | The app needs search, feeds, or relationships across many users. | Collecting relevant records, maintaining indexes, and serving queries. |
| Shared aggregator | Several clients need the same indexed data. | Choosing a service whose coverage and filtering policies suit the app. |

## Choosing a starting point

Direct access is enough for the [Getting Started](/explore/pubky-protocol/getting-started/) walkthrough: the app writes a record and knows where to read it. A feed across many users needs more work. Fetching every user's records in the browser can become expensive, and the client still needs to discover which records matter.

An [indexing service](/explore/pubky-apps/indexing-and-aggregation/introduction/) can collect those records once and serve queries to many clients. [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) supplies this for the shared social data model. If your app uses different data or needs different queries, a custom backend can index just what it needs.

These approaches can be combined. An app might read a known file directly from a Homeserver and use an indexer to find related content. It can also keep a local cache for responsive browsing, as the [pubky.app reference architecture](/explore/pubky-apps/reference-app/pubky-app/#reference-architecture) demonstrates.

An indexer's results reflect its coverage and policies, and updates take time to reach its indexes. Decide whether that suits each screen in your app, particularly immediately after a user publishes a change.
