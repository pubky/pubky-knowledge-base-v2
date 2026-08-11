// --8<-- [start:js_getting_started_imports]
import { Keypair, Pubky, PublicKey, setLogLevel } from "@synonymdev/pubky";

try {
  setLogLevel("info");
} catch (error) {
  console.warn(
    "Pubky log level must be set only once, before creating the client.",
    error,
  );
}
// --8<-- [end:js_getting_started_imports]

// --8<-- [start:js_getting_started_testnet]
const pubky = Pubky.testnet();
// --8<-- [end:js_getting_started_testnet]

// --8<-- [start:js_getting_started_identity]
const keypair = Keypair.random();
const signer = pubky.signer(keypair);
// --8<-- [end:js_getting_started_identity]

// --8<-- [start:js_getting_started_signup]
const homeserver = PublicKey.from(
  "pubky8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo",
);

await signer.signup(homeserver, null);
// --8<-- [end:js_getting_started_signup]

// --8<-- [start:js_getting_started_signin]
const session = await signer.signin("myapp.example");
// --8<-- [end:js_getting_started_signin]

// --8<-- [start:js_getting_started_write]
const path = "/pub/hello-world/data.json";
await session.storage.putJson(path, { message: "Hello Pubkyverse!" });
// --8<-- [end:js_getting_started_write]

// --8<-- [start:js_getting_started_read]
const data = await session.storage.getJson(path);
document.querySelector<HTMLDivElement>("#app")!.textContent = JSON.stringify(
  data,
  null,
  2,
);
// --8<-- [end:js_getting_started_read]

// --8<-- [start:js_custom_auth_relay]
import { AuthFlowKind } from "@synonymdev/pubky";

const relay = "https://httprelay.example.com/inbox/";
const flow = pubky.startGrantAuthFlow("/pub/myapp/:rw", AuthFlowKind.signin(), {
  clientId: "myapp.example",
  relay,
});
// --8<-- [end:js_custom_auth_relay]
