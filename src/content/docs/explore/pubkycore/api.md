---
title: "Pubky Core API Reference"
---

The [Pubky Core](/explore/pubkycore/introduction/) protocol defines a RESTful HTTP API for storing and retrieving data on [Homeservers](/explore/pubkycore/homeserver/). This document describes the complete API specification.

## Base URL

All API endpoints are relative to the Homeserver base URL:

```
https://homeserver.example.com
```

Homeserver URLs are discovered via [PKARR](/explore/pubkycore/pkarr/introduction/) records published to the [Mainline DHT](/explore/technologies/mainline-dht/).

## Authentication

See [Authentication](/explore/pubkycore/authentication/) for conceptual overview.

### Public Key Authentication

All requests must be authenticated using Ed25519 signatures:

**Headers:**
```
Authorization: Pubky <public_key>:<signature>:<timestamp>
```

**Signature Generation:**
1. Create message: `METHOD:PATH:TIMESTAMP:BODY_HASH`
2. Sign message with Ed25519 private key
3. Encode signature as base64

**Example (conceptual):**
```
Method: PUT
Path: /pub/myapp/data
Timestamp: 1704067200
Body: {"hello":"world"}
Body Hash: sha256(body) = abc123...

Message to sign: "PUT:/pub/myapp/data:1704067200:abc123..."
Signature: sign_ed25519(message, private_key)

Authorization: Pubky 8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo:SGVsbG8gV29ybGQ=:1704067200
```

### Session Tokens

For long-lived connections, use session tokens:

**Request:**
```http
POST /auth/session
Authorization: Pubky <public_key>:<signature>:<timestamp>
Content-Type: application/json

{
  "capabilities": [
    "read:/pub/",
    "write:/pub/myapp/"
  ],
  "ttl": 3600
}
```

**Response:**
```json
{
  "token": "session_abc123...",
  "expires_at": 1704070800
}
```

**Usage:**
```http
GET /pub/myapp/data
Authorization: Bearer session_abc123...
```

## Storage Endpoints

### PUT - Store Data

Store or update data at a path.

**Request:**
```http
PUT /:path
Authorization: Pubky <public_key>:<signature>:<timestamp>
Content-Type: application/octet-stream

<binary data>
```

**Path Format:**
- Must start with `/pub/` (public) or `/private/` (future)
- Maximum length: 1024 bytes
- Allowed characters: `a-z`, `A-Z`, `0-9`, `-`, `_`, `/`, `.`

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "path": "/pub/myapp/data",
  "size": 1234,
  "created_at": 1704067200
}
```

**Error Responses:**
- `400 Bad Request`: Invalid path or data
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions
- `413 Payload Too Large`: Data exceeds limit (default: 10MB)
- `507 Insufficient Storage`: Quota exceeded

### GET - Retrieve Data

Retrieve data from a path.

**Request:**
```http
GET /:path
Authorization: Pubky <public_key>:<signature>:<timestamp>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Length: 1234

<binary data>
```

**Error Responses:**
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Path does not exist

### DELETE - Remove Data

Delete data at a path.

**Request:**
```http
DELETE /:path
Authorization: Pubky <public_key>:<signature>:<timestamp>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "path": "/pub/myapp/data",
  "deleted_at": 1704067200
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Path does not exist

### LIST - Enumerate Data

List entries under a path prefix (with pagination).

**Request:**
```http
GET /:path?limit=20&cursor=abc123&reverse=false
Authorization: Pubky <public_key>:<signature>:<timestamp>
```

**Query Parameters:**
- `limit` (optional): Maximum entries to return (default: 100, max: 1000)
- `cursor` (optional): Pagination cursor from previous response
- `reverse` (optional): List in reverse order (newest first)

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "entries": [
    {
      "path": "/pub/myapp/posts/001",
      "size": 512,
      "created_at": 1704067200,
      "updated_at": 1704067200
    },
    {
      "path": "/pub/myapp/posts/002",
      "size": 1024,
      "created_at": 1704067300,
      "updated_at": 1704067300
    }
  ],
  "cursor": "next_page_cursor_xyz",
  "has_more": true
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions

