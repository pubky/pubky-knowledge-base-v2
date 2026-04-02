declare const secretKey: string;
declare const publicKey: string;

// --8<-- [start:rn_auth]
import {
  signUp,
  signIn,
  signOut,
  revalidateSession,
  getHomeserver,
} from "@synonymdev/react-native-pubky";

// Standard signup
const signUpRes = await signUp(
  secretKey,
  "pubky://8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo",
);

// Signup with token (for gated homeservers)
const signUpWithTokenRes = await signUp(
  secretKey,
  "pubky://8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo",
  "your_signup_token",
);

// Sign in
const signInRes = await signIn(secretKey);

// Get homeserver
const homeserverRes = await getHomeserver(publicKey);
// --8<-- [end:rn_auth]
