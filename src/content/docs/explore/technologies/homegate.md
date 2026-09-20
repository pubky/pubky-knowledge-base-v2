---
title: "Homegate: Homeserver Signup Gatekeeping Service"
---

**Homegate** is a backend service that manages and controls signups for [Pubky Homeservers](/explore/pubky-protocol/homeserver/). Pubky's social app uses it during onboarding; the enabled verification methods depend on the operator's configuration.

It is an optional service for operators who want an onboarding gate before admitting users to their Homeserver. It controls signup, while [Pubky authentication](/explore/pubky-protocol/authentication/) controls an app's authorized access to an existing user's data.

See the [Homegate README](https://github.com/pubky/homegate/blob/master/README.md) for configuration, verification providers, and the API specification.
