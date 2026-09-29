declare const secretKey: string;
declare const homeserverUrl: string;

// --8<-- [start:rn_basic_usage]
import {
  signUp,
  signIn,
  put,
  get,
  list,
  deleteFile,
  generateSecretKey,
  getPublicKeyFromSecretKey,
} from "@synonymdev/react-native-pubky";

const clientId = "my-app.example";

// All methods return Result type
const result = await signUp(secretKey, homeserverUrl, undefined, clientId);
if (result.isErr()) {
  console.error(result.error.message);
} else {
  console.log(result.value.pubky); // Public identity
}
// --8<-- [end:rn_basic_usage]
