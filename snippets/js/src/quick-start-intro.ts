import type { PublicKey } from "@synonymdev/pubky";

declare const homeserverPk: PublicKey;

// --8<-- [start:js_intro_quick_example]
import { Pubky, Keypair } from "@synonymdev/pubky";

// Create client and signer
const pubky = new Pubky();
const signer = pubky.signer(Keypair.random());

// Sign up (pass signup token for gated homeservers, null for open/testnet)
await signer.signup(homeserverPk, null);
const session = await signer.signin("myapp.example");

// Store data
await session.storage.putJson("/pub/myapp/profile", {
  name: "Alice",
  bio: "Decentralized and loving it!",
});

// Retrieve data
const profile = await session.storage.getJson("/pub/myapp/profile");
// --8<-- [end:js_intro_quick_example]
