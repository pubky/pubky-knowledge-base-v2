---
title: "App Specs"
---

Shared data model specifications for the Pubky social app ecosystem, with [pubky.app](/explore/pubky-apps/reference-app/pubky-app/) as the reference implementation.

> **Note:** This component is NOT part of Pubky Core. It is part of the Pubky social app stack.

## Overview

`pubky-app-specs` defines the canonical data schemas for social application data stored on Pubky [homeservers](/explore/pubkycore/homeserver/). It provides validation rules, serialization logic, and type definitions used by both *Pubky apps* and the [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) indexer to ensure interoperability with [pubky.app](/explore/pubky-apps/reference-app/pubky-app/). Note that this is *only* required for "Pubky Social apps": Pubky apps that read or write pubky.app social data, including profiles, posts and collections, follows, mutes, tags, bookmarks, and feeds. Pubky apps that do not rely on that social data should ignore `pubky-app-specs` and rely solely on their own application-specific schemas.

- **Repository**: https://github.com/pubky/pubky-app-specs
- **License**: MIT
- **Platforms**: Rust (native), WASM, JavaScript (npm: `pubky-app-specs`)

## Data Models

All data is stored under `/pub/pubky.app/` on the user's homeserver. Key models include:

- **PubkyAppUser** - User profile (name, bio, image, links, status)
- **PubkyAppPost** - Posts with content, kind, parent, embed, attachments, and Collection envelopes
- **PubkyAppBlob** - Raw uploaded bytes addressed by a content hash
- **PubkyAppFile** - File metadata (name, src, content_type, size)
- **PubkyAppTag** - Tags on URIs (label + target)
- **PubkyAppBookmark** - Bookmarked URIs
- **PubkyAppFollow / PubkyAppMute** - Social relationships
- **PubkyAppFeed** - Saved feed configuration
- **PubkyAppLastRead** - Notification/read-state marker

See the [repository](https://github.com/pubky/pubky-app-specs) for the full schema reference, ID generation rules, validation constraints, and TypeScript/Rust APIs.

## Compatibility Contract

Compatible clients and indexers should treat these rules as the social schema contract:

- **Collection posts**: `kind = "collection"` represents ordered lists of Pubky App post URIs under a name and optional description.
- **Typed Collection envelope**: Collection posts store JSON in `post.content` with `name`, optional `description`, and `items`. `parent`, `embed`, and `post.attachments` must be unset for Collection posts.
- **Canonical Collection items**: Every Collection item must be a canonical Pubky App post URI: `pubky://<pubky-id>/pub/pubky.app/posts/<post-id>`.
- **Post kind validation**: Unknown post kinds fail validation.
- **Validation limits**: The package exports canonical validation limits for clients, including post lengths, attachment limits, tag constraints, profile limits, file/blob size, and Collection limits.
- **Validation failures**: Invalid URLs, invalid IDs, empty blobs/files, over-limit fields, feed tags, and tag labels fail validation.
- **JS/WASM helpers**: The npm package exposes helpers such as `createCollectionPost()`, `getValidationLimits()`, `validationLimits`, `getValidMimeTypes()`, URI builders, and URI parsing helpers.

## Post Kinds

`PubkyAppPost.kind` is one of:

- `short` - Short text content, up to 2,000 Unicode scalar values
- `long` - Long-form text content, up to 50,000 Unicode scalar values
- `image` - Image-oriented post, using attachments for file URIs
- `video` - Video-oriented post, using attachments for file URIs
- `link` - Link-oriented post
- `file` - File-oriented post
- `collection` - Ordered list of Pubky App post URIs stored in a JSON envelope

For non-Collection posts, attachments are limited to 4 URLs, each up to 200 characters, using `pubky`, `http`, or `https`.

### Collection Posts

Collection posts curate existing Pubky App posts. Their `content` field is a JSON string with this envelope:

```json
{
  "name": "AI papers",
  "description": "Best stuff",
  "items": [
    "pubky://operrr8wsbpr3ue9d4qj41ge1kcc6r7fdiy6o3ugjrrhi4y77rdo/pub/pubky.app/posts/0034A0X7NJ52A",
    "pubky://operrr8wsbpr3ue9d4qj41ge1kcc6r7fdiy6o3ugjrrhi4y77rdo/pub/pubky.app/posts/0034A0X7QK8M9"
  ]
}
```

Collection validation rules:

- `name` is required, must contain non-whitespace characters, and must be 1-100 Unicode scalar values.
- `description` is optional and may be up to 500 Unicode scalar values.
- `items` is ordered, defaults to an empty list if omitted, and may contain up to 100 entries.
- Each item must be exactly a Pubky App post URI with a 52-character Pubky ID and a 13-character Crockford post ID.
- The full Collection envelope is limited to 40,000 Unicode scalar values.
- `parent`, `embed`, and non-empty `post.attachments` are rejected for Collection posts.

## Validation Limits

The package exposes a canonical validation-limits bundle so apps can keep UI validation aligned with indexer validation. Character limits are counted with Rust `chars().count()`, not byte length. Important limits include:

| Area | Limit |
| ---- | ----- |
| Blob/file size | Greater than 0 bytes and up to 104,857,600 bytes (100 MB in the spec) |
| User name | 3-50 characters |
| Bio | 160 characters |
| Profile image URL | 300 characters |
| Profile links | 5 links, with title up to 100 characters and URL up to 300 characters |
| Status | 50 characters |
| Short/image/video/link/file post content | 2,000 characters |
| Long post content | 50,000 characters |
| Post attachments | 4 URLs, each up to 200 characters |
| Tag label | 1-20 characters; no comma, colon, or whitespace |
| Feed tags | 5 tags |
| Collection content | 40,000 characters |
| Collection name | 1-100 characters |
| Collection description | 500 characters |
| Collection items | 100 canonical Pubky App post URIs |

## Role in Ecosystem

```
Compatible apps ──write──> homeserver (/pub/pubky.app/...)
                                │
                                ▼ events
Pubky Nexus (indexer) ──reads──> indexes to Redis/Neo4j

Both use pubky-app-specs for schema validation
```
