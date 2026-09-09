---
title: "Semantic Social Graph"
---

A semantic social graph goes beyond simple follow/friend connections. Every link between users and content is stored as a labeled edge, so the graph preserves not just *that* two things are connected but *how*.

### How It Works in Pubky

Pubky users produce labeled edges through ordinary activity: following a peer, tagging a post, bookmarking a link, publishing a reply or repost, organizing posts into a collection. Labels on tags add explicit context, while the edge type preserves what action connected two nodes.

Nexus indexes this data and lets clients query it along social and semantic dimensions. Posts can be retrieved by follow network, by tag, by content kind, or sorted by time. Web-of-trust views traverse follows up to three hops deep, and tag-based views narrow results further. For example, showing only authors tagged `rust-dev` by the observer or by peers in their follow network.

These building blocks let clients construct contextual views without a universal feed algorithm. One view might show a `rust-dev` domain feed from trusted connections, another a chronological stream from direct follows.

![Diagram showing semantic social graph with tagged relationships, weighted connections, and user-centric personalization](/images/mermaid_charts/semantic_social_graph.svg)

### Beyond Social: A Substrate for Intelligence

A semantic social graph isn't only useful for people. Because it accumulates contextual meaning from ordinary activity, it becomes a rich layer that AI can operate over. It can surface connections between peers and topics, identify recurring community structures, or recommend content paths that no single user would have mapped out.

For a deeper exploration of this idea, see [Social Intelligence Is Not Artificial](https://pubky.app/post/gujx6qd8ksydh1makdphd3bxu351d9b8waqka8hfg6q7hnqkxexo/0035MMN9XV790) (blog post).
