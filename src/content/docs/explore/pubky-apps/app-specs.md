---
title: "App Specs"
---

Shared data model specifications for the Pubky social app ecosystem, with [pubky.app](/explore/pubky-apps/reference-app/pubky-app/) as the reference implementation.

## Overview

`pubky-app-specs` defines the canonical data schemas for social application data stored on Pubky [homeservers](/explore/pubky-protocol/homeserver/). It provides validation rules, serialization logic, and type definitions used by both *Pubky apps* and the [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) indexer to ensure interoperability with [pubky.app](/explore/pubky-apps/reference-app/pubky-app/). Note that this is *only* required for "Pubky Social apps": Pubky apps that read or write pubky.app social data, including profiles, posts and collections, follows, mutes, tags, bookmarks, and feeds. Pubky apps that do not rely on that social data should ignore `pubky-app-specs` and rely solely on their own application-specific schemas.

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

See the [`pubky-app-specs` README](https://github.com/pubky/pubky-app-specs) for the current schema reference, ID generation rules, validation constraints, and TypeScript/Rust APIs, including the [`PubkyAppPost` section](https://github.com/pubky/pubky-app-specs#pubkyapppost) for current post fields, kinds, attachments, and collection envelopes.

## Role in Ecosystem

```
Compatible apps ──write──> homeserver (/pub/pubky.app/...)
                                │
                                ▼ events
Pubky Nexus (indexer) ──reads──> indexes to Redis/Neo4j

Both use pubky-app-specs for schema validation
```
