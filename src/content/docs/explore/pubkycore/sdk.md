---
title: "Pubky SDK: Client Libraries for Decentralized Applications"
---

The Pubky SDK provides client libraries for building applications on [Pubky Core](/explore/pubkycore/introduction/). Available in multiple languages with consistent APIs across platforms.

## Supported Platforms

| Platform | Language | Status | Package |
|----------|----------|--------|---------|
| **Rust** | Rust | ✅ Stable | [crates.io/crates/pubky](https://crates.io/crates/pubky) |
| **Web/Node** | JavaScript/TypeScript | ✅ Stable | [@synonymdev/pubky](https://www.npmjs.com/package/@synonymdev/pubky) |
| **React Native** | JavaScript/TypeScript | ✅ Stable | [@synonymdev/react-native-pubky](https://www.npmjs.com/package/@synonymdev/react-native-pubky) |
| **iOS** | Swift | 🚧 Beta | Native bindings |
| **Android** | Kotlin | 🚧 Beta | Native bindings |

## Installation

### Rust

```bash
cargo add pubky
```

### JavaScript/TypeScript

```bash
npm install @synonymdev/pubky
# or
yarn add @synonymdev/pubky
```

### React Native

```bash
npm install @synonymdev/react-native-pubky
# or
yarn add @synonymdev/react-native-pubky
```

For iOS, also run:
```bash
cd ios && pod install
```

### iOS

The iOS SDK uses native Swift bindings generated via [UniFFI](https://mozilla.github.io/uniffi-rs/). You can either:

**Option 1: Use CocoaPods** (Recommended)
```ruby
pod 'PubkyCore'
```

**Option 2: Build from source**
```bash
# Clone the FFI repository
git clone https://github.com/pubky/pubky-core-ffi
cd pubky-core-ffi
./build.sh ios
```

The build generates:
- `bindings/ios/PubkyCore.xcframework` - Native framework
- `bindings/ios/pubkycore.swift` - Swift bindings

See [pubky-core-ffi](https://github.com/pubky/pubky-core-ffi) for detailed integration instructions.

### Android

The Android SDK uses native Kotlin bindings generated via [UniFFI](https://mozilla.github.io/uniffi-rs/).

**Build from source:**
```bash
# Clone the FFI repository
git clone https://github.com/pubky/pubky-core-ffi
cd pubky-core-ffi
./build.sh android
```

The build generates:
- `bindings/android/jniLibs/` - Native JNI libraries for all architectures
- `bindings/android/pubkycore.kt` - Kotlin bindings

Copy these to your Android project:
```bash
cp -r bindings/android/jniLibs/* app/src/main/jniLibs/
cp bindings/android/pubkycore.kt app/src/main/java/
```

See [pubky-core-ffi](https://github.com/pubky/pubky-core-ffi) for detailed integration instructions.

## Core Concepts

### Public-Key Identity

Every user is identified by an Ed25519 public key:
- 32-byte public key (encoded as z-base-32)
- Corresponds to a private key held securely by the user
- Forms the basis of authentication and data ownership

### Homeserver Discovery

The SDK uses [PKARR](/explore/pubkycore/pkarr/introduction/) to discover where a user's data is hosted:
1. Query [Mainline DHT](/explore/technologies/mainline-dht/) for public key
2. Retrieve PKARR record with Homeserver URL
3. Connect to Homeserver via HTTPS

### Storage Paths

Data is organized in a hierarchical namespace:
```
/pub/app_name/path/to/data    # Public, readable by anyone
/private/app_name/secret       # Private (future)
```

## API Reference

### Client Creation

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:init_client"
```

**JavaScript:**
```javascript snippet="snippets/js/src/init-client.ts:js_init_client"
```

### Sign Up (Create Account on Homeserver)

For gated homeservers, obtain a signup token via [Homegate](/explore/technologies/homegate/) first. Pass `None`/`null` only for open homeservers or local testnets.

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:signup"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_signup"
```

### Sign In (Existing User)

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:signin"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_signin"
```

### Store Data (PUT)

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:put"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_put"
```

### Retrieve Data (GET)

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:get"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_get"
```

### Delete Data (DELETE)

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:delete"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_delete"
```

### List Data (Pagination)

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:list"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_list"
```

### Public Read (Unauthenticated)

Read another user's public data without a session:

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:public_read"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_public_read"
```

## Authentication Flows

### Third-Party Authorization

Pubky Core supports OAuth-style authorization for third-party apps via the `pubkyauth://` protocol:

```rust snippet="snippets/rust/src/lib.rs:auth_flow"
```

See [Authentication](/explore/pubkycore/authentication/) for the full authentication flow.

## React Native Usage

The React Native SDK (`@synonymdev/react-native-pubky`) provides the same API as the JavaScript SDK with mobile-optimized bindings built using UniFFI.

### Basic Usage

```typescript snippet="snippets/react-native/src/basic-usage.ts:rn_basic_usage"
```

### Sign Up & Authentication

```typescript snippet="snippets/react-native/src/auth.ts:rn_auth"
```

### Data Operations

```typescript snippet="snippets/react-native/src/data-ops.ts:rn_data_ops"
```

### Key Management

```typescript snippet="snippets/react-native/src/key-management.ts:rn_key_management"
```

### HTTPS Resolution

```typescript snippet="snippets/react-native/src/resolve.ts:rn_resolve"
```

### Example: Complete Social Profile

```typescript snippet="snippets/react-native/src/social-profile.ts:rn_social_profile"
```

### Repository & Documentation

- **NPM**: [@synonymdev/react-native-pubky](https://www.npmjs.com/package/@synonymdev/react-native-pubky)
- **GitHub**: [github.com/pubky/react-native-pubky](https://github.com/pubky/react-native-pubky)
- **Examples**: [Example App](https://github.com/pubky/react-native-pubky/tree/main/example)

## Examples

### Simple Profile Storage

```javascript snippet="snippets/js/src/profile-storage.ts:js_profile_storage"
```

**Note**: This example follows the [pubky-app-specs](https://github.com/pubky/pubky-app-specs) data model specification for interoperability with Pubky App ecosystem.

### Social Feed Application

```rust snippet="snippets/rust/src/lib.rs:social_feed"
```

### Complete Examples

The repository includes comprehensive examples:

**JavaScript Examples:**
- [0-logging.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/0-logging.mjs) - Setup and logging
- [1-testnet.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/1-testnet.mjs) - Local testnet
- [2-signup.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/2-signup.mjs) - Identity creation
- [3-authenticator.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/3-authenticator.mjs) - Auth flow
- [4-storage.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/4-storage.mjs) - CRUD operations
- [5-request.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/5-request.mjs) - Authorization

**Rust Examples:**
- [0-logging](https://github.com/pubky/pubky-core/tree/main/examples/rust/0-logging) - Setup and logging
- [1-testnet](https://github.com/pubky/pubky-core/tree/main/examples/rust/1-testnet) - Local testnet
- [2-signup](https://github.com/pubky/pubky-core/tree/main/examples/rust/2-signup) - Identity creation
- [3-auth_flow](https://github.com/pubky/pubky-core/tree/main/examples/rust/3-auth_flow) - Complete auth
- [4-storage](https://github.com/pubky/pubky-core/tree/main/examples/rust/4-storage) - CRUD operations
- [5-request](https://github.com/pubky/pubky-core/tree/main/examples/rust/5-request) - Authorization
- [6-auth_flow_signup](https://github.com/pubky/pubky-core/tree/main/examples/rust/6-auth_flow_signup) - Full signup flow
- [7-events_stream](https://github.com/pubky/pubky-core/tree/main/examples/rust/7-events_stream) - SSE event streaming

## Testing

### Local Testnet

For development, run a local Homeserver:

```bash
# Clone repository
git clone https://github.com/pubky/pubky-core
cd pubky-core

# Run testnet
cargo run --bin pubky-testnet
```

Then connect your app to `http://localhost:15411`.

**JavaScript:**
```javascript snippet="snippets/js/src/testnet-client.ts:js_testnet_client"
```

### Unit Tests

**JavaScript:**
```bash
cd pubky-sdk/bindings/js
npm run testnet  # Start local server
npm test         # Run tests
```

**Rust:**
```bash
cd pubky-sdk
cargo test
```

## Advanced Features

### Event Streaming

The SDK provides a builder API for subscribing to real-time homeserver events via SSE. See [Event Streaming](/explore/pubkycore/api/#event-streaming) for the underlying HTTP endpoint.

**Rust — Single user:**
```rust snippet="snippets/rust/src/lib.rs:events_single_user"
```

**Rust — Multiple users on the same homeserver:**
```rust snippet="snippets/rust/src/lib.rs:events_multi_user"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_events"
```

**Builder options:**
- `.live()` — After historical events, keep streaming new events in real-time
- `.reverse()` — Deliver events newest-first (cannot combine with `live`)
- `.limit(n)` — Maximum events to receive before closing
- `.path("/pub/...")` — Filter events by path prefix
- `.add_users([(pubkey, cursor), ...])` — Subscribe to multiple users (up to 50)

**Key types:**
- `EventStreamBuilder` — Fluent builder for configuring subscriptions
- `Event` — A single event with `event_type`, `resource`, and `cursor`
- `EventCursor` — A `u64` identifier used for resuming streams from a position
- `EventType` — Either `Put` (with Blake3 `content_hash`) or `Delete`

See the [7-events_stream example](https://github.com/pubky/pubky-core/tree/main/examples/rust/7-events_stream) for a complete CLI tool.

### Session Management

Sessions are created via the `Signer` and provide scoped storage access:

```rust snippet="snippets/rust/src/lib.rs:session_management"
```

### Multiple Identities

```rust snippet="snippets/rust/src/lib.rs:multi_identity"
```

## Platform-Specific Notes

### iOS Integration

```swift
import PubkySDK

let client = PubkyClient()
let keypair = try await client.signUp()
print("Public Key: \(keypair.publicKey)")

try await client.put(
    path: "/pub/myapp/data",
    data: jsonData
)
```

### Android Integration

```kotlin
import pubky.PubkyClient

val client = PubkyClient()
val keypair = client.signUp()
println("Public Key: ${keypair.publicKey}")

client.put(
    path = "/pub/myapp/data",
    data = jsonData
)
```

## Error Handling

**Rust:**
```rust snippet="snippets/rust/src/lib.rs:error_handling"
```

**JavaScript:**
```javascript snippet="snippets/js/src/sdk.ts:js_error_handling"
```

## Best Practices

1. **Secure Key Storage**: Never store private keys in plaintext
   - iOS: Use Keychain Services
   - Android: Use EncryptedSharedPreferences
   - Web: Use secure storage APIs or [Pubky Ring](/explore/technologies/pubky-ring/)

2. **Session Management**: Use time-limited sessions, refresh regularly

3. **Error Handling**: Always handle network errors and retries

4. **Rate Limiting**: Respect Homeserver rate limits

5. **Data Validation**: Validate data before storing and after retrieving

6. **Namespacing**: Use consistent path structures per application

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

---

**The Pubky SDK makes it easy to build decentralized applications with standard web technologies.**
