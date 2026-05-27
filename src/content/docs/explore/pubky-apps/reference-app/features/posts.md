---
title: "posts"
---

In pubky.app, a **post** is content that a user publishes under `/pub/pubky.app/posts/:post_id` on their homeserver. Posts are defined by [pubky-app-specs](/explore/pubky-apps/app-specs/) and indexed by [Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) for feeds, replies, search, tags, and notifications.

## Post Types

`pubky-app-specs` defines these post kinds:

1. **Short text**: Plain text content up to 2,000 Unicode scalar values.
2. **Long text**: Long-form content up to 50,000 Unicode scalar values.
3. **Image, video, link, and file posts**: Posts that use the regular post fields plus optional attachments.
4. **Collection posts**: Ordered lists of existing Pubky App post URIs.

Posts can also participate in social interactions:

1. **Replies**: A post can reference a parent post URI.
2. **Reposts/embeds**: A post can embed another post or resource by kind and URI.
3. **Attachments**: Non-Collection posts can attach up to 4 `pubky`, `http`, or `https` URLs.
4. **[Tags](/explore/pubky-apps/reference-app/features/tags/)**: Any user can tag a post to make it discoverable by topic or meaning.
5. **Mentions and links**: Clients can render user references and external URLs from post content.

## Collections

A Collection post has `kind = "collection"` and stores a JSON envelope in `content`:

```json
{
  "name": "Reading list",
  "description": "Posts to revisit",
  "items": [
    "pubky://operrr8wsbpr3ue9d4qj41ge1kcc6r7fdiy6o3ugjrrhi4y77rdo/pub/pubky.app/posts/0034A0X7NJ52A"
  ]
}
```

Collection items must be canonical Pubky App post URIs. Collection posts cannot have a parent, embed, or regular `post.attachments`; the curated post URIs belong in the envelope's `items` list.
