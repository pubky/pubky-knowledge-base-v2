---
title: "Pubky Docker"
---

**[Pubky Docker](https://github.com/pubky/pubky-docker)** is a Docker Compose orchestration that provides a one-click local development environment for running the complete Pubky Social (App) stack. It's designed for developers who want to experiment with the full Pubky ecosystem or test components in an isolated environment.

## Overview

Pubky Docker orchestrates the following components:

1. **[Pubky Homeserver](https://github.com/pubky/pubky-core/tree/main/pubky-homeserver)** - Decentralized data storage instance
2. **[Pubky Nexus](https://github.com/pubky/pubky-nexus)** - Social media indexer and aggregator
3. **[Homegate](https://github.com/pubky/homegate)** - Signup verification service for preventing automated signup spam
4. **[pubky.app](https://github.com/pubky/pubky-app)** - Social media client frontend

Third-party infrastructure images (Postgres, Neo4j, Redis, Redis Insight, WireMock) are pulled from their public registries.

## When to Use Pubky Docker

### ✅ Use Pubky Docker When:
- Experimenting with the complete Pubky Social stack
- Developing or testing Pubky Nexus integrations
- Building custom social media frontends
- Testing Homeserver configurations
- Learning how all Pubky components interact
- Debugging cross-component issues

### ❌ Don't Use Pubky Docker When:
- Building applications using Pubky Core (use SDK libraries instead)
- Developing simple Pubky integrations (use official client libraries)
- Just testing basic read/write operations

For application development, use the official client libraries:
- **JavaScript**: [@synonymdev/pubky](https://www.npmjs.com/package/@synonymdev/pubky)
- **Rust**: [pubky](https://crates.io/crates/pubky)

## Quick Start

### Using Public Docker Images

This is the fastest way to get started. All images are available on [Docker Hub](https://hub.docker.com/u/synonymsoft).

1. Clone the repository:
```bash
git clone https://github.com/pubky/pubky-docker.git
cd pubky-docker
```

2. Configure environment:
```bash
cp .env-sample .env
# Edit .env to set NETWORK=mainnet or NETWORK=testnet
```

3. Start the stack:
```bash
docker compose up -d
```

For source builds, see [Local Setup From Source](https://github.com/pubky/pubky-docker#local-setup-from-source) in the Pubky Docker README.

## Stack Components

### 1. Pubky Homeserver
Local instance of [Pubky Homeserver](https://github.com/pubky/pubky-core/tree/main/pubky-homeserver) with PostgreSQL backend.

**Configuration**: `homeserver.config.toml`

**Database**: PostgreSQL (Port 5432)

**Endpoints**:
- `6287`: Primary HTTP API
- `6286`: Admin API
- `6288`: Metrics
- `15411-15412`: HTTP relay

### 2. Pubky Nexus
[Pubky Nexus](https://github.com/pubky/pubky-nexus) indexer and aggregator with graph database and search capabilities.

**Configuration**: `pubky-nexus-config-{testnet|mainnet}.toml`

**Dependencies**:
- Neo4j graph database (Ports 7474, 7687)
- Redis search index (Port 6379)

**Endpoints**:
- `8080`: Main API
- `8081`: Admin/metrics

### 3. Homegate
[Homegate](https://github.com/pubky/homegate) signup verification service configured for local development.

**Configuration**: `homegate.config.toml`

**Access**: http://localhost:6300

### 4. pubky.app
[pubky.app](https://github.com/pubky/pubky-app) social media frontend configured to use the local stack.

**Access**: http://localhost:3000

## Configuration

### Environment Variables

Configuration is managed through a `.env` file. Copy the sample and adjust as needed:

```bash
cp .env-sample .env
```

See [`.env-sample`](https://github.com/pubky/pubky-docker/blob/main/.env-sample) in the repository for all available variables and their defaults.

### Network Configuration

The stack uses a custom Docker bridge network (`172.18.0.0/16`) with static IPs:

| Service | IP | External Ports |
|---------|------|---------------|
| Nexus | 172.18.0.3 | 8080, 8081 |
| Homeserver | 172.18.0.4 | 6286-6288, 15411-15412 |
| Neo4j | 172.18.0.5 | 7474, 7687 |
| Redis | 172.18.0.6 | 6379 |
| Redis Insight | 172.18.0.7 | 5540 |
| pubky.app | 172.18.0.8 | 3000 |
| Postgres | 172.18.0.9 | 5432 |
| Homegate | 172.18.0.10 | 6300 |

## Usage Examples

### Start the Full Stack
```bash
docker compose up -d
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f homeserver
docker compose logs -f nexusd
```

### Stop the Stack
```bash
docker compose down
```

### Rebuild After Code Changes
```bash
docker compose build
docker compose up -d
```

### Reset All Data
```bash
docker compose down -v
rm -rf .storage/
```

## Development Workflows

### Testing Homeserver Changes

1. Modify code in `../pubky-core/`
2. Rebuild Homeserver:
```bash
docker compose build homeserver
docker compose up -d homeserver
```

### Testing Nexus Changes

1. Modify code in `../pubky-nexus/`
2. Rebuild nexus:
```bash
docker compose build nexusd
docker compose up -d nexusd
```

### Testing Frontend Changes

1. Modify code in `../pubky-app/`
2. Rebuild pubky.app:
```bash
docker compose build pubky-app
docker compose up -d pubky-app
```

### Access Monitoring Tools

- **Neo4j Browser**: http://localhost:7474
- **Redis Insight**: http://localhost:5540
- **pubky.app**: http://localhost:3000

## Data Persistence

All data is stored in the `.storage/` directory:

```
.storage/
├── postgres/       # Homeserver database
├── homegate/       # Homegate data
├── neo4j/          # Nexus graph data
├── redis/          # Nexus search index
└── static/         # Nexus static files
```

This directory is gitignored. To reset your environment, simply delete it.

## Troubleshooting

### Containers Won't Start

Check if ports are already in use:
```bash
# Check port availability
lsof -i :3000 -i :6287 -i :8080 -i :6300
```

### Database Connection Errors

Ensure PostgreSQL is healthy:
```bash
docker compose ps postgres
docker compose logs postgres
```

### Nexus Can't Connect to Homeserver

Verify Homeserver is running and accessible:
```bash
curl http://localhost:6287/
docker compose logs homeserver
```

### Reset a Specific Service

```bash
# Stop service
docker compose stop nexusd

# Remove its data
rm -rf .storage/neo4j .storage/redis

# Restart
docker compose up -d nexusd
```

## Architecture

The Pubky Docker stack demonstrates the full architecture of a Pubky Social application:

```
┌───────────────────────────────────────────────────────────────┐
│                           Browser                             │
│                      (localhost:3000)                         │
└───────────────────────────────┬───────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────┐
│                    Docker Compose stack                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  pubky.app (Client)                     │  │
│  │                  Next.js Frontend                       │  │
│  └────────────┬──────────────────────┬─────────────────────┘  │
│               │                      │                        │
│      ┌────────▼─────────┐   ┌────────▼──────────┐             │
│      │  Pubky Nexus     │   │ Pubky Homeserver  │             │
│      │  (Social API)    │   │  (User Storage)   │             │
│      │  - Neo4j Graph   │   │  - PostgreSQL     │             │
│      │  - Redis Search  │   │  - File Storage   │             │
│      └──────────────────┘   └────────┬──────────┘             │
│                                      │                        │
│                               ┌──────▼───────┐                │
│                               │   Homegate   │                │
│                               │  (Signup)    │                │
│                               └──────────────┘                │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│              Synonym-hosted PKARR Relay                       │
│              used by the configured stack                     │
└───────────────────────────────────────────────────────────────┘
```

## Links

- **Repository**: https://github.com/pubky/pubky-docker
- **Upstream**: https://github.com/pubky/pubky-docker
- **Docker Hub**: https://hub.docker.com/u/synonymsoft

## Related Documentation

- [Pubky Core](/explore/pubkycore/introduction/) - Core protocol and SDK
- [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) - Social media indexer
- [Homegate](/explore/technologies/homegate/) - Signup verification service
- [pubky.app](/explore/pubky-apps/introduction/) - Frontend application
- [Pubky Homeservers](/explore/pubkycore/homeserver/) - Homeserver architecture
