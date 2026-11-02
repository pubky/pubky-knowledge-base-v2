---
title: "Pubky Market"
description: "Learn how Pubky Market combines user-owned shops and listings with direct payments to sellers and coordinated orders."
---

[Pubky Market](https://shop.pubky.app/) adds shops and product listings to Pubky, with buyers paying sellers directly. Sellers publish a catalog under their Pubky identity, and buyers discover products and follow their orders. Market supports physical and digital goods, with sale formats such as fixed-price listings, auctions, and timed releases called drops.

## How Market uses Pubky

A seller's shop and listings are public records on their [Homeserver](/homeserver/). Reviews and related public commerce records use shared formats so compatible clients and indexers can read them. Market's catalog is therefore more than data held inside one shop interface.

A dedicated marketplace [Nexus](/pubky-nexus/) indexes those records for browsing and search. Its catalog views are derived data; the seller's Homeserver records remain the source of their published catalog.

Publishing a listing and completing a sale are separate actions. A transaction service coordinates shared decisions such as reserving stock, accepting an offer, closing an auction, and advancing an order. A cached listing or a Homeserver write cannot establish that a buyer reserved the last item or paid for it. The [transaction-authority explanation](https://github.com/pubky/pubky-marketplace/blob/master/docs/adr/0019-marketplace-transaction-authority.md) describes this division of responsibilities.

## From listing to order

1. A seller publishes a shop and listing, with prices, inventory, delivery options, and sale terms.
2. A buyer finds the listing and starts checkout. The transaction service coordinates the reservation and records the order's agreed terms.
3. The buyer pays the seller through an available payment method. The service reconciles the payment result before advancing the order.
4. The seller fulfills the order, or the buyer receives the purchased digital delivery. Order history and signed receipts help the participants retain evidence of the transaction.

[Paykit](/paykit/) coordinates payment discovery and requests, while [Pubky Locks](/pubky-locks/) controls access to purchased content, such as paid articles and downloadable files. Market integrates these building blocks with its order workflow. They do not replace the transaction service's inventory and order decisions.

## Payments and trust

Payments go to the seller; Market does not custody funds or send refunds from a platform balance. Buyers and sellers still rely on the chosen payment method, the seller's fulfillment, and the transaction service's order decisions. Keeping a public catalog on a Homeserver does not make every commerce action independent of services.

Available checkout methods depend on the seller and deployment. Use the live app's checkout for the options offered on a particular purchase.

## Explore or build

- **Try Market:** Open the app linked above to browse shops and listings.
- **Work on the client:** Start with the [developer onboarding guide](https://github.com/pubky/pubky-marketplace/blob/master/docs/ecommerce/onboarding.md).
- **Build compatible records:** Use [Pubky Market Specs](https://github.com/pubky/pubky-market-specs) for the data model and Rust and JavaScript libraries.
- **Integrate order operations:** Read the [transaction service](https://github.com/pubky/pubky-marketplace-service) and its linked seller-automation API reference.
