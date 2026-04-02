// --8<-- [start:rn_key_management]
import {
  generateSecretKey,
  getPublicKeyFromSecretKey,
  createRecoveryFile,
  decryptRecoveryFile,
} from "@synonymdev/react-native-pubky";

// Generate new key pair
const keyRes = await generateSecretKey();
if (keyRes.isErr()) throw keyRes.error;
const secretKey = keyRes.value.secret_key;

// Derive public key
const pubKeyRes = await getPublicKeyFromSecretKey(secretKey);
if (pubKeyRes.isErr()) throw pubKeyRes.error;
const publicKey = pubKeyRes.value.public_key;

// Create encrypted recovery file
const recoveryRes = await createRecoveryFile(secretKey, "passphrase");
if (recoveryRes.isErr()) throw recoveryRes.error;
const recoveryFile = recoveryRes.value; // Base64 encoded

// Decrypt recovery file
const decryptRes = await decryptRecoveryFile(recoveryFile, "passphrase");
if (decryptRes.isErr()) throw decryptRes.error;
const recoveredKey = decryptRes.value;
// --8<-- [end:rn_key_management]
