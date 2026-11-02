---
title: "Pubky Locks"
description: "Learn how Pubky Locks gives viewers access to creator-owned content after payment, using Homeserver storage and Paykit."
---

[Pubky Locks](https://github.com/pubky/locks) lets creators charge for access to content stored on their own [Homeserver](/homeserver/). A public content lock describes the access criteria, and a Lock Server checks whether a viewer satisfies them before serving the guarded content.

[pubky.app](/pubky-app/) uses Locks for paid posts and articles. Creators publish a public teaser; viewers pay with a [Paykit](/paykit/)-enabled wallet (like [Bitkit](https://bitkit.to/)) to unlock the content. Availability of paid unlocks depends on the deployment and your region. The [pubky.app Locks guide](https://github.com/pubky/pubky-app/blob/dev/docs/locks.md) explains the integration and availability checks.

## How a paid unlock works

A paid article illustrates the roles of Pubky, Locks, and [Paykit](/paykit/):

1. **Publish the content.** The creator authorizes a Lock Server to work with their content. The guarded article and its files stay on the creator's Homeserver. A public content lock records the price and identifies the guarded resources.
2. **Share a preview.** A public teaser points viewers to the content lock without exposing the article itself.
3. **Pay from a wallet.** The viewer starts an unlock request and pays through their wallet. Paykit coordinates the payment request, and Paykit Server checks the payment. The wallet must support Paykit payment requests and a payment method accepted by the creator and server.
4. **Record the entitlement.** The Lock Server checks the payment against the content lock's policy. On success, it stores an entitlement record on the creator's Homeserver.
5. **Read the content.** The viewer requests a temporary access credential, then uses it to retrieve the guarded article through the Lock Server.

Payment verification and content access have separate responsibilities: Paykit Server reports payment facts; Locks decides whether those facts satisfy the access policy. The [Locks–Paykit integration boundary](https://github.com/pubky/locks/blob/master/docs/ADRs/0020-locks-paykit-v1-integration-boundary.md) describes that division.

## Access and trust

The Lock Server acts with authority granted by the creator and can read the content it serves. Choosing a Lock Server therefore means trusting its operator with the authorized content. Access checks run in this application service; the Homeserver remains responsible for storage and permissions.

An entitlement records that the viewer satisfied a content lock. The temporary access credential lets the viewer retrieve content while that credential remains valid. Keeping these separate allows credentials to expire without discarding the entitlement. See the [domain model](https://github.com/pubky/locks/blob/master/docs/DOMAIN_MODEL.md) for the full lifecycle.

Applications can choose how to retain unlocked content. pubky.app saves a private copy on the viewer's own Homeserver for later reading. Deleting the original lock does not remove copies a viewer already obtained.

## Build with Locks

- **Integrate a client:** Use the [SDK guide](https://github.com/pubky/locks/blob/master/docs/SDK.md) for creator and viewer workflows, with Rust and JavaScript/WebAssembly support.
- **Try the complete flow:** Follow the [local browser examples](https://github.com/pubky/locks/blob/master/examples/js-sdk/README.md).
- **Run a Lock Server:** Read the [runtime guide](https://github.com/pubky/locks/blob/master/docs/RUNTIME.md) and its deployment requirements.

Keep payment processing in the wallet and Paykit integration, content-access decisions in Locks, and storage permissions on the Homeserver when building your own client or service.
