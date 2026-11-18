---
title: "Security Model"
description: "Understand Pubky's trust boundaries: identity key custody, Homeserver access to data, discovery availability, and transport security."
---

Pubky separates identity from hosting, but applications still depend on key custody, Homeserver behavior, and network availability. [Credible exit](/credible-exit/) reduces dependence on a provider; it does not remove these trust boundaries.

## Key custody

Anyone holding an identity's private key can act as that identity. Losing every copy makes the identity unrecoverable. Changing Homeservers or revoking app sessions does not make a compromised identity key safe again.

Use an authenticator you trust and request only the app permissions you need. See [Authentication](/authentication/) for the integration guides.

## Homeserver trust

<span id="guarded-data"></span>

Data under `/pub/` is public. Access to `/priv/` requires a session for the storage owner's identity and permissions covering the requested access. This is access control, not encryption: Homeserver administrators can still read and write tenant data. See [Private Storage](/private-storage/) for an overview and the [Private Storage guide](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/docs/PRIVATE_STORAGE.md) for access rules.

Applications can encrypt content before uploading it and manage decryption keys themselves. The Homeserver then stores ciphertext, while access patterns and data sizes remain visible. `/priv/` adds access control; it does not provide encryption or key management.

A signed discovery record does not prove that stored application content is authentic. Applications must account for an operator altering, withholding, or deleting data, and observing access patterns. Keeping independent copies helps preserve data if a provider becomes unavailable; it does not by itself detect tampering.

## Scoped encryption keys

The SDK can deliver [user-approved encryption keys](/authentication/#scoped-encryption-keys) without exposing the identity secret. These keys are derived from the identity secret and storage paths. Revoking a grant or letting it expire cannot retract delivered keys: an app that received a key can still decrypt content encrypted under it, including future content. Request the narrowest scopes needed.

Saved signed approvals contain encryption keys as plaintext in IndexedDB. Scripts on the same origin and anyone with a copy of the browser profile can read them, even when the delegated signing key is non-extractable. Treat session exports and saved records as sensitive key material. See the [scoped encryption keys guide](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/docs/scoped-encryption-keys.md#encryption-limitations) for encryption limitations, persistence, and offline recovery.

## Discovery and availability

PKARR records can expire, lookups can fail, and caches can delay a hosting change. A new discovery record does not recover missing files or guarantee immediate reachability. See the [PKARR trade-offs](https://github.com/pubky/pkarr/blob/main/docs/introduction.md#the-trade-offs).

## Transport Security

Transport encryption protects a connection, not data from the Homeserver handling it. The [SDK connection overview](/sdk/#homeserver-connections) explains platform differences and fallback to conventional HTTPS. The [Homeserver Deployment Guide](https://github.com/pubky/pubky-homeserver/blob/{{pinned_homeserver_release}}/docs/DEPLOY.md) covers the supported connection and deployment options; the [PKARR TLS specification](https://github.com/pubky/pkarr/blob/main/design/tls.md) describes public-key verification.
