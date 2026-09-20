---
title: "App Specs"
---

Shared data model specifications for the Pubky social app ecosystem, with [pubky.app](/explore/pubky-apps/reference-app/pubky-app/) as the reference implementation.

## Overview

`pubky-app-specs` defines the canonical data schemas for social application data stored on Pubky [homeservers](/explore/pubky-protocol/homeserver/). It provides validation rules, serialization logic, and type definitions used by both *Pubky apps* and the [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) indexer to ensure interoperability with [pubky.app](/explore/pubky-apps/reference-app/pubky-app/). Note that this is *only* required for "Pubky Social apps": Pubky apps that read or write pubky.app social data, including profiles, posts and collections, follows, mutes, tags, bookmarks, and feeds. Pubky apps that do not rely on that social data should ignore `pubky-app-specs` and rely solely on their own application-specific schemas.

## Reusing social data

A third-party app can read compatible records directly from Homeservers through the [Pubky SDK](/explore/pubky-protocol/sdk/), or query Nexus for indexed views across users. For example, a reading app could display a user's profile and the articles shared by people they follow. The profile and follow relationships do not need to be recreated in a separate account system.

To contribute compatible data, an app publishes records to the user's Homeserver with the user's authorization. Shared schemas let other clients interpret those records; each client can choose its own presentation and features. Using the schemas does not mean every client or indexer supports every record type or includes every user.

## Universal Tags

Tags add attributed labels to existing resources. The tag belongs to the person applying it and is stored on their Homeserver, separately from the resource it describes. This lets people enrich someone else's content without editing it.

Universal Tags extend that approach beyond pubky.app profiles and posts to resources identified by URIs. A reading app could tag an article `tutorial`; another app could use those annotations to help readers discover it. Nexus indexes supported Universal Tag records and exposes resource queries through its [API reference](https://nexus.pubky.app/swagger-ui/).

Tags and relationships together form the [semantic social graph](/explore/concepts/semantic-social-graph/). Third-party apps can use this metadata as well as the underlying content.

## Maintained specifications and libraries

- [Data model specification](https://github.com/pubky/pubky-app-specs/blob/main/SPEC.md): schemas, paths, and validation rules.
- [Library README](https://github.com/pubky/pubky-app-specs): Rust usage and links to the API reference.
- [JavaScript and TypeScript guide](https://github.com/pubky/pubky-app-specs/blob/main/pkg/README.md): npm package usage.
