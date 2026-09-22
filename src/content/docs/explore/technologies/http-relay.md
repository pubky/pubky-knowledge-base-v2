---
title: "HTTP Relay"
---

HTTP relay service for forwarding encrypted grants during Pubky [authentication](/explore/pubky-protocol/authentication/) flows.

In the Pubky Auth flow, a third-party app needs to receive a grant from the user's authenticator ([Pubky Ring](/explore/technologies/pubky-ring/)). The relay solves this by providing a temporary rendezvous point where encrypted grants can be deposited and retrieved.

The relay handles message delivery; the clients handle grant encryption. It does not store your app's files or replace a [Homeserver](/explore/pubky-protocol/homeserver/). The [authentication overview](/explore/pubky-protocol/authentication/) shows where it fits in the grant exchange.

Use the [Pubky SDK](/explore/pubky-protocol/sdk/) for app authentication integration. For the relay's API, configuration, and operation, see the [HTTP Relay README](https://github.com/pubky/http-relay/blob/main/README.md); its [interactive demo](https://pubky.github.io/http-relay/) illustrates message delivery.
