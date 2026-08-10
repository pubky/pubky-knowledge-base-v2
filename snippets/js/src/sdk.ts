import { Pubky, Keypair } from "@synonymdev/pubky";

// --8<-- [start:js_quick_example]
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
