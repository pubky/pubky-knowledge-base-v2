import type { PublicKey } from "@synonymdev/pubky";

declare const homeserverPk: PublicKey;

// --8<-- [start:js_getting_started_quick_example]
import { Pubky, Keypair } from "@synonymdev/pubky";

// Create client and signer
const pubky = new Pubky();
const signer = pubky.signer(Keypair.random());

// Sign up (pass signup token for gated homeservers, null for open/testnet)
const session = await signer.signup(homeserverPk, null);
console.log("Your pubky:", signer.publicKey.z32());

// Store data
await session.storage.putJson("/pub/myapp/profile", {
  name: "Alice",
  bio: "Building on Pubky!",
  avatar: "https://example.com/avatar.jpg",
});

// Retrieve data
const profile = await session.storage.getJson("/pub/myapp/profile");
console.log("Profile:", profile);

// List directory
const files = await session.storage.list("/pub/myapp/");
console.log("Files:", files);

// Sign out
await session.signout();
// --8<-- [end:js_getting_started_quick_example]

async function snippet_nexus_global_feed() {
  // --8<-- [start:js_nexus_global_feed]
  const response = await fetch("https://nexus.pubky.app/v0/feeds/global");
  const posts = await response.json();
  // --8<-- [end:js_nexus_global_feed]
}
