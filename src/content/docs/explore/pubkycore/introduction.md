---
title: "Pubky Core: Open Protocol for Decentralized Web Applications"
---

![Pubky Core architecture diagram showing the relationship between public-key identities, PKARR records on Mainline DHT, Homeservers, and client applications](/images/pubky-core.svg)

> **An open protocol for per-public-key backends for censorship resistant web applications.**

## Overview

Pubky Core combines a [censorship-resistant public-key-based alternative to DNS](https://github.com/pubky/pkarr) ([PKARR](/explore/pubkycore/pkarr/introduction/)) with conventional, tried-and-tested web technologies. This keeps users in control of their identities and data while enabling developers to build software with the availability of web apps, without the costs of managing a central database.

**The Core Philosophy:**
> "The Web, long centralized, must decentralize; Long decentralized, must centralize."

Pubky Core provides the infrastructure for building truly decentralized applications where:
- Users control their identities (public keys)
- Users choose where their data lives ([Homeserver](/explore/pubkycore/homeserver/))
- Applications remain interoperable
- No single entity can control or censor

## What is Pubky Core?

Pubky Core consists of three main components:

### 1. Protocol Specification
The open protocol that defines:
- Public key-based authentication
- Capability-based authorization
- Key-value storage semantics
- Homeserver discovery via [PKARR](/explore/pubkycore/pkarr/introduction/)
- RESTful API standards

### 2. Homeserver Implementation
A production-ready server application that:
- Hosts user data in key-value stores
- Provides RESTful HTTP API
- Handles authentication and sessions
- Publishes to [PKARR](/explore/pubkycore/pkarr/introduction/) for discovery
- Supports multiple persistence backends (Files, LMDB, SQL)
- Includes admin and metrics endpoints

### 3. SDK (Software Development Kit)
Client libraries for developers:
- **Rust**: Full-featured native SDK
- **JavaScript/WASM**: Browser and Node.js support
- **iOS/Android**: Native mobile bindings
- Examples and documentation

## Core Concepts

### [Homeserver](/explore/pubkycore/homeserver/)
Decentralized data storage nodes that host user data. Each user can choose their Homeserver or run their own. Data is stored per public key, and users can migrate between Homeservers by updating their [PKARR](/explore/pubkycore/pkarr/introduction/) record.

### [PKARR](/explore/pubkycore/pkarr/introduction/)
Self-issued public keys that function as sovereign, publicly addressable domains. PKARR records published to the [Mainline DHT](/explore/technologies/mainline-dht/) point to Homeserver locations, enabling decentralized discovery.

### [Authentication](/explore/pubkycore/authentication/)
Users grant apps scoped access to their data on the [Homeserver](/explore/pubkycore/homeserver/). Authentication is decentralized - users control their own cryptographic keys with no central identity providers.

### [Credible Exit](/explore/concepts/credible-exit/)
Pubky Core's distributed architecture provides user autonomy through credible exit between interchangeable components. Users can switch Homeservers, applications, or identity managers without losing their data or social graph.

## Key Features

### Authentication & Authorization
- **Public key-based authentication**: No passwords, no accounts
- **3rd party authorization**: OAuth-style flows with capability tokens
- **Session management**: Secure, time-limited sessions
- **Recovery files**: Encrypted backup and recovery

### Storage API
- **Key-value store**: Simple PUT/GET/DELETE operations
- **HTTP-based**: RESTful API over HTTPS
- **Pagination**: Efficient listing of large datasets
- **Namespace isolation**: Separate data spaces per application

### Developer Experience
- **Multiple language bindings**: Rust, JavaScript, Swift, Kotlin
- **Comprehensive examples**: Step-by-step tutorials
- **Testing utilities**: Local testnet for development
- **Docker support**: Easy deployment and testing

### Production-Ready
- **Multiple persistence backends**: Choose between Files, LMDB, or SQL
- **Rate limiting**: Built-in DDoS protection
- **Metrics and monitoring**: Prometheus-compatible metrics
- **Admin API**: Server management and diagnostics
- **Event streams**: Real-time updates via pub/sub

## Architecture

### Application Architectures

[Pubky App Architectures](/explore/pubky-apps/app-architectures/introduction/) can be very diverse:

1. **[Simple Client-Homeserver](/explore/pubky-apps/app-architectures/client-homeserver/)**
   - Web client connects directly to a single Homeserver
   - User data storage and retrieval
   - Authentication and sessions

2. **[Global Aggregators](/explore/pubky-apps/app-architectures/global-aggregators/)**
   - Aggregate data from many Homeservers
   - Provide discovery and search
   - Enable social features

3. **[Complex Backends](/explore/pubky-apps/app-architectures/custom-backend/)**
   - Custom aggregation and inference
   - Application-specific logic
   - Enhanced features like [Semantic Social Graph](/explore/concepts/semantic-social-graph/)

### Data Flow

```
User Identity (Public Key)
    ↓
PKARR Record (Mainline DHT)
    ↓ Points to
Homeserver Location
    ↓ Stores
User Data (Key-Value)
    ↓ Accessed by
Applications (via SDK)
```

## Getting Started

### For Developers

**Install SDK:**
```bash
# Rust
cargo add pubky

# JavaScript
npm install @synonymdev/pubky

# See mobile bindings in SDK documentation
```

**Quick Example (JavaScript):**
```javascript
import { Pubky, Keypair } from '@synonymdev/pubky';

// Create client and signer
const pubky = new Pubky();
const signer = pubky.signer(Keypair.random());

// Sign up (pass signup token for gated homeservers, null for open/testnet)
const session = await signer.signup(homeserverPk, null);

// Store data
await session.storage.putJson("/pub/myapp/profile", {
  name: "Alice",
  bio: "Decentralized and loving it!"
});

// Retrieve data
const profile = await session.storage.getJson("/pub/myapp/profile");
```

See [SDK Documentation](/explore/pubkycore/sdk/) for complete guides.

### Run Local Homeserver

**Using Cargo:**
```bash
git clone https://github.com/pubky/pubky-core
cd pubky-core/pubky-homeserver
cargo run
```

**Using Docker:**
```bash
docker build --build-arg TARGETARCH=x86_64 -t pubky:core .
docker run --network=host -it pubky:core
```

See [Homeserver Documentation](/explore/pubkycore/homeserver/) for configuration and deployment.

## Use Cases

### Social Applications
- Decentralized social networks ([Pubky App](/explore/pubky-apps/introduction/))
- Blogging platforms
- Comment systems
- Forums and communities

### Data Sovereignty
- Personal data stores
- Health records
- Document storage
- File sharing

### Identity & Authentication
- Decentralized identity ([Pubky Ring](/explore/technologies/pubky-ring/))
- Single sign-on for web3
- Credential management

### Payment Infrastructure
- Payment coordination ([Paykit](/explore/technologies/paykit/))
- Subscription management
- Decentralized commerce

## Target Users

**Pubky Core is made for:**
- Developers and builders of internet software products
- Startups building decentralized applications
- Open-source contributors
- Privacy-focused services

**[Pubky App](/explore/pubky-apps/introduction/) is made for:**
- Users interested in social media and online publishing
- People wanting control over their data
- Users seeking alternatives to Big Tech platforms

## Resources

### Documentation
- **Official Docs**: [pubky.github.io/pubky-core](https://pubky.github.io/pubky-core/)
- **Rust API Docs**: [docs.rs/pubky](https://docs.rs/pubky)
- **[SDK Guide](/explore/pubkycore/sdk/)**: Complete integration documentation
- **[API Reference](/explore/pubkycore/api/)**: HTTP API specification
- **Examples**: Rust and JavaScript tutorials in repository

### Repositories
- **Main Repository**: [github.com/pubky/pubky-core](https://github.com/pubky/pubky-core)
- **NPM Package**: [@synonymdev/pubky](https://www.npmjs.com/package/@synonymdev/pubky)

### Community
- **Telegram**: [t.me/pubkycore](https://t.me/pubkycore)
- **Contributors Guide**: See repository
- **License**: MIT

## Why Pubky Core?

### The Vision

The reward for everyone is a more open, privacy-focused, usable, modular, and secure web. 

For [Synonym](https://synonym.to/) as lead of this project, the goal is to:
- Disrupt Big Tech as an industry
- Gain user recognition through building a decentralized ecosystem
- Position as a major player in online publishing & social media
- Monetize through infrastructure services (similar to Google's search/aggregation model)
- Introduce users to bitcoin payment infrastructure

### Technical Advantages

**vs. Traditional Web Apps:**
- ✅ User controls data location
- ✅ No vendor lock-in
- ✅ Censorship resistant
- ✅ Privacy by default

**vs. Blockchain:**
- ✅ No transaction fees
- ✅ Instant operations
- ✅ Standard web tech
- ✅ Scalable storage

**vs. P2P Only:**
- ✅ Always available (Homeservers)
- ✅ Fast access
- ✅ Mobile-friendly
- ✅ Familiar HTTP APIs

## Current Status

**Production Ready:**
- ✅ Homeserver implementation stable
- ✅ Rust SDK mature
- ✅ JavaScript/WASM bindings stable
- ✅ Authentication system complete
- ✅ Event streaming SDK (SSE-based, single and multi-user)
- ✅ Multiple persistence backends

**Active Development:**
- 🚧 Mobile native bindings (iOS/Android)
- 🚧 [Paykit](/explore/technologies/paykit/) support
- 🚧 Replication and mirroring tools
- 🚧 Privacy features (encrypted data)

**Needs Community:**
- Mirroring and replication tools
- More Homeserver providers
- Application examples
- Integration libraries
- Documentation improvements

## Related Technologies

- **[Pubky Ring](/explore/technologies/pubky-ring/)**: Identity manager app
- **[Paykit](/explore/technologies/paykit/)**: Payment protocol (WIP)
- **[Pubky Noise](/explore/technologies/pubky-noise/)**: Encrypted communication (WIP)
- **[Pubky App](/explore/pubky-apps/introduction/)**: Social media application

---

**Pubky Core provides the foundation for building truly decentralized applications. Join us in creating a more open web!**
