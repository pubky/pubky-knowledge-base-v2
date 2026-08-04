import { Pubky, Keypair, AuthFlowKind } from "@synonymdev/pubky";

// --8<-- [start:js_quick_example]
// Initialize
const pubky = new Pubky();
const keypair = Keypair.random();

// Sign in (user already has an account on a homeserver)
const signer = pubky.signer(keypair);
const session = await signer.signin("myapp.example");

// Write data
await session.storage.putJson("/pub/myapp/profile", {
  name: "Alice",
  bio: "Building on Pubky!",
});

// Read data
const profile = await session.storage.getJson("/pub/myapp/profile");
// --8<-- [end:js_quick_example]

async function snippet_custom_auth_relay() {
  // --8<-- [start:js_custom_auth_relay]
  const relay = "https://httprelay.example.com/inbox/";
  const flow = pubky.startGrantAuthFlow(
    "/pub/myapp/:rw",
    AuthFlowKind.signin(),
    { clientId: "myapp.example", relay },
  );
  // --8<-- [end:js_custom_auth_relay]
}
