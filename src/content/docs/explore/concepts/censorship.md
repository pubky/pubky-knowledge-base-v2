---
title: "Censorship"
---

Pubky aims to reduce the control a single service has over someone's ability to publish and be found. It separates a user's identity from the provider hosting their data and the applications presenting it.

Consider a post that disappears from an app's feed. The app may have hidden it, an indexer may have excluded it, or the Homeserver may have removed the original file. Those are different actions, with different consequences:

- **An app controls its presentation.** Another compatible client can offer a different view of the same available data.
- **An indexer controls its coverage and filtering.** Clients can choose another indexer or read known public records directly. This does not reproduce an indexer's search or discovery capabilities automatically.
- **A Homeserver controls the files it serves.** Keeping your identity independent of that host makes a move possible, but you still need your key and usable data copies.

[PKARR](/explore/pubky-protocol/pkarr/introduction/) provides discovery through signed records distributed over the Mainline DHT. Applications and hosting remain subject to network availability and operator policies.

The practical response to a provider withdrawing service is [Credible Exit](/explore/concepts/credible-exit/): retaining your key and usable copies of your data so you can use another provider. This requires preparation and working migration tools; discovery alone does not preserve files.

Pubky does not guarantee that every client will display a resource or every operator will host it. Its value is in making those choices separable. The [Security Model](/explore/pubky-protocol/security-model/) explains the remaining trust and availability limits.
