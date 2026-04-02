---
title: "pubky.app"
---

Web portal for the Pubky ecosystem — a publisher and social feed for the decentralized web.

> **Note:** This component is NOT part of Pubky Core. It is part of the Pubky social app stack (along with [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/)).

## Overview

pubky.app is a social media-like web application built on top of [Pubky Core](/explore/pubkycore/introduction/). It serves as the flagship example of how to build applications using the Pubky [SDK](/explore/pubkycore/sdk/) for authentication and data storage, combined with [Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) for data [aggregation](/explore/pubky-apps/indexing-and-aggregation/aggregator/) and [indexing](/explore/pubky-apps/indexing-and-aggregation/indexer/), turning distributed data into fast-loading feeds and a navigable social graph.

- **GitHub**: https://github.com/pubky/pubky-app
- **Platform**: Web (Next.js progressive web app)
- **Status**: Active development

The application follows a local-first architecture where writes commit to local IndexedDB immediately for instant UI feedback, then sync to the [homeserver](/explore/pubkycore/homeserver/) in the background.

## Tech Stack

- **Next.js 16 / React 19 / TypeScript** — Core framework
- **Tailwind CSS 4 / Shadcn UI / Radix UI** — Styling and components
- **Zustand** — Global state management
- **Dexie** — IndexedDB wrapper for local-first persistence
- **TanStack Query** — Data fetching with caching
- **@synonymdev/pubky** — WASM [SDK](/explore/pubkycore/sdk/) for homeserver communication
- **[pubky-app-specs](/explore/pubky-apps/app-specs/)** — Shared data specifications

## Key Features

- **Social feeds** (home, hot/trending, search) via [Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/)
- **Profiles, posts, bookmarks, notifications**
- **QR Code Authentication** via [Pubky Ring](/explore/technologies/pubky-ring/)
- **Offline support** — PWA with service worker caching and local-first writes

## Codebase Structure

The codebase is organized in layers with strict separation of concerns:

| Layer | Responsibility |
|-------|----------------|
| **Controllers** | Entry point for UI actions |
| **Coordinators** | System-initiated actions (polling, auth changes, TTL) |
| **Application** | Business logic orchestration |
| **Services** | IO boundaries (local, homeserver, nexus) |
| **Models** | Dexie-based IndexedDB persistence |
| **Stores** | UI state via Zustand |

### Data Flow
1. **Writes** go to [homeserver](/explore/pubkycore/homeserver/) via [SDK](/explore/pubkycore/sdk/)
2. [Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) polls [homeserver](/explore/pubkycore/homeserver/) for changes via the `/events/` endpoint
3. Nexus indexes and aggregates data
4. **Reads** come from Nexus for performance
5. Local Dexie cache provides offline access

All user data is stored under `/pub/pubky.app/` on the homeserver following the [pubky-app-specs](/explore/pubky-apps/app-specs/) schema.

See the [repository](https://github.com/pubky/pubky-app) for routes, environment configuration, and development setup.
