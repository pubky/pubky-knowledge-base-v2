---
title: "Pubky - Frequently Asked Questions"
---

<div class="faq">

## Overview & Philosophy

<a id="q1"></a>
### Q1. What is Pubky, and why was it developed?

Pubky is a new kind of web built on public-key domains instead of usernames or rented accounts. Your public key becomes your self-sovereign domain. Pubky uses PKDNS, which runs on the Mainline DHT.

Pubky introduces a semantic social graph driven by tags and trust, not ads and opaque feeds.  
It was created to counter:
- Poisoned algorithms
- Censorship
- Walled gardens and data harvesting

<a id="q2"></a>
### Q2. Why is Pubky critical for a free-market society?

Because it removes gatekeepers by design. Identities are user-owned; hosting/indexing are interchangeable.

<a id="q3"></a>
### Q3. What's the relationship between Pubky and Slashtags?

Slashtags was a previous Synonym project using Hypercore instead of PKDNS and Homeservers. It shared similar goals.

<a id="q4"></a>
### Q4. Is Pubky open source?

Yes. Under the MIT license. [View on GitHub](https://github.com/pubky/)

<a id="q5"></a>
### Q5. What is the Pubky Protocol?

The [Pubky Protocol](/explore/pubky-protocol/introduction/) is the foundational infrastructure for Pubky - an open protocol combining censorship-resistant public-key DNS (PKARR) with conventional web technologies. It includes the protocol specification, a production-ready Homeserver implementation, and SDKs in multiple languages (Rust, JavaScript, iOS, Android).

<a id="q6"></a>
### Q6. How do I start building on Pubky?

Install the [Pubky SDK](/explore/pubky-protocol/sdk/) for your platform (Rust: `cargo add pubky`, JavaScript: `npm install @synonymdev/pubky`), follow the [official documentation](https://pubky.github.io/pubky-homeserver/), and explore the [examples in the repository](https://github.com/pubky/pubky-homeserver/tree/main/examples). The SDK provides client libraries for authentication, data storage, and Homeserver interaction.

---

## Architecture & Resolution (PKARR, PKDNS, DHT)

<a id="q7"></a>
### Q7. What is PKARR?

"Public Key Addressable Resource Records" your signed DNS-like records published on the DHT.

<a id="q8"></a>
### Q8. What is PKDNS?

[PKDNS](/explore/technologies/pkdns/) is a DNS server that resolves public-key domains by fetching [PKARR](/explore/pubky-protocol/pkarr/introduction/) records from the [Mainline DHT](/explore/technologies/mainline-dht/). It enables self-sovereign, censorship-resistant domain names while still supporting traditional ICANN domains. Anyone can run a PKDNS server or use public instances to access the decentralized web. See [PKDNS](/explore/technologies/pkdns/) for setup guides and publishing instructions.

<a id="q9"></a>
### Q9. How does Pubky compare to DNS?

Pubky replaces ICANN with your public key. You publish and resolve records yourself.

<a id="q10"></a>
### Q10. What format does PKDNS use?

DNS-style RR, signed under your key, shared via the Mainline DHT.

<a id="q11"></a>
### Q11. Does it support CNAME/SRV/HTTPS indirection?

Yes, with caveats, avoid deep/brittle recursion.

<a id="q12"></a>
### Q12. Are DHTs part of the clearnet?

Yes, via UDP. Web browsers require bridges due to lack of raw UDP support.

<a id="q13"></a>
### Q13. How can browsers interact with the DHT?

Via HTTP bridges, resolvers like PKDNS, or native helpers.

<a id="q14"></a>
### Q14. Do others need PKDNS to connect to Pubky sites?

No special setup in the Pubky App. Other apps can use public [PKDNS](/explore/technologies/pkdns/) instances or self-hosted PKDNS resolvers. Many public DNS-over-HTTPS endpoints are available—see the [PKDNS](/explore/technologies/pkdns/) documentation for a list of hosted servers.

---

## Homeservers & Hosting

<a id="q15"></a>
### Q15. What are Homeservers?

Regular web servers that host your content. Anyone can run one.

<a id="q16"></a>
### Q16. Can I run one at home?

Yes. You'll need port forwarding or tunneling if behind NAT.

<a id="q17"></a>
### Q17. How can I explore data on a Homeserver?

Use [Pubky Explorer](/explore/technologies/pubky-explorer/) ([explorer.pubky.app](https://explorer.pubky.app)), a web-based file browser for public Pubky data. Enter any public key or path (e.g., `pubky://your-key/pub/pubky.app/profile.json`) to browse files and directories stored on Homeservers. Features include keyboard navigation, file preview, directory traversal, and shareable URLs.

<a id="q18"></a>
### Q18. How can I run the complete Pubky stack locally for development?

Use [Pubky Docker](/explore/technologies/pubky-docker/), a Docker Compose orchestration that runs the entire Pubky Social stack with one command. It includes PKARR relay, Homeserver (with PostgreSQL), Pubky Nexus (with Neo4j and Redis), and the Pubky App frontend—all preconfigured and ready to use. Clone the repository, configure `.env` for testnet or mainnet, and run `docker compose up -d`. Perfect for testing integrations, developing custom frontends, or learning how all components interact. See [Pubky Docker](/explore/technologies/pubky-docker/) for setup instructions.

<a id="q19"></a>
### Q19. How do Pubky Docker and the SDK libraries work together?

Applications use the [Pubky SDK](/explore/pubky-protocol/sdk/) to interact with Pubky services. [Pubky Docker](/explore/technologies/pubky-docker/) can provide those services locally for development and testing.

<a id="q20"></a>
### Q20. How is redundancy handled?

Today, users should keep local copies of published data with [Pubky Backup](/explore/technologies/pubky-backup/). Homeserver mirroring and automatic failover are planned but not yet implemented, so practical redundancy currently means backups, self-hosting options, and the ability to repoint your identity with PKARR. PKARR records are distributed through the [Mainline DHT](/explore/technologies/mainline-dht/) and periodically republished to stay available.

<a id="q21"></a>
### Q21. Does it support load balancing?

Yes, for reads. Writes go to a single primary.

<a id="q22"></a>
### Q22. Can Homeservers sign my data?

No. Signing is done by the client.

<a id="q23"></a>
### Q23. How to self-host a Homeserver?

Deploy the package/container, configure HTTPS, publish in PKARR.

<a id="q24"></a>
### Q24. What are the storage limits?

Synonym's public Homeserver currently has: 1GB per user, 10MB per file. These are temporary limits during beta. Self-hosted Homeservers can configure their own limits.

<a id="q25"></a>
### Q25. Can Pubky integrate with Tor?

Yes, via `.onion` endpoints, but it's not yet tested officially.

---

## Identity, Keys & Security

<a id="q26"></a>
### Q26. How are keys managed?

With [Pubky Ring](/explore/technologies/pubky-ring/), the identity manager app for Pubky. Pubky Ring is a native mobile app (iOS/Android) that securely manages your pubkys (public keys), handles device sessions, publishes identity via PKARR, and authorizes apps—all without accounts or passwords.

<a id="q27"></a>
### Q27. Does Pubky support key rotation?

Not yet standardized, possible manually via PKARR fallback logic.

<a id="q28"></a>
### Q28. What if my key is lost or hacked?

Migrate to a new key, update PKARR, and alert your graph.

<a id="q29"></a>
### Q29. Can I use the same seed as Nostr?

Yes, but most users prefer separate secrets due to risk.

<a id="q30"></a>
### Q30. How does identity trust work?

No global authority, trust is built through social graph, tags, and interaction.

---

## Publishing, Privacy & Moderation

<a id="q31"></a>
### Q31. How do I publish content?

Host it on a Homeserver and link it in your PKARR.

<a id="q32"></a>
### Q32. Is Pubky suitable for private sharing?

Not yet. All current use assumes public content.

<a id="q33"></a>
### Q33. Where does moderation happen?

At the Homeserver and indexer level (e.g., [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/)).

<a id="q34"></a>
### Q34. What is Pubky Nexus?

[Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) is the production indexing and aggregation service that powers Pubky App. It transforms data from multiple Homeservers into a high-performance social graph API with sub-millisecond response times, enabling features like feeds, search, recommendations, and real-time notifications. [Explore the live API](https://nexus.pubky.app/swagger-ui/).

<a id="q35"></a>
### Q35. Can I run my own Nexus instance?

Yes! Nexus is open source and can be self-hosted. This allows organizations to run custom instances with their own content filtering policies, moderation rules, and Homeserver selections. See the [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) documentation for deployment details.

<a id="q36"></a>
### Q36. How does Pubky resist spam?

Via CAPTCHAs, rate-limits, invites, and graph distance rules.

<a id="q37"></a>
### Q37. How does Paykit fit in?

Paykit adds payment method discovery and coordination to Pubky identities. See [Paykit](/explore/technologies/paykit/) for the full overview.

<a id="q38"></a>
### Q38. Is Paykit ready for use?

No. Paykit is still a work in progress and not for production use. See [Paykit](/explore/technologies/paykit/) and the [Paykit repository](https://github.com/pubky/paykit-rs) for project status and docs.

<a id="q39"></a>
### Q39. What payment methods will Paykit support?

Paykit helps apps discover the payment details a payee publishes, but actual rail support depends on the integrating wallet or payment application. The initial examples focus on Bitcoin on-chain and Lightning, while the endpoint identifier format is designed to support other payment methods over time. See the [payment endpoint identifier spec](https://github.com/pubky/paykit-rs/blob/master/specs/payment-endpoint-identifier.md).

<a id="q40"></a>
### Q40. Where is Paykit being tested?

Paykit is being integrated into Bitkit (iOS and Android) to validate the protocol design and identify issues before stabilization. These integrations serve as testbeds, not production features.

<a id="q41"></a>
### Q41. When will Paykit be production-ready?

There is no set timeline. Protocol stabilization, security auditing, cross-platform testing, and interoperability validation still need more work.

<a id="q42"></a>
### Q42. Can Pubky do everything Nostr can?

Yes, and more. Pubky includes DHT-based discovery and semantic tagging.

---

## Interoperability, Ecosystem & Onboarding

<a id="q43"></a>
### Q43. Pubky vs IPFS

Pubky is identity-first and mutable; IPFS is content-first and immutable.

<a id="q44"></a>
### Q44. Pubky vs Nostr

Pubky uses Homeservers and PKARR for hosting; Nostr uses relays. Pubky has semantic discovery.

<a id="q45"></a>
### Q45. Pubky vs Bluesky

Pubky is key-native and decentralized. Bluesky relies on DID directories and centralized servers.

<a id="q46"></a>
### Q46. Pubky vs Farcaster

Pubky = key-owned + off-chain. Farcaster = chain-anchored + relay-dependent.

<a id="q47"></a>
### Q47. Will Pubky integrate with other protocols?

Bridges are possible, but not currently in development.

<a id="q48"></a>
### Q48. Are there mobile apps?

Yes! 
- **[Pubky Ring](/explore/technologies/pubky-ring/)**: Native mobile app (iOS/Android) - Your keychain for the Pubky ecosystem. Manages identities, authorizes apps, and handles sessions. Self-custodial with no accounts required.
- **[Pubky.app](https://pubky.app)**: Progressive Web App (PWA) - Social publishing application
- More apps welcome from the community!

<a id="q49"></a>
### Q49. What is Pubky Ring?

[Pubky Ring](/explore/technologies/pubky-ring/) is the key manager app for the Pubky ecosystem. It's a native mobile app (iOS/Android) that securely manages your pubkys (public keys), authorizes applications, manages sessions, and handles key derivation—all self-custodially with no accounts, passwords, or tracking. Think of it as your keychain for decentralized identity.

<a id="q50"></a>
### Q50. How do users join Pubky App?

Homeservers can implement signup verification to prevent spam while preserving privacy. [Homegate](/explore/technologies/homegate/) is an open-source service that provides two verification methods: SMS codes (rate-limited per phone number) and Lightning Network payments. Homeserver operators can use Homegate, implement custom verification, or allow open signups. See [Homegate](/explore/technologies/homegate/) for deployment and integration details.

<a id="q51"></a>
### Q51. Indexer vs Homeserver?

- Homeserver = stores user data  
- Indexer = enables search/feeds across Homeservers

<a id="q52"></a>
### Q52. How do I ensure my app is compatible with pubky.app?

Follow the [pubky-app-specs](https://github.com/pubky/pubky-app-specs) data model specification. This defines the structure and validation rules for users, posts, tags, bookmarks, follows, mutes, feeds. The spec is available as an [npm package](https://www.npmjs.com/package/pubky-app-specs) (JavaScript/TypeScript) and a [Rust crate](https://crates.io/crates/pubky-app-specs).

<a id="q53"></a>
### Q53. What's the status of Pubky App development?

The Pubky App client ([pubky.app](https://pubky.app)) is live and under active development at [github.com/pubky/pubky-app](https://github.com/pubky/pubky-app). Developers building compatible clients should use [pubky-app-specs](https://www.npmjs.com/package/pubky-app-specs) (or the [Rust crate](https://crates.io/crates/pubky-app-specs)) as the authoritative specification.

<a id="q54"></a>
### Q54. Can I contribute to Pubky App?

Yes! The [pubky-app repository](https://github.com/pubky/pubky-app) is under active development and welcomes contributions. If you want to build a compatible social client, use the [pubky-app-specs](https://www.npmjs.com/package/pubky-app-specs) specification as your foundation.

---

## Operations, Resilience & Scale

<a id="q55"></a>
### Q55. How do I migrate providers?

Keep a current local copy with [Pubky Backup](/explore/technologies/pubky-backup/), sign up on the new Homeserver, re-upload your data with Pubky tooling such as the SDK or [Pubky CLI](/explore/technologies/pubky-cli/), update your PKARR record, let caches refresh, then retire the old host.

<a id="q56"></a>
### Q56. What if Synonym disappears?

Your key remains yours because it is self-custodied, and your data remains portable if you have local backups or another Homeserver copy. Keep [Pubky Backup](/explore/technologies/pubky-backup/) running for published data you care about.

<a id="q57"></a>
### Q57. What if my ISP censors my Homeserver?

Switch hosts, use Tor/VPN, republish PKARR.

<a id="q58"></a>
### Q58. How often does PKARR update?

Periodically, every few hours is typical. See [republishing research](https://github.com/pubky/pkarr-churn/blob/main/results-node_decay.md) for details.

<a id="q59"></a>
### Q59. What if I spam the DHT?

You'll be rate-limited. Publish sensibly.

<a id="q60"></a>
### Q60. Does DHT scale globally?

Yes. Mainline DHT already does, Pubky's usage is lightweight.

<a id="q61"></a>
### Q61. Why do some say Nostr needs a DHT?

Because relay-only networks don't scale easily without coordination.

<a id="q62"></a>
### Q62. What about private data in Pubky?

Short-term: [Pubky Noise](/explore/technologies/pubky-noise/)-based encrypted channels for private peer-to-peer communication.  
Long-term: Cryptree-style systems and further R&D.

<a id="q63"></a>
### Q63. What is Pubky Noise?

Pubky Noise is a Noise Protocol implementation that provides encrypted communication channels for the Pubky ecosystem. It uses the IK handshake pattern for mutual authentication and forward secrecy. Currently used by [Paykit](/explore/technologies/paykit/) for private payment negotiation, it can also support other applications requiring secure peer-to-peer communication. Work in progress - not production-ready yet.

<a id="q64"></a>
### Q64. How does Pubky Noise differ from the Noise Protocol?

Pubky Noise is a specific implementation of the Noise Protocol Framework adapted for the Pubky ecosystem. It integrates with Pubky's Ed25519 identity system, derives X25519 encryption keys automatically, and publishes endpoints to Homeserver directories for peer discovery. It provides platform-specific bindings (iOS, Android, Web, CLI) and handles session management.

---

</div>
