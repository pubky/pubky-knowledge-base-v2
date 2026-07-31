import {
  Client,
  Pubky,
  PublicKey,
  setLogLevel,
  type Path,
  type PubkyError,
  type Session,
  type Signer,
} from "@synonymdev/pubky";

declare const signer: Signer;
declare const session: Session;
declare const homeserverPk: PublicKey;
declare const data: string;

async function snippet_publish_pkdns_record() {
  // --8<-- [start:js_publish_pkdns_record]
  await signer.pkdns.publishHomeserverForce(homeserverPk);
  // --8<-- [end:js_publish_pkdns_record]
}

function snippet_republish_pkdns_record() {
  // --8<-- [start:js_republish_pkdns_record]
  // Periodically check whether the record is stale before republishing
  setInterval(
    async () => {
      await signer.pkdns.publishHomeserverIfStale(homeserverPk);
    },
    2 * 60 * 60 * 1000,
  ); // Every 2 hours
  // --8<-- [end:js_republish_pkdns_record]
}

async function snippet_reauth() {
  // --8<-- [start:js_reauth]
  const session = await signer.signin("myapp.example");
  // --8<-- [end:js_reauth]
}

async function snippet_force_reauth() {
  // --8<-- [start:js_force_reauth]
  // Force re-authentication
  await session.signout();
  const newSession = await signer.signin("myapp.example");
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
  await session.storage.putText("/pub/myapp/data.json", data);

  // Invalid paths:
  // - "data.json"
  // - "/myapp/data.json"
  // --8<-- [end:js_valid_storage_path]
}

function typecheck_invalid_storage_paths() {
  // These intentionally stay outside the rendered docs. They verify that
  // TypeScript still rejects the invalid paths described above.
  // @ts-expect-error Path must start with /pub/.
  void session.storage.putText("data.json", data);
  // @ts-expect-error Path must start with /pub/.
  void session.storage.putText("/myapp/data.json", data);
}

function statusCodeOf(error: unknown): number | undefined {
  const data = (error as PubkyError).data;
  if (typeof data !== "object" || data === null || !("statusCode" in data)) {
    return undefined;
  }

  return (data as { statusCode?: number }).statusCode;
}

// --8<-- [start:js_put_with_retry]
async function putWithRetry(
  session: Session,
  path: Path,
  data: string,
  retries = 3,
): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      return await session.storage.putText(path, data);
    } catch (error) {
      if (statusCodeOf(error) === 429) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }

  throw new Error("PUT failed after retrying rate limits");
}
// --8<-- [end:js_put_with_retry]

function snippet_pkarr_relay_config() {
  // --8<-- [start:js_pkarr_relay_config]
  const client = new Client({
    pkarr: {
      relays: ["https://pkarr.pubky.org"],
    },
  });

  const pubky = Pubky.withClient(client);
  // --8<-- [end:js_pkarr_relay_config]
}

const homeserverCache = new Map<string, PublicKey>();

// --8<-- [start:js_cache_homeserver_lookup]
async function getCachedHomeserver(
  pubky: Pubky,
  userPublicKey: string,
): Promise<PublicKey | undefined> {
  const cached = homeserverCache.get(userPublicKey);
  if (cached) return cached;

  const user = PublicKey.from(userPublicKey);
  const homeserver = await pubky.getHomeserverOf(user);

  if (homeserver) {
    homeserverCache.set(userPublicKey, homeserver);
  }

  return homeserver;
}
// --8<-- [end:js_cache_homeserver_lookup]

function snippet_enable_debug_logging() {
  // --8<-- [start:js_enable_debug_logging]
  // Call once at application startup, before creating Pubky or Client instances.
  setLogLevel("debug");

  // --8<-- [end:js_enable_debug_logging]
}
