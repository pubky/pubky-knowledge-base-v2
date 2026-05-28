---
title: "posts"
---

In pubky.app, a **post** is content that a user publishes under `/pub/pubky.app/posts/:post_id` on their homeserver. Posts are defined by [pubky-app-specs](/explore/pubky-apps/app-specs/) and indexed by [Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) for feeds, replies, search, tags, and notifications.

## Post Types

`pubky-app-specs` is the canonical source for post kinds, fields, limits, and validation rules. See the [`PubkyAppPost` section of the `pubky-app-specs` README](https://github.com/pubky/pubky-app-specs#pubkyapppost).

Posts can also participate in social interactions:

1. **Replies**: A post can reference a parent post URI.
2. **Reposts/embeds**: A post can embed another post or resource by kind and URI.
3. **[Tags](/explore/pubky-apps/reference-app/features/tags/)**: Any user can tag a post to make it discoverable by topic or meaning.
4. **Mentions and links**: Clients can render user references and external URLs from post content.
