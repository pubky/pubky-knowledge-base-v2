import {
  Pubky,
  Keypair,
  PublicKey,
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
    `${userPk}/pub/myapp/profile` as Address,
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

async function snippet_error_handling() {
  // --8<-- [start:js_error_handling]
  try {
    const text = await session.storage.getText("/pub/myapp/data");
    console.log("Retrieved:", text);
  } catch (e) {
    const error = e as import("@synonymdev/pubky").PubkyError;
    // error.name: "RequestError", "AuthenticationError", "ValidationError", etc.
    console.error(`${error.name}: ${error.message}`);
  }
  // --8<-- [end:js_error_handling]
}
