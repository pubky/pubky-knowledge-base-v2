---
title: "introduction"
---

Homeservers store records under individual users' identities. A social feed needs to connect those records: which posts were written by people you follow, which replies belong to a conversation, or which resources carry a particular tag.

An application backend can collect public records from multiple [Homeservers](/explore/pubky-protocol/homeserver/) and make those queries available:

- **Aggregation** collects the records the service chooses to include.
- **Indexing** organizes those records for queries such as feeds and search.
- **An API** exposes the resulting views to clients.

These are responsibilities, not a required set of separate services. [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) implements them for pubky.app social data.

The resulting index is a derived view. It does not replace the original Homeserver records, and an instance only returns data within its indexing coverage and policies. Different services can build different views over the same published data.

See [App Architectures](/explore/pubky-apps/app-architectures/introduction/) to decide whether your application needs a backend.
