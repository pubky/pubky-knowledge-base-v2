---
title: "PKDNS"
---

**[PKDNS](https://github.com/pubky/pkdns)** is a DNS server that enables self-sovereign and censorship-resistant domain names by resolving [PKARR](/pkarr/) (Public Key Addressable Resource Records) hosted on the [Mainline DHT](/mainline-dht/). It bridges the gap between traditional DNS infrastructure and public key-based domains, allowing clients configured to use it to access the decentralized web using standard DNS protocols.

## Overview

PKDNS makes public-key domains accessible to everyone by acting as a DNS resolver that understands both traditional ICANN domains and PKARR-based public-key domains. When you query a public-key domain (52-character z-base-32 encoded public key), PKDNS fetches the signed DNS records from the Mainline DHT, verifies the signature, and returns them to your browser or application—just like traditional DNS.

### Key Innovation

Instead of relying on ICANN registrars and centralized name servers, PKDNS enables:
- **Self-sovereign domains**: Your Ed25519 public key IS your domain
- **Censorship resistance**: Records are stored on the decentralized Mainline DHT
- **No registration fees**: Publish records directly to the DHT
- **Cryptographic verification**: PKARR records are signed and verifiable
- **ICANN fallback**: Still resolves traditional domains seamlessly

## How It Works

### Resolution Flow

1. **User queries domain**: Browser or app requests `7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy`
2. **PKDNS recognizes format**: Recognizes a z-base-32 encoded public key in the domain name
3. **DHT lookup**: Queries the Mainline DHT for PKARR records associated with that public key
4. **Signature verification**: Validates that records were signed by the private key holder
5. **Cache and return**: Caches the verified records and returns DNS response to client
6. **ICANN fallback**: For traditional domains like `example.com`, forwards to the configured DNS resolver (default: 8.8.8.8)

### Public-Key Domain Format

Public-key domains use z-base-32 encoded Ed25519 public keys:
- **Length**: 52 characters (z-base-32 encoding)
- **Example**: `7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy`
- **Subdomains**: Support standard subdomain syntax (e.g., `blog.7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy`)

### Supported Record Types

PKDNS currently supports the most common DNS record types:
- **A**: IPv4 addresses
- **AAAA**: IPv6 addresses
- **TXT**: Text records
- **CNAME**: Canonical name records
- **MX**: Mail exchange records

For other record types, use bind9 or similar full-featured DNS servers.

## Features

### DNS-over-HTTPS (DoH)

PKDNS supports DNS-over-HTTPS, enabling encrypted DNS queries from browsers:
- Configure browser to use a PKDNS DoH endpoint
- DNS queries to the selected DoH endpoint are encrypted over HTTPS
- Hides those DNS queries from network observers; the resolver still sees them
- Public DoH endpoints available in [servers.txt](https://github.com/pubky/pkdns/blob/master/servers.txt)

Applications using ordinary DNS trust their chosen PKDNS resolver to return the records it verifies.

### Caching

Multi-layer caching for optimal performance:
- **Response cache**: Caches responses for traditional DNS queries
- **PKARR cache**: Stores verified PKARR records from DHT
- **Configurable TTL**: Uses record TTLs within configured minimum and maximum bounds

### Rate Limiting

Built-in protection against abuse:
- Per-IP rate limiting to prevent DoS attacks
- Configurable thresholds and timeouts
- Protects both the server and the DHT network

### Dynamic DNS (DynDNS)

Support for dynamic IP updates:
- CLI tool for publishing updated A/AAAA records
- Automated IP detection from multiple providers
- Schedule periodic republishing to keep records available on the DHT
- Perfect for Homeservers and dynamic IP addresses

### Hybrid Resolution

Seamlessly resolves both public-key domains and traditional domains:
- Public-key domains → DHT lookup
- ICANN domains → Configured DNS resolver
- Configurable fallback DNS server
- Configure your browser or system to use a PKDNS resolver

## Getting Started

### Using Public Hosted Servers

The easiest way to try PKDNS:

1. **Choose a public server**: Check [servers.txt](https://github.com/pubky/pkdns/blob/master/servers.txt) for available DNS-over-HTTPS endpoints

2. **Configure your browser**:
   - Firefox: Settings → Network Settings → Enable DNS over HTTPS → Custom → Enter DoH URL
   - Chrome: Settings → Privacy and security → Security → Use secure DNS → Custom → Enter DoH URL
   - Edge: Settings → Privacy, search, and services → Security → Use secure DNS → Choose provider

3. **Test it works**: Visit [http://7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy/](http://7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy/)

For self-hosting, configuration, verification, and troubleshooting, see the [PKDNS README](https://github.com/pubky/pkdns/blob/master/README.md).

## Publishing Your Own Public-Key Domain

Publishing a public-key domain involves generating a key pair, creating DNS records, and publishing them to the Mainline DHT. Records must be republished periodically to remain available.

**⚠️ Security**: Store your private key securely. Anyone with the private key can publish records for your domain.

See the [PKDNS README](https://github.com/pubky/pkdns/blob/master/README.md) and its linked publishing guide for the CLI workflow and dynamic IP updates.

## Use Cases

### Self-Sovereign Web Publishing

Publish websites without:
- Domain registrars (no annual fees)
- DNS hosting services (no third-party control)
- Renewal requirements (keys don't expire)
- Registrar control over your domain (records are published on the DHT)

### Decentralized Applications

Enable dApps to use public-key addresses:
- No smart contract required for DNS
- Cryptographic verification built-in
- Works with existing web infrastructure

### Development & Testing

Instant domain names for development:
- Generate test domains in seconds
- No registration or setup fees
- Update records without a registrar
- Perfect for CI/CD pipelines

### Privacy-Focused Browsing

Access censorship-resistant content:
- Signatures prevent unauthorized changes to records; availability is not guaranteed
- No central authority to pressure
- Works through standard DNS protocols
- Compatible with existing privacy tools

### Personal Identity

Use your public key as your digital identity:
- Single domain across all services
- Provable ownership via signatures
- No platform lock-in
- Portable across applications

## Limitations & Considerations

### Port 53 Requirement

Running a DNS server on port 53 may require additional permissions or conflict with another DNS service. See the [PKDNS README](https://github.com/pubky/pkdns/blob/master/README.md) for setup and troubleshooting.

### DHT Ephemeral Storage

Records expire after a few hours and must be republished:
- **Active domains**: Need periodic republishing (~hourly)
- **Automated solutions**: Schedule publishing with the DynDNS tooling
- **Trade-off**: Prevents DHT pollution but requires maintenance

### Record Size Limit

PKARR packets must be ≤1000 bytes:
- Limits number of records per domain
- Use CNAME indirection for complex setups
- Consider multiple public keys if needed

### Limited Record Type Support

Currently supports only: A, AAAA, TXT, CNAME, MX
- Use bind9 for advanced record types (SRV, CAA, etc.)
- May expand in future versions

### Browser Trailing Slash

Browsers may search instead of resolve domains:
- Always append `./` to public-key domains in URL bar
- Example: `http://7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy./`
- Not needed for bookmarks or links

## Resources

- **Repository**: [https://github.com/pubky/pkdns](https://github.com/pubky/pkdns)
- **Releases**: [https://github.com/pubky/pkdns/releases](https://github.com/pubky/pkdns/releases)
- **Docker Image**: [https://hub.docker.com/r/synonymsoft/pkdns](https://hub.docker.com/r/synonymsoft/pkdns)
- **Public Servers**: [servers.txt](https://github.com/pubky/pkdns/blob/master/servers.txt)
- **Zone Explorer**: [https://pkdns.net](https://pkdns.net)
- **Telegram Chat**: [https://t.me/pubkycore](https://t.me/pubkycore)

### Documentation

- [DNS-over-HTTPS Setup](https://github.com/pubky/pkdns/blob/master/docs/dns-over-https.md)
- [Dynamic DNS Configuration](https://github.com/pubky/pkdns/blob/master/docs/dyn-dns.md)
- [Logging Configuration](https://github.com/pubky/pkdns/blob/master/docs/logging.md)
- [Publishing Guide](https://medium.com/pubky/how-to-host-a-public-key-domain-website-v0-6-0-ubuntu-24-04-57e6f2cb6f77)

### Blog Posts

- [Mainline DHT Censorship Explained](https://medium.com/pubky/mainline-dht-censorship-explained-b62763db39cb)
- [Public Key Domains Censorship Resistance Explained](https://medium.com/pubky/public-key-domains-censorship-resistance-explained-33d0333e6123)

### Related Tools

- **[pkarr](https://github.com/pubky/pkarr)**: Core PKARR library and specification
- **[pkdns-digger](https://github.com/pubky/pkdns-digger)**: Web-based DNS record lookup tool for PKARR/PKDNS
- **[pkdns-vanity](https://github.com/jphastings/pkdns-vanity)**: Generate vanity public-key domains
