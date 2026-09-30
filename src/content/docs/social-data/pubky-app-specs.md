---
title: "pubky-app-specs"
---

Shared data model specifications for the Pubky 'social' app ecosystem, with [pubky.app](/social-data/pubky-app/) as the reference implementation.

## Overview

`pubky-app-specs` defines the canonical data schemas for social application data stored on Pubky [homeservers](/components/homeserver/). It provides validation rules, serialization logic, and type definitions used by both *Pubky apps* and the [Pubky Nexus](/social-data/pubky-nexus/) indexer to ensure interoperability with [pubky.app](/social-data/pubky-app/). Note that this is *only* required for Pubky 'social' apps: Pubky apps that read or write pubky.app social data, including profiles, posts and collections, follows, mutes, tags, bookmarks, and feeds. Pubky apps that do not rely on that social data should ignore `pubky-app-specs` and rely solely on their own application-specific schemas.

## Reusing social data

A third-party app can read compatible records directly from Homeservers through the [Pubky SDK](/build/sdk/), or query Nexus for indexed views across users. For example, a reading app could display a user's profile and the articles shared by people they follow. The profile and follow relationships do not need to be recreated in a separate account system.

To contribute compatible data, an app publishes records to the user's Homeserver with the user's authorization. Shared schemas let other clients interpret those records; each client can choose its own presentation and features. Using the schemas does not mean every client or indexer supports every record type or includes every user.

## Universal Tags

A Universal Tag expresses a named relation from a user to a resource. For example, Alice tags an article `tutorial`:

| Part | Meaning | Example |
| --- | --- | --- |
| Subject | Who applied the tag | Alice's Pubky identity |
| Relation | The tag's label | `tutorial` |
| Object | The resource being tagged | The article's URI |

The tag is stored on Alice's Homeserver, separately from the article. It adds context without changing the resource and can describe resources beyond pubky.app posts and profiles. Another app could reuse the annotation to organize reading material. Labels express their authors' assessments; apps choose whose annotations to include.

Tags support discovery in both directions:

- **Find resources through people:** show the articles Alice tagged `tutorial`.
- **Find people through resources:** show who tagged an article `tutorial`, including people previously unknown to the app who use another app or Homeserver.

These connections form part of the [semantic social graph](/social-data/semantic-social-graph/).

Apps publish tag records to the user's Homeserver with their authorization. They can read known annotations directly or query Nexus for indexed resources and taggers. See the [tag model](https://github.com/pubky/pubky-app-specs/blob/main/SPEC.md#pubkyapptag) for record formats and validation, and the [Nexus API reference](https://nexus.pubky.app/swagger-ui/) for supported queries.

Nexus discovery is limited to the [users and Homeservers its instance indexes](https://github.com/pubky/pubky-nexus/blob/main/docs/decentralization.md): someone can be new to your app while already known to its indexer.

## Specifications and libraries

- [Data model specification](https://github.com/pubky/pubky-app-specs/blob/main/SPEC.md): schemas, paths, and validation rules.
- [Library README](https://github.com/pubky/pubky-app-specs): Rust usage and links to the API reference.
- [JavaScript and TypeScript guide](https://github.com/pubky/pubky-app-specs/blob/main/pkg/README.md): npm package usage.