## Capabilities System

Capabilities define what operations a session can perform:

### Capability Syntax

```
<operation>:<path_prefix>
```

**Operations:**
- `read`: GET, LIST operations
- `write`: PUT, DELETE operations
- `*`: All operations

**Examples:**
```
read:/pub/                    # Read all public data
write:/pub/myapp/             # Write to /pub/myapp/* only
*:/pub/myapp/posts/           # Full access to posts
read:/pub/social/profile      # Read specific path
```

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
- `path` (optional): Filter events by path prefix (e.g. `/pub/pubky.app/`)

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

Each Homeserver runs a separate admin HTTP server on its own socket (default `127.0.0.1:6288`), isolated from the public Pubky API. It is the only surface for operator tasks — minting signup tokens, suspending abusive users, adjusting per-user quotas, deleting entries, and inspecting health. The admin listener is plain HTTP, so keep it on `localhost` or a trusted network and front it with a reverse proxy if it ever needs to leave the host. See [Homeserver](/explore/pubkycore/homeserver/) for the operator-facing overview.

### Authentication

A shared admin password gates every protected route:

- JSON endpoints expect `X-Admin-Password: <password>`
- The WebDAV mount at `/dav/*` uses HTTP Basic auth (`admin:<password>`), so browsers receive a standard `WWW-Authenticate` prompt

The password lives at `[admin].admin_password` in `config.toml`. The sample config ships with `"admin"` for local development — replace it before exposing the port.

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
  "version": "0.7.0"
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

Prometheus-compatible metrics for monitoring.

### GET /metrics

**Response:**
```
# HELP pubky_requests_total Total HTTP requests
# TYPE pubky_requests_total counter
pubky_requests_total{method="GET",status="200"} 1000
pubky_requests_total{method="PUT",status="200"} 500

# HELP pubky_storage_bytes Total storage used
# TYPE pubky_storage_bytes gauge
pubky_storage_bytes 1073741824

# HELP pubky_active_sessions Current active sessions
# TYPE pubky_active_sessions gauge
pubky_active_sessions 50
```

## Rate Limiting

Homeservers implement rate limiting to prevent abuse:

**Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067260
```

**Rate Limit Exceeded:**
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
  "error": "rate_limit_exceeded",
  "message": "Too many requests, try again in 60 seconds"
}
```

**Default Limits:**
- Anonymous: 10 requests/minute
- Authenticated: 100 requests/minute
- Admin: Unlimited

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {
    "additional": "context"
  }
}
```

**Common Error Codes:**
- `invalid_path`: Path format is invalid
- `invalid_signature`: Authentication signature invalid
- `expired_session`: Session token expired
- `insufficient_permissions`: Operation not allowed
- `storage_quota_exceeded`: User quota exceeded
- `rate_limit_exceeded`: Too many requests
- `server_error`: Internal server error

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

```javascript
async function putWithRetry(session, path, data, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await session.storage.putText(path, data);
        } catch (error) {
            if (error.status === 429) { // Too Many Requests
                await new Promise(r => setTimeout(r, 1000 * (i + 1)));
                continue;
            }
            throw error;
        }
    }
}
```

## Resources

- **[Pubky Core Overview](/explore/pubkycore/introduction/)**: Main documentation
- **[SDK Documentation](/explore/pubkycore/sdk/)**: Client libraries
- **[Homeserver Documentation](/explore/pubkycore/homeserver/)**: Server setup
- **Official Docs**: [pubky.github.io/pubky-core](https://pubky.github.io/pubky-core/)
- **Repository**: [github.com/pubky/pubky-core](https://github.com/pubky/pubky-core)

---

**The Pubky Core API provides a simple, RESTful interface for decentralized data storage.**

