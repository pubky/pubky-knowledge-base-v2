---
title: "Semantic Social Graph"
---

A semantic social graph goes beyond simple follow/friend connections. Every link between users and content is stored as a labeled edge, so the graph preserves not just *that* two things are connected but *how*.

### How It Works in Pubky

Pubky users produce labeled edges through ordinary activity: following a peer, tagging a post, bookmarking a link, publishing a reply or repost, organizing posts into a collection. Labels on tags add explicit context, while the edge type preserves what action connected two nodes.

[Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) indexes this data and lets clients query it along social and semantic dimensions. Posts can be retrieved by follow network, by tag, by content kind, or sorted by time. Web-of-trust views use follow relationships to select whose activity informs a view, and tag-based views narrow results further. For example, showing only authors tagged `rust-dev` by the observer or by peers in their follow network.

These building blocks let clients construct contextual views without a universal feed algorithm. One view might show a `rust-dev` domain feed from trusted connections, another a chronological stream from direct follows. Here, a web of trust describes a chosen social scope; following someone does not establish that their claims or labels are correct.

### Shared Context Across Apps

The [App Specs](/explore/pubky-apps/app-specs/) define the shared records behind this graph. Relationships and tags enrich existing content with metadata that other applications can interpret. Because a tag is attributed to its author, clients can distinguish the resource itself from what different people say about it.

For example, a reader can label someone else's article `tutorial` without changing the article. A third-party learning app could use those annotations to organize reading material while a social client shows the same resource in a conversation. [Universal Tags](/explore/pubky-apps/app-specs/#universal-tags) extend this pattern to resources beyond pubky.app profiles and posts.

Applications can read the shared records from Homeservers or use Nexus's indexed views. The [Nexus API reference](https://nexus.pubky.app/swagger-ui/) documents which filters are supported for each query; web-of-trust filtering is not available on every endpoint.

For a deeper exploration of this idea, see [Social Intelligence Is Not Artificial](https://pubky.app/post/gujx6qd8ksydh1makdphd3bxu351d9b8waqka8hfg6q7hnqkxexo/0035MMN9XV790) (blog post).
