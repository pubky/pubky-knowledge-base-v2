import { PublicKey } from "@synonymdev/pubky";
declare const homeserverPk: PublicKey;
declare const signupToken: string | null;

// --8<-- [start:js_profile_storage]
import { Pubky, Keypair } from "@synonymdev/pubky";

async function storeProfile() {
  const pubky = new Pubky();
  const keypair = Keypair.random();
  const signer = pubky.signer(keypair);

  // Sign up at a homeserver (null token for open/testnet homeservers)
  const session = await signer.signup(homeserverPk, signupToken);
  console.log(`Public Key: ${signer.publicKey.z32()}`);

  // Store profile (following pubky-app-specs format)
  const profile = {
    name: "Alice",
    bio: "Building on Pubky",
    image: "pubky://user_id/pub/pubky.app/files/0000000000000",
    links: [{ title: "GitHub", url: "https://github.com/alice" }],
    status: "Exploring decentralized tech.",
  };

  // Store at standard pubky-app location
  await session.storage.putJson("/pub/pubky.app/profile.json", profile);
  console.log("Profile stored!");

  // Retrieve profile
  const retrieved = await session.storage.getJson(
    "/pub/pubky.app/profile.json",
  );
  console.log("Retrieved:", retrieved);
}
// --8<-- [end:js_profile_storage]
