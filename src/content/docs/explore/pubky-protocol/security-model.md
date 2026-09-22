---
title: "Security Model"
---

Pubky separates identity from hosting, but applications still depend on key custody, Homeserver behavior, and network availability. [Credible exit](/explore/concepts/credible-exit/) reduces dependence on a provider; it does not remove these trust boundaries.

## Key custody

Anyone holding an identity's private key can act as that identity. Losing every copy makes the identity unrecoverable. Changing Homeservers or revoking app sessions does not make a compromised identity key safe again.

Use an authenticator you trust and request only the app permissions you need. See [Authentication](/explore/pubky-protocol/authentication/) for the maintained integration guides.

## Homeserver trust

Data under `/pub/` is public. Authenticated storage is access control, not end-to-end encryption: Homeserver administrators can still read and write tenant data. The [Private Storage guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/PRIVATE_STORAGE.md) defines these boundaries.

A signed discovery record does not prove that stored application content is authentic. Applications must account for an operator altering, withholding, or deleting data, and observing access patterns. Keeping independent copies helps preserve data if a provider becomes unavailable; it does not by itself detect tampering.

## Discovery and availability

PKARR records can expire, lookups can fail, and caches can delay a hosting change. A new discovery record does not recover missing files or guarantee immediate reachability. See the [PKARR trade-offs](https://github.com/pubky/pkarr/blob/main/docs/introduction.md#the-trade-offs).

## Transport Security

Transport encryption protects a connection, not data from the Homeserver handling it. The [Homeserver Deployment Guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/DEPLOY.md) covers the supported connection and deployment options; the [PKARR TLS specification](https://github.com/pubky/pkarr/blob/main/design/tls.md) describes public-key verification.
