import {
  Pubky,
  Keypair,
  PublicKey,
  AuthFlowKind,
  type Address,
  Session,
  EventStreamBuilder,
} from "@synonymdev/pubky";

// Context variables — provided by surrounding code in the docs
declare const pubky: Pubky;
declare const keypair: Keypair;
declare const homeserverPk: PublicKey;
declare const signupToken: string | null;
declare const session: Session;
declare const profile: Record<string, unknown>;
declare const userPk: string;

async function snippet_signup() {
  // --8<-- [start:js_signup]
  const signer = pubky.signer(keypair);
  const session = await signer.signup(homeserverPk, signupToken);
  // --8<-- [end:js_signup]
}

async function snippet_signin() {
  // --8<-- [start:js_signin]
  const signer = pubky.signer(keypair);
  const session = await signer.signin();
  // --8<-- [end:js_signin]
}

async function snippet_put() {
  // --8<-- [start:js_put]
  await session.storage.putJson("/pub/myapp/profile", profile);
  // --8<-- [end:js_put]
}

async function snippet_get() {
  // --8<-- [start:js_get]
  const profile = await session.storage.getJson("/pub/myapp/profile");
  // --8<-- [end:js_get]
}

async function snippet_delete() {
  // --8<-- [start:js_delete]
  await session.storage.delete("/pub/myapp/profile");
  // --8<-- [end:js_delete]
}

async function snippet_list() {
  // --8<-- [start:js_list]
  const entries = await session.storage.list(
    "/pub/myapp/posts/",
    null,
    false,
    20,
  );

  for (const url of entries) {
    console.log(url);
  }
  // --8<-- [end:js_list]
}

async function snippet_public_read() {
  // --8<-- [start:js_public_read]
  const text = await pubky.publicStorage.getText(
    `pubky://${userPk}/pub/myapp/profile` as Address,
  );
  // --8<-- [end:js_public_read]
}

async function snippet_events() {
  // --8<-- [start:js_events]
  const user = PublicKey.from(
    "o1gg96ewuojmopcjbz8895478wdtxtzzuxnfjjz8o8e77csa1ngo",
  );

  const stream = await pubky.eventStreamForUser(user, null).live().subscribe();

  for await (const event of stream) {
    console.log(`${event.eventType}: ${event.resource.path}`);
    // event.eventType: "PUT" or "DEL"
    // event.cursor: string (for pagination/resumption)
    // event.contentHash: base64 string (PUT only) or undefined
  }
  // --8<-- [end:js_events]
}

async function snippet_check_resource() {
  // --8<-- [start:js_check_resource]
  // Check if a resource exists (lightweight HEAD request)
  const exists = await session.storage.exists("/pub/myapp/profile");

  // Get resource metadata without downloading the body
  const stats = await session.storage.stats("/pub/myapp/profile");
  if (stats) {
    console.log("Size:", stats.contentLength);
    console.log("Type:", stats.contentType);
    console.log("ETag:", stats.etag);
  }

  // Also available on public storage
  const publicExists = await pubky.publicStorage.exists(
    `pubky://${userPk}/pub/myapp/profile` as Address,
  );
  // --8<-- [end:js_check_resource]
}

async function snippet_signin_blocking() {
  // --8<-- [start:js_signin_blocking]
  const signer = pubky.signer(keypair);

  // Fast: PKDNS refresh happens in the background
  const session = await signer.signin();

  // Blocking: waits for PKDNS to be discoverable (~3-5s)
  // Use this when you need the user's homeserver to be resolvable immediately
  const sessionBlocking = await signer.signinBlocking();
  // --8<-- [end:js_signin_blocking]
}

async function snippet_session_persistence() {
  // --8<-- [start:js_session_persistence]
  // Export session as a portable string (e.g. save to storage before shutdown)
  const exported = session.export();

  // On restart, restore without re-authenticating
  const restored = await Session.restore(exported);
  // --8<-- [end:js_session_persistence]
}

async function snippet_auth_flow_resume() {
  // --8<-- [start:js_auth_flow_resume]
  const flow = pubky.startAuthFlow("/pub/myapp/:rw", AuthFlowKind.signin());

  // Store only for the short relay TTL; authorizationUrl contains a secret.
  sessionStorage.setItem("pubky-auth-url", flow.authorizationUrl);

  // After a refresh, reconnect to the same relay channel.
  const saved = sessionStorage.getItem("pubky-auth-url");
  const resumed = saved ? pubky.resumeAuthFlow(saved) : flow;

  const session = await resumed.awaitApproval();
  sessionStorage.removeItem("pubky-auth-url");
  // --8<-- [end:js_auth_flow_resume]
}

function snippet_custom_auth_relay() {
  // --8<-- [start:js_custom_auth_relay]
  const relay = "https://httprelay.example.com/inbox/";
  const flow = pubky.startAuthFlow(
    "/pub/myapp/:rw",
    AuthFlowKind.signin(),
    relay,
  );
  // --8<-- [end:js_custom_auth_relay]
}

async function snippet_error_handling() {
  // --8<-- [start:js_error_handling]
  try {
    const text = await session.storage.getText("/pub/myapp/data");
    console.log("Retrieved:", text);
  } catch (e) {
    const error = e as import("@synonymdev/pubky").PubkyError;
    switch (error.name) {
      case "RequestError":
        console.error("Network or server error:", error.message);
        break;
      case "InvalidInput":
        console.error("Invalid input:", error.message);
        break;
      case "AuthenticationError":
        console.error("Authentication failed:", error.message);
        break;
      case "PkarrError":
        console.error("PKARR resolution failed:", error.message);
        break;
      case "ClientStateError":
        console.error("Client state error:", error.message);
        break;
      case "InternalError":
        console.error("Internal SDK error:", error.message);
        break;
      // --8<-- [skip:start]
      default: {
        // Build-time check: tsc rejects this assignment if the SDK adds
        // a new PubkyErrorName variant — `error.name` would no longer
        // narrow to `never` here. The throw is a runtime safety net,
        // not the check itself.
        const exhaustive: never = error.name;
        throw new Error(`Unhandled error: ${exhaustive}`, { cause: e });
      }
      // --8<-- [skip:end]
    }
  }
  // --8<-- [end:js_error_handling]
}
