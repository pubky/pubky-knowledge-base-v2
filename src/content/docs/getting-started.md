---
title: "Getting Started"
---

Welcome to Pubky! This guide will help you get started whether you're a user looking to try decentralized social media or a developer building on the Pubky protocol.

```mermaid
flowchart TD
    Start[Want to use Pubky?] --> Q1{Are you a developer?}
    Q1 -->|Yes| Dev[Install SDK]
    Q1 -->|No| User[Download Pubky Ring]
    Dev --> DevStack[Run Pubky Docker]
    DevStack --> DevBuild[Build Your App]
    DevBuild --> DevDeploy[Deploy to Production]
    User --> UserCreate[Create Identity]
    UserCreate --> UserApp[Try pubky.app]
    UserApp --> UserExplore[Explore Your Data]
```

---

## For Users: Experience Decentralized Social Media

### Step 1: Download Pubky Ring

**[Pubky Ring](/explore/technologies/pubky-ring/)** is your key manager for the Pubky ecosystem. It securely stores your identity and authorizes apps.

- **iOS**: Download from the App Store
- **Android**: Download from Google Play

🔗 [Official Repository](https://github.com/pubky/pubky-ring)

### Step 2: Create Your First Pubky (Identity)

1. Open Pubky Ring
2. Follow the onboarding flow to generate your key pair
3. **Save your recovery phrase securely** - this is your master backup
4. Your public key (pubky) is now your permanent identity!

**Important**: Your pubky looks like: `z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty`

### Step 3: Try Pubky App

Visit **[pubky.app](https://pubky.app)** - a decentralized social media platform built on Pubky.

1. Click "Sign In" or "Create Account"
2. Authorize Pubky App through Pubky Ring
3. Create your profile
4. Start posting, following, and exploring!

**What makes it different:**
- You own your data (stored on Homeservers)
- No algorithm controls your feed
- You can switch to different apps without losing your content
- True censorship resistance

### Step 4: Explore Your Data

Use **[Pubky Explorer](/explore/technologies/pubky-explorer/)** ([explorer.pubky.app](https://explorer.pubky.app)) to browse your data:

1. Enter your pubky or navigate to a path
2. Browse your files and directories
3. See exactly what data you've published
4. Share direct links to your public data

**Example paths:**
- `pubky://your-key/pub/pubky.app/profile.json` - Your profile
- `pubky://your-key/pub/pubky.app/posts/` - Your posts directory

### Next Steps for Users

- **Join the community**: [Telegram](https://t.me/pubkycore)
- **Learn more**: Read the [FAQ](/faq/)
- **Understand the tech**: Check out [ELI5: Pubky Core](/explore/pubkycore/eli5/)
- **Explore concepts**: Learn about [Semantic Social Graph](/explore/concepts/semantic-social-graph/)

---

## For Developers: Build on Pubky

### Step 1: Install the SDK

Choose your platform and install the [Pubky SDK](/explore/pubkycore/sdk/):

**Rust:**
```bash
cargo add pubky
```

**JavaScript/TypeScript (Web & Node.js):**
```bash
npm install @synonymdev/pubky
# or
yarn add @synonymdev/pubky
```

**React Native:**
```bash
npm install @synonymdev/react-native-pubky
cd ios && pod install  # iOS only
```

**iOS/Android Native**: See [SDK Documentation](/explore/pubkycore/sdk/) for UniFFI bindings via `pubky-core-ffi`.

📚 **Resources:**
- [Rust API Docs](https://docs.rs/pubky)
- [NPM Package](https://www.npmjs.com/package/@synonymdev/pubky)
- [Official Docs](https://pubky.github.io/pubky-core/)

### Step 2: Run Local Development Stack

Use **[Pubky Docker](/explore/technologies/pubky-docker/)** to run the complete Pubky ecosystem locally:

```bash
# Clone the repository
git clone https://github.com/pubky/pubky-docker
cd pubky-docker

# Configure environment (testnet recommended for development)
cp .env.example .env
# Edit .env to set ENVIRONMENT=testnet

# Start the stack
docker compose up -d
```

This gives you:
- PKARR relay (port 6881)
- Homeserver with PostgreSQL (port 4173)
- Pubky Nexus with Neo4j & Redis (port 8000)
- Pubky App frontend (port 5173)

**Alternative**: Run just a Homeserver:
```bash
git clone https://github.com/pubky/pubky-core
cd pubky-core/pubky-homeserver
cargo run
```

### Step 3: Build Your First App

**Quick Example (JavaScript):**

```javascript
import { Pubky, Keypair } from '@synonymdev/pubky';

// Create client and signer
const pubky = new Pubky();
const signer = pubky.signer(Keypair.random());

// Sign up (pass signup token for gated homeservers, null for open/testnet)
const session = await signer.signup(homeserverPk, null);
console.log('Your pubky:', signer.publicKey.z32());

// Store data
await session.storage.putJson('/pub/myapp/profile', {
  name: "Alice",
  bio: "Building on Pubky!",
  avatar: "https://example.com/avatar.jpg"
});

// Retrieve data
const profile = await session.storage.getJson('/pub/myapp/profile');
console.log('Profile:', profile);

// List directory
const files = await session.storage.list('/pub/myapp/');
console.log('Files:', files);

// Sign out
await session.signout();
```

**Key concepts:**
- Data is stored per public key on Homeservers
- Path structure: `/pub/app-name/path` for public data
- All operations use standard HTTP/HTTPS
- Authentication via cryptographic signatures

📖 **Full SDK guide**: [SDK Documentation](/explore/pubkycore/sdk/)

### Step 4: Explore Example Apps

Learn from working examples:

**Social App (Pubky App Specs):**
- [pubky-app-specs](https://github.com/pubky/pubky-app-specs) - Data models for social features
- [npm: pubky-app-specs](https://www.npmjs.com/package/pubky-app-specs) - Validation schemas

**CLI Tool:**
- [Pubky CLI](/explore/technologies/pubky-cli/) - Reference implementation for user/admin operations
- [Source](https://github.com/pubky/pubky-cli)

**Simple Examples:**
- [pubky-core/examples](https://github.com/pubky/pubky-core/tree/main/examples) - Rust examples
- Authentication flows
- Data storage patterns

### Step 5: Integrate Advanced Features

**Use Pubky Nexus for Social Features:**

If building a social app, leverage [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) for:
- Real-time feeds and timelines
- Search and discovery
- User recommendations
- Notifications

```javascript
// Query Nexus API
const response = await fetch('https://nexus.pubky.app/v0/feeds/global');
const posts = await response.json();
```

📊 [Nexus API Docs](https://nexus.pubky.app/swagger-ui/)

**Add Payments (WIP):**

[Paykit](/explore/technologies/paykit/) protocol (work in progress) will enable:
- Payment discovery via public keys
- Bitcoin/Lightning integration
- Subscriptions and monetization

**Add Encryption (WIP):**

[Pubky Noise](/explore/technologies/pubky-noise/) (work in progress) provides:
- Encrypted peer-to-peer channels
- Private messaging
- Secure data sharing

### Step 6: Deploy to Production

**Deploy a Homeserver:**

1. Set up a server (VPS, cloud, or self-hosted)
2. Configure HTTPS (required)
3. Deploy Homeserver:
   ```bash
   docker build --build-arg TARGETARCH=x86_64 -t pubky:core .
   docker run --network=host -it pubky:core
   ```
4. Publish Homeserver location to PKARR
5. Configure rate limiting and moderation

📘 **Guide**: [Homeserver Documentation](/explore/pubkycore/homeserver/)

**Signup Verification:**

Use [Homegate](/explore/technologies/homegate/) to prevent spam:
- SMS verification (rate-limited per phone)
- Lightning payment verification
- Open-source and self-hostable

**DNS Resolution:**

Run a [PKDNS](/explore/technologies/pkdns/) server for your users:
- Resolves public-key domains
- Supports traditional DNS
- DoH/DoT encryption

### Next Steps for Developers

- **Read the docs**: [Pubky Core Overview](/explore/pubkycore/introduction/)
- **Study the architecture**: [Architecture Overview](/architecture/)
- **Join the community**: [Telegram](https://t.me/pubkycore)
- **Check the FAQ**: [FAQ](/faq/)
- **Review comparisons**: [Comparisons](/comparisons/) with other protocols
- **Troubleshooting**: [Troubleshooting](/troubleshooting/) guide

---

## Common First Questions

**Q: Do users need to download Pubky Ring to use my app?**
A: Currently yes for secure key management, though apps can implement their own key storage. Pubky Ring provides the best UX for multi-app identity.

**Q: Can I use Pubky without running my own Homeserver?**
A: Yes! Users can choose any public Homeserver provider. You can host your own or use existing providers.

**Q: Is Pubky compatible with Nostr/Bluesky/etc?**
A: Not directly. Pubky uses a different architecture (Homeservers + PKARR vs relays/PDSs). See [Comparisons](/comparisons/) for details.

**Q: How do I handle user authentication?**
A: The SDK handles it automatically via signature-based auth. No passwords, OAuth, or tokens needed. See [Authentication](/explore/pubkycore/authentication/).

**Q: Can I build private apps?**
A: Currently Pubky is optimized for public data. Private/encrypted features are coming via [Pubky Noise](/explore/technologies/pubky-noise/).

**Q: How do I make money?**
A: Several models work: Homeserver hosting, indexing services (like Nexus), premium features, or payments via [Paykit](/explore/technologies/paykit/) (WIP).

---

## Resources

### Documentation
- **[Main Documentation](/)**: Complete knowledge base
- **[Glossary](/glossary/)**: Quick term reference
- **[FAQ](/faq/)**: 63+ questions answered
- **[TLDR](/tldr/)**: 30-second overview

### Technical
- **[API Reference](/explore/pubkycore/api/)**: HTTP API spec
- **[SDK Guide](/explore/pubkycore/sdk/)**: Client library docs
- **[Rust Docs](https://docs.rs/pubky)**: Rust crate documentation
- **[Official Docs](https://pubky.github.io/pubky-core/)**: Protocol specification

### Tools
- **[Pubky Docker](/explore/technologies/pubky-docker/)**: Local development stack
- **[Pubky CLI](/explore/technologies/pubky-cli/)**: Command-line interface
- **[Pubky Explorer](/explore/technologies/pubky-explorer/)**: Data browser

### Community
- **Telegram**: [t.me/pubkycore](https://t.me/pubkycore)
- **GitHub**: [github.com/pubky](https://github.com/pubky)
- **Live App**: [pubky.app](https://pubky.app)

---

**Ready to build the decentralized web? Start with the [SDK](/explore/pubkycore/sdk/)!**

