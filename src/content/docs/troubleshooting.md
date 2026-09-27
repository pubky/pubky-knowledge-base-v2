---
title: "Troubleshooting Guide"
---

Common issues and solutions when working with Pubky.

---

## PKARR & Discovery Issues

### PKARR Record Not Resolving

**Symptom**: A user public key does not resolve, so apps cannot find that user's Homeserver.

A user's PKARR record is published under the user's own public key. The record contains a `_pubky` pointer whose target is the Homeserver public key. So `signer.pkdns.publishHomeserverForce(homeserverPk)` signs and publishes the record for `signer.publicKey`; `homeserverPk` is the value stored in that record, not the DHT key being published.

**Common Causes:**

1. **User Record Not Published or Points to the Wrong Homeserver**
   ```bash
   # Verify the user's record exists on the DHT
   curl -fsI https://pkarr.pubky.app/<your-public-key> >/dev/null && echo "on DHT" || echo "NOT on DHT"
   ```

   **Solution**: Explicitly publish the user's `_pubky` Homeserver pointer. Signup normally does this for you; use force publish when setting the pointer manually, repairing a wrong or missing pointer, or migrating to a different Homeserver. Force publish means "write this pointer now", even if the existing record is still fresh:
   ```javascript snippet="snippets/js/src/troubleshooting.ts:js_publish_pkdns_record"
   ```

2. **Record Expired (TTL)**
   - PKARR records need periodic refresh to stay easy to discover
   - **Solution**: Use stale-aware publishing for routine maintenance. It checks the existing record age first and no-ops while the record is fresh, then republishes once the SDK considers it stale (default: older than 1 hour). Pass `homeserverPk` when you need missing records to be recreated; omitting it can only reuse a Homeserver target found in the existing record.
   ```javascript snippet="snippets/js/src/troubleshooting.ts:js_republish_pkdns_record"
   ```

3. **DHT Propagation Delay**
   - Records take time to propagate (usually < 5 minutes)
   - **Solution**: Wait a few minutes after publishing, then retry

4. **Incorrect Public Key Format**
   - Public keys must be z-base-32 encoded
   - **Solution**: Verify key format matches: `z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty`

**Debugging Commands:**

```bash
# Check if PKARR relay has your record
curl "https://pkarr.pubky.org/<public-key>"

# Check DNS resolution via PKDNS
dig @pkdns.pkarr.org <public-key>

# Test with Pubky CLI
pubky-cli tools verify-pkarr <public-key>
```

---

## Homeserver Connection Issues

### Can't Connect to Homeserver

**Symptom**: SDK operations fail, timeout, or refuse connection

**Common Causes:**

1. **HTTPS Not Configured**
   - **Solution**: Follow the [Deployment Guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/DEPLOY.md) for the transport and certificate setup appropriate to your deployment.

2. **Firewall Blocking Ports**
   - **Solution**: Follow the network requirements in the [Deployment Guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/DEPLOY.md). Keep the privileged admin interface private and protected; applications need access to the client API.

