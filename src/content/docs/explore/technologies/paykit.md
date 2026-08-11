---
title: "Paykit: Decentralized Payment Protocol (Work in Progress)"
---

> ⚠️ **NOTE**: Paykit is currently under active development and is **NOT production-ready**. The protocol and implementation are subject to significant changes. Integration work in Bitkit serves as a testbed for protocol development.

## Overview

Paykit is a payment protocol built on Pubky for payment discovery and coordination across multiple payment methods, including Bitcoin on-chain and Lightning. Apps can start from a Pubky public key, discover public payment details, privately share payment details over encrypted channels, and let payers retrieve encrypted receipts.

## Core Concept

Paykit uses a payee's Pubky public key as the stable starting point for payment discovery. Instead of asking for an address or invoice out of band, an app can look up the published payment details on a [Homeserver](/explore/pubky-protocol/homeserver/) under `/pub/paykit/v0/{payment_endpoint_identifier}`.

This enables applications where users can pay directly to profiles while still letting the integrating wallet or payment processor decide which payment rail to use.

## How Paykit Works

Paykit uses Pubky Homeservers for payment data and [Pubky Noise](/explore/technologies/pubky-noise/) for private Paykit messages.

### Public Payment Details

Payees publish payment details to their Homeserver. Anyone who knows the payee's Pubky public key can discover those public details.

### Private Payment Coordination

When a payment should not rely on public payment details, a payee can share a private payment list with a specific counterparty over an encrypted channel. Private payment details are exchanged as Private Payment Envelopes.

### Encrypted Receipts

Paykit receipts are encrypted before storage. The payee stores the encrypted receipt on their Homeserver and sends the payer the access details needed to retrieve and decrypt it.

## Payment Methods

Paykit helps apps discover the payment details a payee publishes, but actual payment method support depends on the integrating wallet or payment application. The initial examples focus on Bitcoin on-chain and Lightning, while the endpoint identifier format is designed to support other payment methods over time. See the [Paykit Payment Endpoint Identifier Specification](https://github.com/pubky/paykit-rs/blob/master/specs/payment-endpoint-identifier.md).

## What Paykit Does Not Do

Paykit does not move funds, custody keys, choose a payment rail, or implement wallet logic. Payment method selection, payment execution and key management remain the responsibility of the integrating wallet, payment processor, or application.

## Current Status

The current implementation includes public payment lists, private payment envelopes, encrypted links, and encrypted receipt access. [Bitkit](https://bitkit.to/) integrations on iOS and Android are used as protocol testbeds before stabilization.

## Potential Use Cases

### Direct Profile Payments

Pay directly to profiles using Pubky identity without asking for an address or invoice out of band.

### Creator Monetization

Use public or private payment details for tips, paid content, or creator support.

### Commerce

Applications could use Paykit discovery around store checkouts, service bookings, or marketplace payments while keeping actual payment execution in the wallet or payment processor.

## Related Research

**Atomicity Protocol** - Peer-to-peer mutual credit system research exploring trust-based payment routing using Pubky's [Semantic Social Graph](/explore/concepts/semantic-social-graph/). Designed as settlement infrastructure for credit issuance and transfer across economic scales from peer-to-peer to institutional banking. Currently in research phase.

## References

- **Repository and protocol overview**: [github.com/pubky/paykit-rs](https://github.com/pubky/paykit-rs)
- **Library usage and API details**: [paykit-lib README](https://github.com/pubky/paykit-rs/blob/master/paykit-lib/README.md)
- **Paykit Payment Endpoint Identifier Specification**: [payment-endpoint-identifier.md](https://github.com/pubky/paykit-rs/blob/master/specs/payment-endpoint-identifier.md)
