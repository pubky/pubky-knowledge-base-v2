---
title: "introduction"
---

The Backend is responsible for collecting ([aggregators](/explore/pubky-apps/indexing-and-aggregation/aggregator/)) and organizing ([indexer](/explore/pubky-apps/indexing-and-aggregation/indexer/)) data from various sources, known as [Homeservers](/explore/pubkycore/homeserver/).

![Pubky App backend architecture showing aggregators collecting data from Homeservers, indexers normalizing data, and web servers providing API access](/images/pubky-backend.png)

Imagine you're trying to find a specific document in a large library. The backend is like a librarian who searches through the shelves, finds the right documents, and prepares them for you to use. This ensures that the data is accurate, up-to-date, and in a format that's easy to work with.

### Main components

- [Aggregators](/explore/pubky-apps/indexing-and-aggregation/aggregator/) execute a **data retrieval protocol** to obtain data from **data storage**, initiating a process that retrieves and collects data from various sources.
- [Indexers](/explore/pubky-apps/indexing-and-aggregation/indexer/) receive aggregated data from the **Aggregators** and initiate a rigorous **data normalization** process, transforming and converting the data into a standardized format to ensure consistency and accuracy.
- [Web servers](/explore/pubky-apps/indexing-and-aggregation/web-server/) provide the requested data to [Pubky client](/explore/pubky-apps/reference-app/introduction/)

### Production Implementation

[Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) is the production-grade implementation of this backend architecture, powering [Pubky App](/explore/pubky-apps/introduction/)'s social features with real-time aggregation, high-performance indexing, and a comprehensive REST API.
