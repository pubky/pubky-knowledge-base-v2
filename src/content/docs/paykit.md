---
title: "Paykit"
description: "Learn how Paykit uses Pubky identities to discover payment details and coordinate private requests, allowances, and encrypted receipts."
---

## Overview

[Paykit](https://paykit.to/) is an open payment coordination protocol built on Pubky. Wallets and services use a recipient's Pubky identity to discover receiving details and exchange private payment requests, proofs, and encrypted receipts. Funds move through the payment method the wallet chooses, such as Bitcoin on-chain, Lightning, or USDT.

## Core concept

Paykit uses a payee's Pubky public key as the stable starting point for payment discovery. Instead of asking for an address or invoice out of band, an app can discover receiving details published by the payee's wallets and services on a [Homeserver](/homeserver/).

This enables applications where users can pay directly to profiles while still letting the integrating wallet or payment processor decide which payment rail to use.

## How Paykit works

Paykit uses Pubky Homeservers for payment data and [Pubky Noise](/pubky-noise/) for private Paykit messages.

### Public payment details

An identity's App Registry lists its participating Paykit apps. Each app publishes its own payment endpoints: identifiers and receiving details for the payment methods it supports. A payer's wallet discovers these endpoints and determines which methods it can use. Anyone who knows the payee's Pubky public key can read the public details. See the [protocol overview](https://github.com/pubky/paykit-rs#pubky-routing) for discovery and data organization.

### Private payment coordination

Paykit apps can establish an Encrypted Link between two identities. Over this link, a payee can share a Private Payment List containing receiving details for that counterparty. The payee can keep those details separate from the payment methods they publish publicly.

### Payment requests and allowances

Apps can exchange one-time or recurring Payment Requests, respond to them, and share Payment Proofs. For example, a service can request a monthly payment while the payer's wallet manages the schedule and executes each payment.

An Allowance records consent for a wallet to handle qualifying requests automatically within agreed limits, such as spending caps or expiry. It does not give the requesting service custody of funds. Approval policy, recurring scheduling, and payment execution remain the wallet's responsibility. See the [SDK guide](https://github.com/pubky/paykit-rs/blob/master/paykit-sdk/README.md) for these workflows and their integration requirements.

### Encrypted receipts

Paykit receipts are encrypted before storage. The payee stores the encrypted receipt on their Homeserver and shares access details over the Encrypted Link so the payer can retrieve and decrypt it. Public endpoints remain public; encryption of private exchanges does not make the underlying payment method anonymous.

## Payment methods

Actual payment method support depends on the integrating wallet or service and the recipient's receiving options. Both sides need a compatible method and payload format. The [payment endpoint identifier specification](https://github.com/pubky/paykit-rs/blob/master/specs/payment-endpoint-identifier.md) describes how apps identify payment methods; an identifier alone does not establish wallet support.

## What Paykit does not do

Paykit does not move funds, custody spending keys, or choose the final payment route. Payment method selection, payment execution, settlement verification, and spending-key management remain the responsibility of the integrating wallet, payment processor, or application. Receiving a Payment Proof or a message delivery confirmation does not by itself establish that a payment settled.

## Current status

Paykit is used in production in [Bitkit](https://bitkit.to/) for contact payments. The implementation provides a stateless Rust protocol library, a stateful SDK, and Swift and Kotlin bindings. Available features and payment methods depend on the app.

If you're evaluating an integration, choose the resource that matches your role:

- **Wallet or payment service:** Start with the SDK guide linked above. It explains the runtime, shared identity state, and responsibilities your app must implement.
- **Protocol implementation:** Use the [Rust library guide](https://github.com/pubky/paykit-rs/blob/master/paykit-lib/README.md) for protocol operations and the [Swift and Kotlin bindings guide](https://github.com/pubky/paykit-rs/blob/master/paykit-ffi/README.md) for mobile integration.
- **Receiver service:** [Paykit Server](https://github.com/pubky/paykit-server) is a separate, pre-production receiver-side implementation for Locks invoices. Check its documented scope before choosing it for a service.

## Potential use cases

### Direct profile payments

Pay directly to profiles using Pubky identity without asking for an address or invoice out of band.

### Creator monetization

Use public or private payment details for tips, paid content, or creator support.

### Commerce

Applications could use Paykit discovery around store checkouts, service bookings, or marketplace payments while keeping actual payment execution in the wallet or payment processor.

## Related research

**Atomicity Protocol** - Peer-to-peer mutual credit system research exploring trust-based payment routing using Pubky's [Semantic Social Graph](/semantic-social-graph/). Designed as settlement infrastructure for credit issuance and transfer across economic scales from peer-to-peer to institutional banking. Currently in research phase.

## References

- [Paykit repository](https://github.com/pubky/paykit-rs) — source code and protocol documentation.
- [Paykit terminology](https://github.com/pubky/paykit-rs/blob/master/THESAURUS.md) — definitions for payment endpoints, requests, allowances, and receipts.