3. **Homeserver Not Running**
   - **Solution**: Use the [Install Guide](https://github.com/pubky/pubky-homeserver/blob/main/docs/INSTALL.md) to check the service and its logs.

4. **Discovery Failure**
   - **Solution**: Use the [SDK](/explore/pubky-protocol/sdk/) to resolve Pubky resources and select the transport. Check [PKARR and discovery troubleshooting](#pkarr--discovery-issues) if the user's Homeserver cannot be found.

For raw HTTP diagnostics, consult the [client OpenAPI specification](https://github.com/pubky/pubky-homeserver/blob/main/pubky-homeserver/openapi-client.yml). For privileged operator diagnostics, consult the [admin OpenAPI specification](https://github.com/pubky/pubky-homeserver/blob/main/pubky-homeserver/openapi-admin.yml).

---

## SDK Authentication Problems

See [Authentication](/explore/pubky-protocol/authentication/) for how Pubky authentication works.

### "Invalid Signature" or "Authentication Failed"

**Symptom**: SDK operations rejected with authentication errors

**Common Causes:**

1. **Recovery File Corrupted**
   - File is damaged or incorrectly decrypted
   - **Solution**: Restore from backup or regenerate keys

2. **Wrong Passphrase**
   - Recovery file passphrase is incorrect
   - **Solution**: Verify passphrase, use correct one

3. **Grant Revoked or Expired**
   - The SDK refreshes short-lived bearer tokens automatically, but cannot refresh a revoked or expired grant
   - **Solution**: Sign in again:
   ```javascript snippet="snippets/js/src/troubleshooting.ts:js_reauth"
   ```

4. **Clock Skew**
   - System time is significantly wrong
   - **Solution**: Sync system clock:
   ```bash
   # Linux/macOS
   sudo ntpdate -s time.nist.gov
   
   # Or use NTP service
   sudo systemctl restart systemd-timesyncd
   ```

**Debug Authentication:**

```javascript snippet="snippets/js/src/troubleshooting.ts:js_force_reauth"
```

---

## Pubky Docker Setup Issues

See the [Pubky Docker README](https://github.com/pubky/pubky-docker#readme) for current setup and configuration. For unresolved problems, search or report an issue in the [Pubky Docker repository](https://github.com/pubky/pubky-docker/issues).

---

## Data Operations Issues

### Storage Operations Fail

**Symptom**: Can't store or delete data on Homeserver

**Common Causes:**

1. **Invalid Path**
   - Check path requirements in the [client OpenAPI specification](https://github.com/pubky/pubky-homeserver/blob/main/pubky-homeserver/openapi-client.yml).
   - **Solution**: Use the SDK to write to your application's storage path:
   ```javascript snippet="snippets/js/src/troubleshooting.ts:js_valid_storage_path"
   ```

2. **Storage Limits**
   - **Solution**: Check the reported error and ask the Homeserver operator about the applicable limits. Operators can consult the [admin OpenAPI specification](https://github.com/pubky/pubky-homeserver/blob/main/pubky-homeserver/openapi-admin.yml) for quota management.

3. **Rate Limiting**
   - Too many requests in short time
   - **Solution**: Implement backoff:
   ```javascript snippet="snippets/js/src/troubleshooting.ts:js_put_with_retry"
   ```

4. **Insufficient Permissions**
   - Trying to write to another user's space
   - **Solution**: Verify you're writing to your own pubky

---

## Pubky Ring Issues

### Can't Create Identity

**Symptom**: Key generation fails in Pubky Ring app

**Solutions**:
1. **Update the app**: Check for latest version
2. **Clear app cache**: Settings → Storage → Clear Cache
3. **Reinstall**: Uninstall and reinstall (backup recovery phrase first!)

### App Authorization Fails

**Symptom**: Pubky Ring doesn't authorize app requests

**Solutions**:
1. **Check app URL**: Ensure correct app origin
2. **Re-scan QR code**: Try authorization flow again
3. **Check Ring permissions**: Ensure app has necessary permissions

---

## Network & Performance Issues

### Slow PKARR Lookups

**Symptom**: Discovery takes a long time

**Solutions**:
1. **Use PKARR relay**: Faster than direct DHT:
   ```javascript snippet="snippets/js/src/troubleshooting.ts:js_pkarr_relay_config"
   ```

2. **Cache aggressively**: Store resolved Homeserver public keys:
   ```javascript snippet="snippets/js/src/troubleshooting.ts:js_cache_homeserver_lookup"
   ```

3. **Use local PKDNS**: Run your own PKDNS server for faster resolution

### High Latency Requests

**Symptom**: Homeserver operations are slow

**Solutions**:
1. **Choose geographically close Homeserver**
2. **Check Homeserver load**: May be overloaded
3. **Use CDN**: Cache static data
4. **Optimize request batching**: Group operations

---

## Common Error Messages

### "Failed to fetch PKARR record"

**Causes**: DHT unreachable, record doesn't exist, network issues

**Solutions**:
- Check internet connection
- Verify record was published
- Try different PKARR relay
- Wait for DHT propagation

### "Homeserver not found"

**Causes**: PKARR record has no Homeserver entries, DNS resolution failed

**Solutions**:
- Verify PKARR record contains Homeserver URL
- Check PKDNS is working
- Test direct Homeserver URL access

### "Session expired"

**Causes**: The SDK could not refresh the bearer token, or the underlying grant was revoked or expired

**Solutions**:
- Check connectivity to the Homeserver and retry
- Sign in again if the grant is no longer valid

### "Permission denied"

**Causes**: Trying to access/modify unauthorized data

**Solutions**:
- Check the session's granted capabilities
- For directory scopes, include the trailing slash (for example, `/pub/my-app/:rw`)
- Verify you own the data
- Request proper permissions

---

## Getting Help

### Community Support

- **Telegram**: [t.me/pubkycore](https://t.me/pubkycore)
- **GitHub Issues**: [github.com/pubky/pubky-homeserver/issues](https://github.com/pubky/pubky-homeserver/issues)
- **Documentation**: [Knowledge Base](/)

### Reporting Bugs

When reporting bugs, include:

1. **Environment**: OS, browser/platform version, SDK version
2. **Steps to reproduce**: Exact sequence that causes the issue
3. **Error messages**: Full error text and stack traces
4. **Expected vs actual**: What should happen vs what happens
5. **Logs**: Relevant logs from Homeserver/client

**Example:**
```markdown
## Environment
- OS: macOS 14.2
- SDK: @synonymdev/pubky@0.10.0
- Browser: Chrome 120

## Steps to Reproduce
1. Call `await session.storage.putText('/pub/test/file.json', data)`
2. Observe error

## Error Message
```
Error: Failed to PUT /pub/test/file.json: 500 Internal Server Error
```

## Expected
Data should be stored successfully

## Actual
500 error returned
```

### Useful Debugging Tools

**Set Log Level:**
```javascript snippet="snippets/js/src/troubleshooting.ts:js_enable_debug_logging"
```

**Browser DevTools:**
```text
Open DevTools → Network tab → Filter: pubky
```

**Command Line:**
```bash
# Test PKARR
curl "https://pkarr.pubky.org/<public-key>"

# Check DNS
dig @8.8.8.8 <public-key>

# Test PKDNS
dig @pkdns.pkarr.org <public-key>
```

**Pubky CLI:**
```bash
# Check user info
pubky-cli user session ./recovery.file

# Test data operations
pubky-cli user get /pub/test ./recovery.file
```

For operator commands and credential configuration, follow the [Pubky CLI documentation](https://github.com/pubky/pubky-cli).
