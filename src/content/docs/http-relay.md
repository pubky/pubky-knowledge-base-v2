---
title: "HTTP Relay"
---

[HTTP relay](https://github.com/pubky/http-relay) service for forwarding encrypted grants during Pubky [authentication](/authentication/) flows.

In the Pubky Auth flow, a third-party app needs to receive a grant from the user's authenticator ([Pubky Ring](/pubky-ring/)). The relay solves this by providing a temporary rendezvous point where encrypted grants can be deposited and retrieved.

The relay handles message delivery; the clients handle grant encryption. It does not store your app's files or replace a [Homeserver](/homeserver/). The [authentication overview](/authentication/) shows where it fits in the grant exchange.

Use the [Pubky SDK](/sdk/) for app authentication integration. For the relay's API, configuration, and operation, see the [HTTP Relay README](https://github.com/pubky/http-relay/blob/main/README.md); its [interactive demo](https://pubky.github.io/http-relay/) illustrates message delivery.
