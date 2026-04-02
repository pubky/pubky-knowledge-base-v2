---
title: "Introduction"
---

Leveraging the [Pubky Core](/explore/pubkycore/introduction/) protocol as the foundational layer, we can envision a diverse array of applications with distinct functionalities. While each app can implement its own unique design patterns and user interfaces, they all share a common underlying architecture: interacting with the distributed data stores, colloquially referred to as [Homeservers](/explore/pubkycore/homeserver/), through standardized read and write operations.

The [Pubky Core protocol](/explore/pubkycore/introduction/) enables a decentralized approach to data management, facilitating seamless communication between clients and their respective data stores. This architecture promotes data sovereignty and enhances system resilience.

Below, we present several high-level designs that showcase the versatility of this architecture, from simple client (browser) apps that interact directly with one or several [Homeservers](/explore/pubkycore/homeserver/) to more complex applications with custom aggregators and backends capable of powerful inference:

- [Client-Homeserver](/explore/pubky-apps/app-architectures/client-homeserver/)
- [Custom backend](/explore/pubky-apps/app-architectures/custom-backend/)
- [Global aggregators](/explore/pubky-apps/app-architectures/global-aggregators/)
