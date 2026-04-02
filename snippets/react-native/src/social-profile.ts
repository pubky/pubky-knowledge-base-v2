declare const secretKey: string;
declare const homeserverUrl: string;

// --8<-- [start:rn_social_profile]
import { signUp, put, get } from "@synonymdev/react-native-pubky";

// Sign up
const signUpRes = await signUp(secretKey, homeserverUrl);
if (signUpRes.isErr()) throw new Error(signUpRes.error.message);

// Create profile (following pubky-app-specs)
const profile = {
  name: "Alice",
  bio: "Building on Pubky",
  image: "pubky://alice-pubkey/pub/profile.jpg",
  links: [{ title: "Website", url: "https://alice.com" }],
};

// Write profile
const putRes = await put(
  "pubky://alice-pubkey/pub/pubky.app/profile.json",
  { data: JSON.stringify(profile) },
  secretKey,
);

// Read profile
const getRes = await get("pubky://alice-pubkey/pub/pubky.app/profile.json");
if (getRes.isErr()) throw getRes.error;
const savedProfile = JSON.parse(getRes.value);
// --8<-- [end:rn_social_profile]
