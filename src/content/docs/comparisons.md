---
title: "How Pubky Compares to Other Protocols"
---

Pubky combines public-key identity, signed service discovery through [PKARR](https://github.com/pubky/pkarr), and mutable files on a user-chosen [Homeserver](https://github.com/pubky/pubky-homeserver). This is useful when building a web app whose users should keep their identity and data independently of the app's operator.

For example, a document can keep the same public-key-based address as its contents change or its owner changes hosting providers. Apps use familiar HTTP storage operations, while discovering the user's chosen server without requiring ownership of a conventional domain name.

That combination is Pubky's main advantage. Several alternatives also separate apps from storage, support portable identity, or let users edit data.

## Personal storage and identity

### Solid

[Solid](https://solidproject.org/TR/protocol) lets applications access user-controlled storage, commonly called Pods, through HTTP. It supports both linked data and ordinary files, with permissions determining which applications can access them. Identity uses a WebID URL, which can be hosted separately from the data.

Pubky is particularly relevant when you want the identity and its discovery mechanism to remain independent of conventional domain ownership. Solid is worth evaluating when its linked-data conventions and Web standards fit your application.

### remoteStorage

[remoteStorage](https://remotestorage.io/protocol.html) is a close comparison: user-selected storage, HTTP files, and application access authorized through OAuth. It discovers storage using WebFinger and a domain-based user address.

Pubky adds a key-based identity and PKARR discovery to a similarly familiar storage model. For applications that need local changes synchronized automatically, consider that [remoteStorage.js already provides offline synchronization](https://remotestorage.io/rs.js/docs/why.html); choosing Pubky does not provide that application behavior automatically.

### Peergos

[Peergos](https://book.peergos.org/security/capabilities.html) provides an encrypted filesystem with controlled sharing. Its [identity infrastructure](https://book.peergos.org/security/pki.html) maps usernames to public keys and storage providers through a mirrored directory. It also supports [provider migration](https://book.peergos.org/features/migration.html) while preserving identity and links.

Pubky's public-key addresses avoid allocating names in a global username registry. Peergos deserves particular attention for private file collaboration; ordinary public Pubky records have a different confidentiality and trust model.

## Shared social data

### Nostr

[Nostr](https://github.com/nostr-protocol/nips/blob/master/01.md) distributes signed events through relays. Clients can verify an event independently of the relay that delivered it. [Published relay lists](https://github.com/nostr-protocol/nips/blob/master/65.md) help clients find where users read and publish.

Pubky offers a direct model for reading and updating the current file at a stable path. Nostr expresses updates through replacement events and [deletion requests](https://github.com/nostr-protocol/nips/blob/master/09.md). Pubky's approach can suit mutable documents; Nostr's signatures suit independently verifiable event distribution. Neither can erase copies other people have already retained.

### AT Protocol

[AT Protocol](https://atproto.com/specs/repository), used by Bluesky, stores records in signed repositories, with schemas and separately stored [blobs](https://atproto.com/specs/blob). Its [identity system](https://atproto.com/guides/identity) supports `did:plc` and `did:web`, and [account migration](https://atproto.com/guides/account-migration) is an implemented workflow.

Pubky offers public-key discovery without a PLC identity directory or domain-based DID, and file storage without requiring AT Protocol's repository format. AT Protocol's signed repositories provide verification that ordinary public Pubky files do not. Both approaches still need shared data conventions for applications to interoperate.

## Peer-to-peer application platforms

### Freenet

[Freenet](https://freenet.org/build/manual/components/contracts/) replicates mutable application state, with WebAssembly contracts validating updates. Applications define their own identity and authorization rules. This is the project formerly called Locutus, distinct from the older Freenet now called Hyphanet.

Pubky supplies a common user identity and hosted HTTP storage model. It can fit a web application that needs users to publish files without implementing replicated contract state. Freenet is relevant when replicated state and its validation rules are central to the application.

### Holepunch / Pear

[Pear's stack](https://docs.pears.com/p2p/explanation/how-the-stack-fits-together/) combines peer discovery, verifiable logs, file storage, multiwriter data, and an application runtime. Hypercore is one component of this broader stack.

Pubky fits conventional browser applications backed by user-selected servers. Pear is relevant when applications need to exchange and replicate data directly between peers. Compare the whole application and hosting model, rather than treating Hypercore alone as its equivalent to Pubky.

## What to check before choosing

Pubky's [Security Model](/explore/pubky-protocol/security-model/) includes trust in the Homeserver for public file integrity and availability. Signed discovery does not automatically sign stored files. [Changing providers](/explore/concepts/credible-exit/) also requires preserving and moving data; updating discovery alone is not migration. Use the [Getting Started guide](/explore/pubky-protocol/getting-started/) to assess how the workflow fits your application.
