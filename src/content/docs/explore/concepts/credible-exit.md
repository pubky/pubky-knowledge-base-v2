---
title: "Credible Exit"
---

Credible exit means being able to leave a service while retaining your identity and usable data, at a practical cost. [Gordon Brander's introduction](https://newsletter.squishy.computer/p/credible-exit) explains the idea.

## Keeping an identity while changing hosts

Imagine that your hosting provider raises its prices or stops offering its service. If your identity were an account belonging to that provider, moving could mean sharing a new address and rebuilding connections. In Pubky, the public key remains your identifier. You can update its discovery records to point applications to another Homeserver.

That separation reduces the cost of leaving, but updating an address does not copy files. Moving hosting also requires available data, a destination that accepts it, and compatible tooling. A hosting change cannot recover a lost identity key or files for which no usable copy remains.

## Making exit practical

[Pubky Backup](/explore/technologies/pubky-backup/) can keep local copies of published data. Keep your identity backup separately; published files cannot recover a lost private key. The availability of a backup does not imply an automatic restore or provider-switching workflow, so check the maintained tool documentation before relying on it for migration.

Leaving an application and leaving a host are separate choices. Another compatible client can work with the same social records without moving their storage. An alternative indexer can produce different feeds, search results, and moderation decisions from public data. Neither guarantees that another service will index everything or reproduce the original experience. See [App Architectures](/explore/pubky-apps/app-architectures/introduction/) for how applications choose these components.
