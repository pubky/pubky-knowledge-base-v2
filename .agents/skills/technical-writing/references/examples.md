# Writing examples

Use these examples to calibrate natural technical prose, reader-focused
structure, and preservation of meaning. Treat product-specific facts as example
context, not as assumptions about another project.

## Contents

- [Describe a product without clipped sentences](#describe-a-product-without-clipped-sentences)
- [Offer a concrete setup choice](#offer-a-concrete-setup-choice)
- [Separate prerequisites from instructions](#separate-prerequisites-from-instructions)
- [State expected results without overstating verification](#state-expected-results-without-overstating-verification)
- [Preserve defaults and optional behavior](#preserve-defaults-and-optional-behavior)
- [Make troubleshooting symptom-led](#make-troubleshooting-symptom-led)
- [Keep reference descriptions precise](#keep-reference-descriptions-precise)
- [Explain maintenance behavior in readable paragraphs](#explain-maintenance-behavior-in-readable-paragraphs)

## Describe a product without clipped sentences

**Before**

The proxy processes raw public key TLS connections. It decrypts the HTTP traffic.
It sends the HTTP traffic to your HTTP server. nginx is an example of an HTTP server.

**After**

The proxy handles raw public key TLS connections and forwards decrypted HTTP
traffic to your server, such as nginx.

Keep related actions together when the resulting sentence is easy to follow.
Retain the precise protocol name.

## Offer a concrete setup choice

**Before**

There are multiple deployment topologies available depending on the desired
network architecture and port allocation requirements.

**After**

Choose a setup:

- **Separate port:** Keep nginx on ports 80 and 443, and run the proxy on port 8443.
- **Shared ports:** Put the proxy in front of nginx to serve both TLS connection
  types on port 443.

Name the decision in the reader's terms. Include enough information to choose.
In a real document, link each choice to its guide.

## Separate prerequisites from instructions

**Before**

Paste the service definition, replacing alice with your username and /home/alice
with your home path, and ensure that ExecStart uses a full path rather than a
tilde since the service runs as your user even when logged out and starts at boot.

**After**

Paste the service definition below, with these substitutions:

- Replace `alice` with your username.
- Replace `/home/alice` with the full path to your home directory.
- Use the full path in `ExecStart`, not `~`.

Once enabled, the service starts at boot and runs as your user, including when
you're logged out.

Keep substitutions next to the example. Separate operational behavior from the
instructions for editing it.

## State expected results without overstating verification

**Before**

Run the OpenSSL command to verify that your server is secure and operational.

**After**

Look for `Server-to-client raw public key negotiated`. This confirms that the
proxy accepts raw public key TLS connections. It does not verify that the
presented public key is yours.

To verify the server's identity, use an application that supports Public Key
Domains and raw public key TLS.

Keep exact output strings. Describe what the check proves instead of replacing
it with a broad assurance.

## Preserve defaults and optional behavior

**Before**

The client address is provided to backends via the PROXY protocol, which should
be supported by the backend implementation.

**After**

By default, the proxy sends the client's address to each backend in a PROXY
protocol header. Configure your backend to accept this header. If it doesn't
support the PROXY protocol, use `--no-proxy-protocol`.

State the default, the requirement it creates, and the supported alternative.
Include an alternative only when the source or implementation supports it.

## Make troubleshooting symptom-led

**Before**

If there are raw public key TLS connectivity issues, network configuration may
need to be reviewed, particularly in relation to firewall settings.

**After**

### Raw public key TLS connections time out

Check that TCP port 8443 is open to your users. From another computer, run:

```bash
nc -vz -w 5 example.com 8443
```

A timeout usually means a firewall is dropping traffic.

Use an observable symptom, a specific check, and an appropriately qualified
explanation. Do not present a likely cause as certain.

## Keep reference descriptions precise

**Before**

The `plain_http` configuration parameter facilitates the optional enablement
or disablement of support for incoming unencrypted HTTP traffic.

**After**

`plain_http` controls whether the proxy accepts incoming plain HTTP connections.
Set it to `false` to reject them.

Use a direct description. Keep the identifier unchanged. In a complete reference
entry, include the type and default only after verifying them.

## Explain maintenance behavior in readable paragraphs

**Before**

If the server's public IP address changes, edit the records file and save it;
the domain stays the same and the proxy polls every three seconds and publishes
valid updates without a restart, while invalid updates are logged and the last
valid records retained, and clients may cache old records for the default TTL.

**After**

If the server's public IP address changes, edit `dns-records.toml` and save it.
Your Public Key Domain stays the same.

The proxy checks the file every three seconds and publishes valid changes
automatically. You don't need to restart it.

If an edit is invalid, the proxy logs the error and keeps the last valid records
until you fix the file. Clients may use old records until their TTL expires.

Group the reader action, normal behavior, and failure behavior into separate
paragraphs. Preserve timing and caching qualifications from the source.
