---
title: "Pubky SDK: Client Libraries for Decentralized Applications"
---

The Pubky SDK provides client libraries for building applications on [Pubky Core](/explore/pubkycore/introduction). It handles the hard parts (key-based auth, homeserver discovery, transport) so you can focus on your app logic using familiar HTTP-style operations. Available for Rust, JavaScript/TypeScript, React Native, iOS, and Android with a consistent API across platforms.

This page is an API reference for developers integrating the SDK. It covers every actor (object) the SDK exposes, their methods, and code snippets in Rust and JavaScript. For a hands-on walkthrough, see the [Developer Guide](/explore/pubkycore/getting-started/). 

New to Pubky? Start with the [Introduction](/explore/pubkycore/introduction/) for background on identities, homeservers, and storage paths.

## Supported Platforms

| Platform | Language | Status | Package |
|----------|----------|--------|---------|
| **Rust** | Rust | ✅ Stable | [crates.io/crates/pubky](https://crates.io/crates/pubky) |
| **Web/Node** | JavaScript/TypeScript | ✅ Stable | [@synonymdev/pubky](https://www.npmjs.com/package/@synonymdev/pubky) |
| **React Native** | JavaScript/TypeScript | ✅ Stable | [@synonymdev/react-native-pubky](https://www.npmjs.com/package/@synonymdev/react-native-pubky) |
| **iOS** | Swift | 🚧 Beta | [pubky-core-ffi](https://github.com/pubky/pubky-core-ffi) |
| **Android** | Kotlin | 🚧 Beta | [pubky-core-ffi](https://github.com/pubky/pubky-core-ffi) |

## API Reference

### Pubky (Entry Point)

Your main handle to the SDK. Create one at startup and share it across your app. It holds the HTTP client and connection pool so you need only a single instances.

| Method | Description |
|--------|-------------|
| `new()` | Create with mainnet defaults. This is the starting point for most apps. |
| `testnet()` | Create pre-configured for a local testnet — handy for development without touching the real DHT. |
| `with_client(client)` | Bring your own `PubkyHttpClient` if you need custom timeouts, relays, or TLS settings. |
| `signer(keypair)` | Wrap a keypair into a `PubkySigner` so you can sign up, sign in, or approve auth requests. |
| `public_storage()` | Get a `PublicStorage` handle for reading anyone's public data — no keys or session needed. |
| `pkdns()` | Get a read-only `Pkdns` actor for resolving `_pubky` records. If you need to publish, use `signer.pkdns()` instead. |
| `get_homeserver_of(pubkey)` | Quick lookup: where does this user's data live? Returns the homeserver's public key via PKARR, or `None` if unresolvable. |
| `event_stream_for_user(user, cursor)` | Subscribe to one user's events. Resolves their homeserver automatically — simplest way to get started with event streaming. |
| `event_stream_for(homeserver)` | Subscribe to events on a known homeserver. Use this for multi-user subscriptions to avoid redundant PKARR lookups. |
| `start_grant_auth_flow(caps, kind, client_id)` | Kick off a grant+PoP auth flow (QR/deeplink). This is the modern auth path — prefer it over cookie flows. |
| `start_cookie_auth_flow(caps, kind)` | Start a legacy cookie auth flow. **Deprecated** — use `start_grant_auth_flow` for new code. |
| `resume_cookie_auth_flow(url)` | Reconnect to an in-progress cookie auth flow after a page refresh. Only works within the relay's ~5-minute TTL. |
| `session_from_file(path)` | Restore a session from a `.sess` secret file on disk. Great for long-running scripts that restart. Native only. |
| `restore_session(token)` | Restore a session from an exported secret string. Works with both grant and cookie tokens — the SDK auto-detects. |
| `signer_from_recovery_file(path, passphrase)` | Decrypt a `.pkarr` recovery file and get back a usable `PubkySigner`. Native only. |
| `client()` | Access the underlying `PubkyHttpClient` directly — you rarely need this unless you're doing something custom. |

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:init_client"
```

**JavaScript:**
```javascript snippet="snippets/js/src/init-client.ts:js_init_client"
```

### PubkySigner (Key Holder)

Holds your private key and knows how to prove identity. You'll use this to create accounts, sign in, and approve auth requests from other apps.

| Method | Description |
|--------|-------------|
| `new(keypair)` | Create a standalone signer (spins up its own client). Usually you'll use `pubky.signer(keypair)` instead to share the client. |
| `public_key()` | Your public key — the identity other users see. |
| `keypair()` | Borrow the full keypair. Be careful with this; the private key should never leave secure storage. |
| `signup(homeserver, token?)` | Create your account on a homeserver and publish your PKDNS record so others can find you. Pass a signup token if the homeserver uses Homegate; `None` for open homeservers. |
| `signin(client_id)` | Sign in and get a session. Returns fast because PKDNS refresh happens in the background. **This is what most apps should use.** |
| `signin_blocking(client_id)` | Same as `signin`, but waits ~3-5s for PKDNS to be fully discoverable. Use this when you need other users to find you immediately after sign-in. |
| `signup_cookie(homeserver, token?)` | Legacy cookie signup. **Deprecated** — use `signup()` + `signin()` instead. |
| `signin_cookie()` | Legacy cookie signin. **Deprecated** — use `signin()` instead. |
| `approve_auth(pubkyauth_url)` | Approve a `pubkyauth://` QR code or deeplink. This is the authenticator side (e.g. Pubky Ring scanning a QR from a third-party app). |
| `handle_deeplink(pubkyauth_url)` | Like `approve_auth`, but also handles `direct_signup` links. Use this as a catch-all for incoming `pubkyauth://` URLs. |
| `pkdns()` | Get a `Pkdns` actor that can both read and publish records, bound to this signer's keypair. |


#### Sign Up

For gated homeservers, obtain a signup token first. Pass `None`/`null` only for open homeservers or local testnets.

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:signup"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_signup"
```

#### Sign In

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:signin"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_signin"
```

#### Fast vs Blocking Sign In

`signin()` returns quickly by refreshing PKDNS in the background. `signinBlocking()` waits until the user's homeserver is discoverable via PKDNS (~3-5s), which is useful when you need immediate resolvability after sign-in:

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:signin_blocking"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_signin_blocking"
```

#### Third-Party Authorization

Pubky Core supports OAuth-style authorization for third-party apps via the `pubkyauth://` protocol:

```rust snippet="snippets/rust/src/lib.rs:auth_flow"
```

See [Authentication](/explore/pubkycore/authentication/) for the full authentication flow.

#### Resuming an Auth Flow

If the app loses the flow object before the user approves (page refresh, app restart), pass the original `authorizationUrl` back to reconnect. See [Authentication](/explore/pubkycore/authentication/) for details on the relay retention window and security considerations.

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:auth_flow_resume"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_auth_flow_resume"
```

### PubkySession (Authenticated Handle)

Once you're signed in, this is your "logged in" handle. It carries your credentials and gives you access to storage. Cheap to clone, thread-safe, and shareable across tasks.

| Method | Description |
|--------|-------------|
| `info()` | Get your session's `SessionInfo` — your public key and what capabilities this session has. |
| `public_key()` | Shorthand for `info().public_key()`. Handy when you just need to know who you are. |
| `client()` | The raw HTTP client without any credential injection. You almost always want `storage()` instead. |
| `storage()` | Get a `SessionStorage` handle for reading and writing your data. This is where the action happens. |
| `revalidate()` | Ask the homeserver "is my session still good?" Returns `Some(info)` if valid, `None` if expired or revoked. Useful for health checks. |
| `signout()` | Invalidate your session on the server. On success the session is consumed (gone). On failure you get it back with the error so you can retry. |
| `as_grant()` | Downcast to `GrantSessionView` for grant-specific operations. Returns `None` if this is a cookie session. |
| `as_cookie()` | Downcast to `CookieSessionView` for cookie-specific operations. Returns `None` if this is a grant session. |

#### Session Basics

```rust snippet="snippets/rust/src/lib.rs:session_management"
```

#### Session Persistence

Export a session to a portable string (e.g. save to disk) so it survives process restarts. On restart, restore the session without repeating the full auth flow:

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:session_persistence"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_session_persistence"
```

#### Multiple Identities

```rust snippet="snippets/rust/src/lib.rs:multi_identity"
```

#### GrantSessionView

Grant-specific operations you won't need unless you're managing session persistence or building admin tooling. Access via `session.as_grant()`.

| Method | Description |
|--------|-------------|
| `session_info()` | Full grant metadata — grant_id, client_id, when the token and grant expire. |
| `export_local_secret()` | Export a portable secret string you can save and restore this session later. Returns `None` for browser-held delegated keys (those are intentionally non-extractable). |
| `current_bearer()` | The current opaque bearer token. Mostly useful for debugging. |
| `grant_id()` | The grant's unique ID — use this if you need to revoke it via `GrantManager`. |

#### CookieSessionView

Legacy cookie sessions. If you're building new code, you're probably using grants instead. Access via `session.as_cookie()`.

| Method | Description |
|--------|-------------|
| `session_info()` | The full `CookieSessionRecord` with cookie-specific fields like `created_at`. |
| `export()` | Export public metadata (no secrets) so you can rehydrate the session handle after a tab refresh. |
| `export_secret()` | Export a `<pubkey>:<cookie>` secret string for restoring the session from scratch. Returns `None` in browser WASM where the cookie jar is opaque. |
| `write_secret_file(path)` | Save the session secret to a `.sess` file on disk with `0600` permissions. Native only — great for CLI tools and scripts. |

### SessionStorage (Authenticated Read/Write)

Your authenticated storage handle. Just pass a path like `"/pub/myapp/data"` — the SDK resolves the homeserver, picks the right transport, and attaches credentials automatically. See the [Homeserver API](/explore/pubkycore/api/) if you need the raw HTTP endpoints.

| Method | Description |
|--------|-------------|
| `get(path)` | Fetch data at a path. Returns a `Response` — call `.text()`, `.bytes()`, or `.json()` on it. |
| `get_json::<T>(path)` | Fetch and deserialize as JSON in one step. Requires the `json` feature flag. |
| `put(path, body)` | Write data. Body can be `&str`, `Vec<u8>`, `String`, or anything that converts to a request body. |
| `put_json(path, &value)` | Serialize and write as JSON. Requires the `json` feature flag. |
| `delete(path)` | Remove data at a path. |
| `exists(path)` | Quick check: does this path exist? Uses a lightweight HEAD request under the hood. |
| `stats(path)` | Get metadata (size, MIME type, ETag, last-modified) without downloading the body. Returns `None` if the resource doesn't exist. |
| `list(path)` | Start building a directory listing query. Returns a `ListBuilder` you can chain options on. **Path must end with `/`** or you'll get a validation error. |
| `public()` | Switch to an unauthenticated `PublicStorage` using the same client. Useful when your session code also needs to read other users' data. |

#### Store Data (PUT)

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:put"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_put"
```

#### Retrieve Data (GET)

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:get"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_get"
```

#### Delete Data (DELETE)

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:delete"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_delete"
```

#### List Data

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:list"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_list"
```

#### Check Resource (Exists & Metadata)

Check if data at a given storage path exists, or retrieve its metadata (size, MIME type, ETag for cache validation) without downloading the body:

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:check_resource"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_check_resource"
```

### PublicStorage (Unauthenticated Read-Only)

Read anyone's public data without signing in. Addresses include the user's public key so the SDK knows which homeserver to hit.

| Method | Description |
|--------|-------------|
| `get(addr)` | Fetch another user's public data. |
| `get_json::<T>(addr)` | Fetch and deserialize as JSON. Requires the `json` feature flag. |
| `exists(addr)` | Check if a public resource exists. |
| `stats(addr)` | Get metadata without downloading the body. |
| `list(addr)` | List a public directory. Address must end with `/`. |

Addresses are flexible — you can pass a tuple `(&PublicKey, "/pub/path")`, a string `"<z32_pubkey>/pub/path"`, or a full URL `"pubky://<z32>/pub/path"`.

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:public_read"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_public_read"
```

### ListBuilder (Pagination)

Chain options onto a `list()` call, then `.send()` to execute. All options are optional — calling `.send()` with no options gives you the default listing.

| Method | Description |
|--------|-------------|
| `reverse(bool)` | List newest entries first. Handy for feeds and timelines. |
| `shallow(bool)` | Only list direct children, don't recurse into subdirectories. |
| `limit(u16)` | Cap the number of entries returned. The homeserver may also impose its own limit. |
| `cursor(&str)` | Resume where you left off — pass the cursor from your previous listing for pagination. |
| `send()` | Fire the request and get back a `Vec<PubkyResource>`. |

### EventStreamBuilder (Subscriptions)

Subscribe to real-time events from a homeserver via SSE. Build up your query with chained options, then call `.subscribe()` to start receiving events. See [Event Streaming](/explore/pubkycore/api/#event-streaming) for the underlying HTTP endpoint.

| Method | Description |
|--------|-------------|
| `live()` | After catching up on historical events, keep the connection open for real-time updates. This is what you want for live feeds. |
| `reverse()` | Get events newest-first. Cannot be combined with `live()` (pick one or the other). |
| `limit(u64)` | Stop after receiving this many events. Useful for "give me the last N events" queries. |
| `path(prefix)` | Only receive events for paths starting with this prefix (e.g. `"/pub/"` to skip private data). |
| `add_users([(pubkey, cursor), ...])` | Watch multiple users on the same homeserver (up to 50). Each user can have its own resume cursor. |
| `subscribe()` | Open the SSE connection and return an async `Stream` of `Event` results. |

Each event has an `event_type` (`Put` with a `content_hash`, or `Delete`), a `resource` (the `PubkyResource` that changed), and a `cursor` (a `u64` you can save to resume later).

**Rust — Single user:**
```rust snippet="snippets/rust/src/lib.rs:events_single_user"
```

**Rust — Multiple users on the same homeserver:**
```rust snippet="snippets/rust/src/lib.rs:events_multi_user"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_events"
```

See the [7-events_stream example](https://github.com/pubky/pubky-core/tree/main/examples/rust/7-events_stream) for a complete CLI tool.

### Pkdns (Discovery)

Resolve and publish `_pubky` PKARR records — this is how users advertise which homeserver hosts their data. Read-only by default; attach a keypair to enable publishing.

| Method | Description |
|--------|-------------|
| `new()` | Create a read-only instance. Good for lookups when you don't need to publish anything. |
| `new_with_keypair(keypair)` | Create an instance that can publish records. You can also get one via `signer.pkdns()`. |
| `set_stale_after(duration)` | Control how old a record can be before `publish_homeserver_if_stale` considers it worth refreshing. Default is 1 hour. |
| `get_homeserver_of(pubkey)` | Look up any user's homeserver. Returns `None` if no record exists or the target is a domain-only entry. |
| `get_homeserver()` | Look up *your own* homeserver. Requires a keypair — errors if you created a read-only instance. |
| `publish_homeserver_if_stale(host?)` | Republish your `_pubky` record only if it's getting old. This is what `signin()` calls in the background to keep you discoverable. |
| `publish_homeserver_force(host?)` | Republish right now, regardless of age. `signup()` uses this. If `host` is `None`, reuses whatever host is already in the record. |

### GrantManager (Permissions)

Admin-level grant management. Requires a session with root capability — non-root sessions get `403 Forbidden`.

| Method | Description |
|--------|-------------|
| `new(session)` | Create from a root-capability session. |
| `list()` | See all active grants for your account — useful for an account settings / "connected apps" page. |
| `revoke(grant_id)` | Revoke a specific grant and kill all its sessions. The nuclear option for disconnecting a misbehaving app. |

### ResourceStats (Metadata)

What you get back from `stats()` — metadata about a stored resource without downloading its body.

| Field | Type | Description |
|-------|------|-------------|
| `content_length` | `Option<u64>` | File size in bytes. `None` if the server didn't send it. |
| `content_type` | `Option<String>` | MIME type (e.g. `"application/json"`). |
| `last_modified` | `Option<SystemTime>` | When the resource was last written. |
| `etag` | `Option<String>` | Cache validation tag — compare with a previous value to detect changes without re-downloading. |

### Capabilities (Permissions)

Define what a session or auth flow is allowed to do. Root gives full access; scoped capabilities restrict to specific paths and operations.

```rust
use pubky::{Capabilities, Capability};

// Root (full access) — use for your own signin
let root = Capabilities::builder().cap(Capability::root()).finish();

// Scoped write — use for third-party app auth flows
let scoped = Capabilities::builder()
    .write("/pub/myapp/")
    .unwrap()
    .finish();
```

## React Native

The React Native SDK ([`@synonymdev/react-native-pubky`](https://www.npmjs.com/package/@synonymdev/react-native-pubky)) exposes the same API as the JavaScript SDK with mobile-optimized UniFFI bindings. See the [GitHub repo](https://github.com/pubky/react-native-pubky) and [example app](https://github.com/pubky/react-native-pubky/tree/main/example) for integration guides and usage patterns.

## Examples

See the [examples directory](https://github.com/pubky/pubky-core/tree/main/examples) in the pubky-core repository for full JavaScript and Rust examples covering logging, testnet setup, signup, auth flows, CRUD operations, and event streaming.

### Simple Profile Storage

```javascript snippet="snippets/js/src/profile-storage.ts:js_profile_storage"
```

**Note**: This example follows the [pubky-app-specs](https://github.com/pubky/pubky-app-specs) data model specification for interoperability with the pubky.app ecosystem.

### Social Feed Application

```rust snippet="snippets/rust/src/lib.rs:social_feed"
```

## Error Handling

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:error_handling"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_error_handling"
```

## Resources

- **Rust API Docs**: [docs.rs/pubky](https://docs.rs/pubky)
- **Repository**: [github.com/pubky/pubky-core](https://github.com/pubky/pubky-core)
- **NPM Package**: [@synonymdev/pubky](https://www.npmjs.com/package/@synonymdev/pubky)
- **React Native Package**: [@synonymdev/react-native-pubky](https://www.npmjs.com/package/@synonymdev/react-native-pubky)
- **React Native Repository**: [github.com/pubky/react-native-pubky](https://github.com/pubky/react-native-pubky)
- **iOS/Android FFI**: [github.com/pubky/pubky-core-ffi](https://github.com/pubky/pubky-core-ffi) - Native bindings via UniFFI
- **Examples**: [github.com/pubky/pubky-core/tree/main/examples](https://github.com/pubky/pubky-core/tree/main/examples)
- **[Pubky Core Overview](/explore/pubkycore/introduction/)**: Main documentation
- **[API Reference](/explore/pubkycore/api/)**: HTTP API specification

