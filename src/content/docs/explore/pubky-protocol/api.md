---
title: "Pubky Homeserver API Reference"
---

The [Pubky protocol](/explore/pubky-protocol/introduction/) defines a RESTful HTTP API for storing and retrieving data on [Homeservers](/explore/pubky-protocol/homeserver/). This page provides a practical overview of the raw HTTP API.

The [client OpenAPI specification](https://github.com/pubky/pubky-core/blob/main/pubky-homeserver/openapi-client.yml) and [admin OpenAPI specification](https://github.com/pubky/pubky-core/blob/main/pubky-homeserver/openapi-admin.yml) are the maintained references for routes and schemas. Consult the server implementation for behavior not captured by those specifications.

## Base URL

All API endpoints are relative to the Homeserver base URL:

```
https://homeserver.example.com
```

Homeserver URLs are discovered via [PKARR](/explore/pubky-protocol/pkarr/introduction/) records published to the [Mainline DHT](/explore/technologies/mainline-dht/).

When you build with the [SDK](/explore/pubky-protocol/sdk/), it handles PKARR lookup, transport selection, authentication, and the `pubky-host` header for HTTPS Homeserver requests. Use the raw HTTP API directly only when you are writing low-level integrations or server components that intentionally bypass the SDK helpers.

## Authentication

See [Authentication](/explore/pubky-protocol/authentication/) for conceptual overview.

### Grant Authentication

Applications receive a user-signed grant bound to an app-specific proof-of-possession (PoP) key. The grant and a PoP proof are exchanged at `/auth/grant/session` for a short-lived bearer token. The SDK handles this exchange and refreshes bearer tokens automatically.

Authenticated requests use the bearer token:

```http
GET /pub/myapp/data
Authorization: Bearer <token>
```

### Grant Endpoints

Both grant signup and session exchange accept a user-signed grant and a client-signed PoP proof:

```json
{
  "grant": "<compact grant JWS>",
  "pop": "<compact PoP JWS>"
}
```

| Method | Path | Authentication | Success | Purpose |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/grant/signup` | Grant and PoP request body | `204 No Content` | Create an account without creating a session |
| `POST` | `/auth/grant/session` | Grant and PoP request body | `200 OK` | Exchange a grant for a short-lived bearer token and session metadata |
| `GET` | `/auth/grant/session` | Grant bearer | `200 OK` | Inspect the current grant-backed session |
| `DELETE` | `/auth/grant/session` | Optional grant bearer | `200 OK` | Idempotently revoke the current session's backing grant and every session issued from it |
| `GET` | `/auth/grant/sessions` | Grant bearer with exact `/:rw` capability | `200 OK` | List the user's active grants |
| `DELETE` | `/auth/grant/session/{gid}` | Grant bearer with exact `/:rw` capability | `200 OK` | Revoke an owned grant and every session issued from it |

Grant signup is one-shot and sessionless. Its grant must use client ID `pubky.signup`, include the exact root capability `/:rw`, have a lifetime of at most five minutes, and include a fresh PoP proof. A grant missing the root capability is rejected with `403 Forbidden`. The `signup_token` query parameter is required when the Homeserver uses token-required signup. An application must perform a separate grant exchange after signup to obtain a bearer token.

`GET /auth/grant/session` returns `homeserver`, `pubky`, `client_id`, `capabilities` (an array), `grant_id`, `token_expires_at`, `grant_expires_at`, and `created_at`. Timestamps are Unix seconds. Each bearer is a secret and appears only in the session-exchange response that minted it; do not log or publish it.

`GET /auth/grant/sessions` returns only non-revoked, non-expired grants. Each item contains `grant_id`, `client_id`, `capabilities` (a comma-separated string), `issued_at`, and `expires_at`. Root-capability grant management is highly privileged and should be reserved for trusted identity or session managers, not ordinary applications. Specific revocation also verifies that the grant belongs to the authenticated user.

The current-session `DELETE` route returns `200 OK` even when its bearer is missing, invalid, or already revoked, so the response does not prove that a grant was found. Functional error bodies are plain text; consult the OpenAPI specification and server implementation for route-specific errors.

## Storage Endpoints

### PUT - Store Data

Store or update data at a path.

**Request:**
```http
PUT /:path
Authorization: Bearer <token>
Content-Type: application/octet-stream

<binary data>
```

**Path Format:**
- Normalized decoded paths must be under `/pub/`
- Maximum normalized decoded length: 972 bytes total and 255 bytes per segment
- Paths are UTF-8 and may contain spaces and non-ASCII characters; percent-encode them when constructing raw HTTP URLs

**Response:**
```http
HTTP/1.1 201 Created
```

The response has no body. The Homeserver returns `201 Created` for both new and overwritten entries.

The tenant router declares a [100 MiB body limit](https://github.com/pubky/pubky-core/blob/main/pubky-homeserver/src/client_server/routes/tenants/mod.rs#L19-L33), but the streaming PUT handler does not enforce it as a hard cap. Operators must enforce request-size limits for both direct PubkyTLS and reverse-proxied traffic and configure per-user storage quotas separately.

**Error Responses:**
- `400 Bad Request`: Invalid path
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions
- `507 Insufficient Storage`: Quota exceeded

### GET - Retrieve Data

Retrieve data from a path.

**Request:**
```http
GET /:path
Authorization: Bearer <token>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: <detected media type>
Content-Length: 1234

<binary data>
```

The response body contains the stored bytes. The Homeserver infers `Content-Type` from the content or path extension and falls back to `application/octet-stream`.

**Error Responses:**
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Path does not exist

### DELETE - Remove Data

Delete data at a path.

**Request:**
```http
DELETE /:path
Authorization: Bearer <token>
```

**Response:**
```http
HTTP/1.1 204 No Content
```

The response has no body.

**Error Responses:**
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Path does not exist

### GET - List Data

Send `GET` to a path ending in `/` to list entries under that prefix.

**Request:**
```http
GET /pub/myapp/posts/?limit=20&reverse=true
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Maximum entries to return (default: 100; effective maximum: 1000)
- `cursor` (optional): Exclusive path cursor. Pass the final URL from the previous page, with or without the `pubky://` scheme, URL-encoded as a query value
- `reverse` (optional): Reverse the deterministic lexicographic path order; this is unrelated to creation or modification time
- `shallow` (optional): When `true`, return immediate children instead of listing recursively

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: text/plain

pubky://<user-key>/pub/myapp/posts/002
pubky://<user-key>/pub/myapp/posts/001
```

The body contains one canonical `pubky://` URL per line, with no JSON envelope or entry metadata. To request another page, use the final returned URL as `cursor`.

**Error Responses:**
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions

## Capabilities System

Capabilities define what operations a session can perform:

### Capability Syntax

```
<scope>:<actions>
```

**Actions:**
- `r`: GET operations, including directory listings
- `w`: PUT, DELETE operations

**Examples:**
```
/pub/:r                       # Read all public data
/pub/myapp/:w                 # Write below /pub/myapp/
/pub/myapp/posts/:rw          # Read and write posts
/pub/social/profile:r         # Read a specific public path
```

A trailing slash defines a directory scope. Without it, the capability matches only the exact path.

### Capability Checking

When a request is made:
1. Check session capabilities
2. Match requested path against capability patterns
3. Verify operation is allowed
4. Execute or deny request

## Event Streaming

Subscribe to real-time updates on data changes via Server-Sent Events (SSE). Two endpoints serve different use cases:

### GET /events-stream — Real-Time SSE Stream

The primary event API. Clients subscribe to specific users on a homeserver without processing unwanted traffic.

**Request:**
```http
GET /events-stream?user=<z32_pubkey>&user=<z32_pubkey>:<cursor>&limit=100&live=true&path=/pub/
```

**Query Parameters:**
- `user` (required, repeatable): User public key in z32 format. Append `:<cursor>` to resume from a position (e.g. `user=abc123:42`). Up to 50 users per request
- `limit` (optional): Maximum events before closing (1–65535). Without limit and `live=false`, all historical events are sent then the stream closes
- `live` (optional): When `true`, delivers all historical events first, then streams new events in real-time. Cannot combine with `reverse`
- `reverse` (optional): When `true`, delivers events newest-first then closes. Cannot combine with `live`
- `path` (optional, repeatable): Filter events by path. Multiple `path` values are combined; matching any one is sufficient

**Response (Server-Sent Events):**
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream

event: PUT
data: pubky://o1gg96ewuojmopcjbz8895478wdtxtzzuxnfjjz8o8e77csa1ngo/pub/posts/003
data: cursor: 42
data: content_hash: AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE=

event: DEL
data: pubky://o1gg96ewuojmopcjbz8895478wdtxtzzuxnfjjz8o8e77csa1ngo/pub/temp
data: cursor: 43
```

**Event Types:**
- `PUT`: Data was created or updated. Includes a `content_hash` (base64-encoded Blake3 hash)
- `DEL`: Data was deleted

**SSE Data Format** (one `data:` line per field):
1. First line: full `pubky://` resource URL
2. `cursor: <u64>` — event ID for pagination/resumption
3. `content_hash: <base64>` — 32-byte Blake3 hash (PUT events only)

### GET /events/ — Paginated Event Feed

Paginated feed of all events across all users on the homeserver. Intended for indexers and aggregators like [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/).

**Request:**
```http
GET /events/?cursor=<event_cursor>&limit=1000
```

Returns up to 1000 events per batch. Use the returned cursor to paginate through the full history.

## Signup Token Validation

Homeservers that require signup tokens (via [Homegate](/explore/technologies/homegate/)) expose an endpoint to check token validity.

### GET /signup_tokens/{token}

Check whether a signup token is valid, used, or unknown.

**Response (200 OK):**
```json
{
  "status": "valid",
  "created_at": "2025-03-18T12:00:00Z"
}
```

**Status values:** `valid` (unused), `used` (already redeemed)

**Error Responses:**
- `400 Bad Request`: Missing or invalid token format, or homeserver does not require signup tokens
- `404 Not Found`: Token does not exist

**Rate Limiting:** This endpoint is rate-limited to 10 requests per IP per minute by default.

## Admin API

Each Homeserver runs a separate admin HTTP server on its own socket (default `127.0.0.1:6288`), isolated from the public Pubky API. It is the only surface for operator tasks — minting signup tokens, suspending abusive users, adjusting per-user quotas, deleting entries, and inspecting health. The admin listener is plain HTTP, so keep it bound to `127.0.0.1` and never expose port 6288 to the internet. Use a protected tunnel to the loopback listener for remote administration. See [Homeserver](/explore/pubky-protocol/homeserver/) for the operator-facing overview.

### Authentication

A shared admin password gates every protected route:

- JSON endpoints expect `X-Admin-Password: <password>`
- The WebDAV mount at `/dav/*` uses HTTP Basic auth (`admin:<password>`), so browsers receive a standard `WWW-Authenticate` prompt

The password lives at `[admin].admin_password` in `config.toml`. The sample config ships with `"admin"` for local development — replace it before using the Admin API outside isolated local development.

Endpoints with a `{public_key}` path parameter return `400 Bad Request` if the value is not a valid z32-encoded public key.

### GET / — Liveness Probe

Returns the literal string `"Homeserver - Admin Endpoint"`. Unauthenticated; useful for basic reachability checks against the admin listener.

### GET /info — Server Overview

Returns the user count, the disabled-user count, total disk usage in MB, signup-code stats, the homeserver public key, the advertised PKARR pubky address and ICANN domain, and the running version.

**Response (200 OK):**
```json
{
  "num_users": 1842,
  "num_disabled_users": 3,
  "total_disk_used_mb": 28471,
  "num_signup_codes": 250,
  "num_unused_signup_codes": 47,
  "public_key": "8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo",
  "pkarr_pubky_address": null,
  "pkarr_icann_domain": "homeserver.example.com",
  "version": "<homeserver-version>"
}
```

`pkarr_pubky_address` and `pkarr_icann_domain` are nullable — they reflect the server's PKARR and ICANN configuration and may be absent.

### Signup Tokens

Mint signup tokens for gated homeservers — see [Homegate](/explore/technologies/homegate/) for the redemption flow.

**`GET /generate_signup_token`** mints a token using system-default quotas. Returns the token string in the response body.

**`POST /generate_signup_token`** mints a token with explicit per-user quota overrides:

```http
POST /generate_signup_token
X-Admin-Password: <password>
Content-Type: application/json

{
  "storage_quota_mb": 1024,
  "rate_read": "200mb/m"
}
```

Each field accepts a value, `"unlimited"`, or `null` to use the system default. Absent fields fall back to system defaults. Invalid rate strings return `422 Unprocessable Entity`.

**`GET /signup_tokens`** lists signup tokens with pagination and optional filtering by used or unused state.

### Event Stream

`GET /events-stream` provides an admin-authenticated SSE feed. It supports user, cursor, path, ordering, limit, and live-stream filters.

### User Suspension

`POST /users/{public_key}/disable` — flip a per-user `disabled` flag. Subsequent reads and writes against that user's data fail until re-enabled.

`POST /users/{public_key}/enable` — reverse the disable.

Both return `200 OK` on success, `404 Not Found` for unknown users.

### Per-User Quotas

`GET /users/{public_key}/quota` returns both the effective quota (per-user overrides merged with system defaults from `[default_quotas]` and `[storage].default_quota_mb`) and the raw overrides:

```json
{
  "effective": {
    "storage_quota_mb": 500,
    "rate_read": "10mb/s",
    "rate_write": "5mb/s"
  },
  "overrides": {
    "storage_quota_mb": 500
  }
}
```

`PATCH /users/{public_key}/quota` updates per-user storage and bandwidth fields. Each field follows the same semantics:

- absent → keep existing override
- `null` → reset to Default (use system default)
- `"unlimited"` → no limit
- value (`1024`, `"100mb/m"`) → explicit override

### Entry Deletion

`DELETE /webdav/{public_key}/pub/...` removes a single entry by path and emits a normal `DEL` event so subscribers stay in sync.

The full `/dav/*` mount additionally exposes PROPFIND, GET, PUT, and DELETE across all user data for ops-driven inspection or bulk cleanup. It uses HTTP Basic auth (`admin:<password>`).

### Tooling

The [Pubky CLI](/explore/technologies/pubky-cli/) wraps these endpoints under `pubky-cli admin …` (`info`, `generate-token`, `user disable`, `user enable`, `user delete`) and reads the password from `PUBKY_ADMIN_PASSWORD`.

### Configuration

```toml
[admin]
enabled = true
listen_socket = "127.0.0.1:6288"
admin_password = "change-me"
```

## Metrics Endpoint

The Homeserver exposes Prometheus-compatible metrics on an optional, separate listener. It is disabled by default and binds to `127.0.0.1:6289` when enabled. The endpoint is unauthenticated, so keep it internal and never expose port 6289 to the internet.

### GET /metrics

Returns metrics in Prometheus text exposition format.

## Rate Limiting

Request-count limits can be configured by HTTP method and path. By default, only `GET /signup_tokens/*` is limited, at 10 requests per minute per IP. See the [default configuration](https://github.com/pubky/pubky-core/blob/main/pubky-homeserver/src/data_directory/config.default.toml) for details.

**Rate Limit Exceeded:**
```http
HTTP/1.1 429 Too Many Requests

Rate limit exceeded
```

## Error Responses

The API does not define a universal JSON error envelope. Error bodies vary by route and many are plain text. Clients should handle HTTP status codes and consult the OpenAPI specifications for route-specific responses instead of depending on generic symbolic error codes.

## Best Practices

### Optimize Storage

**Store structured data efficiently:**
```
// Good: Separate entries for each post
PUT /pub/myapp/posts/001  (small JSON)
PUT /pub/myapp/posts/002  (small JSON)
PUT /pub/myapp/posts/003  (small JSON)

// Bad: Single large entry
PUT /pub/myapp/all_posts  (large JSON array)
```

### Handle Rate Limits

```javascript snippet="snippets/js/src/troubleshooting.ts:js_put_with_retry"
```

## Resources

- **[Pubky protocol overview](/explore/pubky-protocol/introduction/)**: Main documentation
- **[SDK Documentation](/explore/pubky-protocol/sdk/)**: Client libraries
- **[Homeserver Documentation](/explore/pubky-protocol/homeserver/)**: Server setup
- **Official Docs**: [pubky.github.io/pubky-homeserver](https://pubky.github.io/pubky-homeserver/)
- **Repository**: [github.com/pubky/pubky-homeserver](https://github.com/pubky/pubky-homeserver)
- **Client OpenAPI**: [openapi-client.yml](https://github.com/pubky/pubky-homeserver/blob/main/pubky-homeserver/openapi-client.yml)
- **Admin OpenAPI**: [openapi-admin.yml](https://github.com/pubky/pubky-homeserver/blob/main/pubky-homeserver/openapi-admin.yml)

---

**The Pubky Homeserver API provides a simple, RESTful interface for decentralized data storage.**
