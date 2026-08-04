---
title: "Pubky SDK: Client Libraries for Decentralized Applications"
---

The Pubky SDK provides client libraries for building applications on [Pubky Core](/explore/pubkycore/introduction). It handles the hard parts (key-based auth, homeserver discovery, transport) so you can focus on your app logic using familiar HTTP-style operations.

New to Pubky? Start with the [Introduction](/explore/pubkycore/introduction) for background on identities, homeservers, and storage paths. For a hands-on walkthrough, see the [Developer Guide](/explore/pubkycore/getting-started/).

## Supported Platforms

| Platform | Language | Status | Package |
|----------|----------|--------|---------|
| **Rust** | Rust | ✅ Stable | [crates.io/crates/pubky](https://crates.io/crates/pubky) |
| **Web/Node** | JavaScript/TypeScript | ✅ Stable | [@synonymdev/pubky](https://www.npmjs.com/package/@synonymdev/pubky) |
| **React Native** | JavaScript/TypeScript | ✅ Stable | [@synonymdev/react-native-pubky](https://www.npmjs.com/package/@synonymdev/react-native-pubky) |
| **iOS** | Swift | 🚧 Beta | [pubky-core-ffi](https://github.com/pubky/pubky-core-ffi) |
| **Android** | Kotlin | 🚧 Beta | [pubky-core-ffi](https://github.com/pubky/pubky-core-ffi) |

All platforms share a consistent API surface. The React Native SDK uses mobile-optimized UniFFI bindings but exposes the same API as the JavaScript SDK.

## API Reference

- **Rust**: [docs.rs/pubky](https://docs.rs/pubky)
- **JavaScript/TypeScript**: [TypeDoc Reference](https://pubky.github.io/pubky-core/js-sdk-typedoc/)
- **HTTP API**: [Endpoint specification](/explore/pubkycore/api/)

## How It Works

The SDK is organized around a small set of actors that mirror the developer workflow:

1. **Pubky** — Your entry point. Create one at startup and share it across your app. It holds the HTTP client, connection pool, and provides access to everything else.

2. **PubkySigner** — Holds a private key and proves identity. Use it to sign up for a homeserver, sign in, or approve auth requests from other apps.

3. **PubkySession** — Your authenticated handle after signing in. Thread-safe, cheap to clone, and carries your credentials. Supports export/restore for surviving process restarts.

4. **SessionStorage** — Read and write your data with simple path-based operations (`get`, `put`, `delete`, `list`). The SDK resolves homeservers and attaches credentials automatically.

5. **PublicStorage** — Read anyone's public data without signing in. No keys or session needed.

For event-driven apps, **EventStreamBuilder** lets you subscribe to real-time changes via SSE. **Pkdns** handles discovery of users' homeservers via PKARR records. **GrantManager** provides admin-level permission management.

## Quick Example

Sign in and read/write data. Account creation (signup) is generally handled outside of your app. See the [Developer Guide](/explore/pubkycore/getting-started/) for testnet setup where you bootstrap accounts for development.

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:rust_quick_example"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_quick_example"
```

## Resources

- **Repository**: [github.com/pubky/pubky-core](https://github.com/pubky/pubky-core)
- **Examples**: [Full working examples](https://github.com/pubky/pubky-core/tree/main/examples) covering testnet setup, signup, auth flows, CRUD operations, and event streaming
