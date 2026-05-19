declare const pubky: any;
declare const signer: any;
declare const session: any;
declare const data: string;
declare const publicKey: string;

async function snippet_publish_pkdns_record() {
  // --8<-- [start:js_publish_pkdns_record]
  await pubky.publishPkarrRecord();
  // --8<-- [end:js_publish_pkdns_record]
}

function snippet_republish_pkdns_record() {
  // --8<-- [start:js_republish_pkdns_record]
  // Automatic republishing
  setInterval(async () => {
    await pubky.publishPkarrRecord();
  }, 2 * 60 * 60 * 1000); // Every 2 hours
  // --8<-- [end:js_republish_pkdns_record]
}

async function snippet_reauth() {
  // --8<-- [start:js_reauth]
  const session = await signer.signin();
  // --8<-- [end:js_reauth]
}

async function snippet_force_reauth() {
  // --8<-- [start:js_force_reauth]
  // Force re-authentication
  await session.signout();
  const newSession = await signer.signin();
  // --8<-- [end:js_force_reauth]
}

function snippet_direct_homeserver_url() {
  // --8<-- [start:js_direct_homeserver_url]
  // In browser, use full HTTPS URL
  const url = `https://your-homeserver.com/pub/...`;
  // --8<-- [end:js_direct_homeserver_url]
}

async function snippet_valid_storage_path() {
  // --8<-- [start:js_valid_storage_path]
  // ✅ Correct
  await session.storage.putText('/pub/myapp/data.json', data);

  // ❌ Wrong — path must start with /pub/
  await session.storage.putText('data.json', data);
  await session.storage.putText('/myapp/data.json', data);
  // --8<-- [end:js_valid_storage_path]
}

// --8<-- [start:js_put_with_retry]
async function putWithRetry(session, path, data, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await session.storage.putText(path, data);
    } catch (e) {
      if (e.status === 429) { // Too Many Requests
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      } else throw e;
    }
  }
}
// --8<-- [end:js_put_with_retry]

// --8<-- [start:js_put_with_retry_api]
async function putWithRetryApi(session, path, data, retries = 3) {
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
// --8<-- [end:js_put_with_retry_api]

function snippet_pkarr_relay_config() {
  // --8<-- [start:js_pkarr_relay_config]
  const config = {
    pkarrRelay: 'https://pkarr.pubky.org'
  };
  // --8<-- [end:js_pkarr_relay_config]
}

function snippet_cache_homeserver_lookup() {
  // --8<-- [start:js_cache_homeserver_lookup]
  const cache = new Map();
  if (cache.has(publicKey)) {
    return cache.get(publicKey);
  }
  // --8<-- [end:js_cache_homeserver_lookup]
}

function snippet_enable_debug_logging() {
  // --8<-- [start:js_enable_debug_logging]
  // Enable verbose logging
  localStorage.setItem('pubky:debug', 'true');

  // Check network requests
  // Open DevTools → Network tab → Filter: pubky
  // --8<-- [end:js_enable_debug_logging]
}
