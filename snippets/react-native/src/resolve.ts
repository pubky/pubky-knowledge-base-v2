// --8<-- [start:rn_resolve]
import { resolveHttps } from "@synonymdev/react-native-pubky";

// Resolve public key to HTTPS URL
const resolveRes = await resolveHttps(
  "z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty",
);

if (resolveRes.isOk()) {
  console.log(`HTTPS records: ${JSON.stringify(resolveRes.value)}`);
}
// --8<-- [end:rn_resolve]
