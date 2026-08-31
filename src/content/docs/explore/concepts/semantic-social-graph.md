---
title: "Semantic Social Graph"
---

A semantic social graph goes beyond simple follow/friend connections. Every relationship between users and content carries contextual meaning that captures *why* things are related, not just *that* they are. 

Social activity produces this meaning naturally. When you interact with content or peers, each action signals what matters to you and why, resulting in a graph that is context-aware rather than just structural.

### How It Works in Pubky

Users can tag posts, files, links, and peers with meaningful labels, organize content into collections, reply, quote, and recommend. These actions build up a personal graph of weighted relationships that you can query and filter however you choose.

For example, if you tag a peer as "rust-dev" and bookmark their posts about async patterns, content from peers they interact with on similar topics can surface in your view. You control how content is weighted, how many degrees of connection to explore, and which signals matter.

Because the graph is yours to query, you can configure multiple lenses into it each producing a different feed tailored to a specific topic or need. One lens might focus on Rust ecosystem updates from trusted developers, another on broader industry trends from a wider circle.

Because there is no central algorithm deciding what is relevant, each user's graph reflects their own interests and context. The result is a network where relevance is personal rather than popularity-driven.

![Diagram showing semantic social graph with tagged relationships, weighted connections, and user-centric personalization](/images/mermaid_charts/semantic_social_graph.svg)

### Beyond Social: A Substrate for Intelligence

A semantic social graph isn't only useful for people. Because it accumulates contextual meaning from ordinary activity, it becomes a rich layer that AI can operate over. It can surface connections between peers and topics, identify recurring community structures, or recommend content paths that no single user would have mapped out.

For a deeper exploration of this idea, see [Social Intelligence Is Not Artificial](https://pubky.app/post/gujx6qd8ksydh1makdphd3bxu351d9b8waqka8hfg6q7hnqkxexo/0035MMN9XV790) (blog post).
