---
title: "pubky-app-specs"
---

Shared data model specifications for the Pubky social app ecosystem, with [pubky.app](/explore/pubky-apps/reference-app/pubky-app/) as the reference implementation.

## Overview

`pubky-app-specs` defines the canonical data schemas for social application data stored on Pubky [homeservers](/explore/pubky-protocol/homeserver/). It provides validation rules, serialization logic, and type definitions used by both *Pubky apps* and the [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) indexer to ensure interoperability with [pubky.app](/explore/pubky-apps/reference-app/pubky-app/). Note that this is *only* required for "Pubky Social apps": Pubky apps that read or write pubky.app social data, including profiles, posts and collections, follows, mutes, tags, bookmarks, and feeds. Pubky apps that do not rely on that social data should ignore `pubky-app-specs` and rely solely on their own application-specific schemas.

## Reusing social data

A third-party app can read compatible records directly from Homeservers through the [Pubky SDK](/explore/pubky-protocol/sdk/), or query Nexus for indexed views across users. For example, a reading app could display a user's profile and the articles shared by people they follow. The profile and follow relationships do not need to be recreated in a separate account system.

To contribute compatible data, an app publishes records to the user's Homeserver with the user's authorization. Shared schemas let other clients interpret those records; each client can choose its own presentation and features. Using the schemas does not mean every client or indexer supports every record type or includes every user.

## Universal Tags

A Universal Tag expresses a named relation from a user to a resource. For example, Alice tags an article `tutorial`:

| Part | Meaning | Example |
| --- | --- | --- |
| Subject | Who applied the tag | Alice's Pubky identity |
| Relation | The tag's label | `tutorial` |
| Object | The resource being tagged | The article's URI |

The tag is part of Alice's data on her Homeserver, stored separately from the article. She can add context to someone else's resource without editing it. Universal Tags extend this pattern beyond pubky.app profiles and posts to other resources identified by URIs.

### Reusing annotations across apps

Tags provide shared context that applications can reuse. Alice might label an article `tutorial` through a reading app. A learning app could use that annotation to organize reading material, while a social client presents the same article in a conversation. Each app can build its own experience using the shared annotation.

Authorship lets applications choose whose annotations to include. A label expresses its author's assessment; different people can describe the same resource differently.

### Discovering resources and people

Applications can explore these relations in either direction:

- **From a person to resources:** find the articles Alice tagged `tutorial` to build a reading list.
- **From a resource to people:** find who tagged an article `tutorial` to discover readers with similar interests.

The second direction can introduce people previously unknown to the app, including people using another app or Homeserver. Starting with an article, a reading app could discover Alice through her tag, then explore her other public annotations to find more resources or offer readers a way to connect with her.

These connections contribute to the [semantic social graph](/explore/concepts/semantic-social-graph/): the resource, the label, and the person applying it can all be useful starting points for discovery.

### Publishing and finding tags

An app publishes a tag record to the user's Homeserver with their authorization. Other apps can read known annotations directly or query Nexus for indexed resources, labels, and the people who applied them. Use the upstream [tag model](https://github.com/pubky/pubky-app-specs/blob/main/SPEC.md#pubkyapptag) for record formats and validation, and the [Nexus API reference](https://nexus.pubky.app/swagger-ui/) for supported resource and tagger queries.

Discovery through Nexus depends on the [users and Homeservers that the instance indexes](https://github.com/pubky/pubky-nexus/blob/main/docs/decentralization.md). A person can be new to your app while their tags are already known to its indexer. Querying one index does not guarantee discovery of every tag or author across the network.

## Maintained specifications and libraries

- [Data model specification](https://github.com/pubky/pubky-app-specs/blob/main/SPEC.md): schemas, paths, and validation rules.
- [Library README](https://github.com/pubky/pubky-app-specs): Rust usage and links to the API reference.
- [JavaScript and TypeScript guide](https://github.com/pubky/pubky-app-specs/blob/main/pkg/README.md): npm package usage.
