declare const secretKey: string;

// --8<-- [start:rn_data_ops]
import { put, get, list, deleteFile } from "@synonymdev/react-native-pubky";

// Write data
const putRes = await put(
  "pubky://z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty/pub/profile.json",
  { data: JSON.stringify({ name: "Alice", bio: "Builder" }) },
  secretKey,
);

// Read data
const getRes = await get(
  "pubky://z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty/pub/profile.json",
);

// List directory
const listRes = await list(
  "pubky://z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty/pub/posts/",
);

// Delete file
const deleteRes = await deleteFile(
  "pubky://z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty/pub/old-post",
  secretKey,
);
// --8<-- [end:rn_data_ops]
