---
title: "Pubky Explorer"
---

**Pubky Explorer** is a web-based file browser for exploring public data stored on [Pubky Homeservers](/explore/pubky-protocol/homeserver/). It is useful for inspecting the files behind an app's view of that data.

**Live Application**: [https://explorer.pubky.app](https://explorer.pubky.app)

Enter a public key or a Pubky URI to browse its public directories and inspect individual files. For app developers, this helps answer concrete questions: was a record written, is it at the expected path, and what does its JSON contain?

Explorer shows stored files, while [Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/) builds indexed views across users. A file can exist on a Homeserver before it appears in an app's indexed view. Explorer is therefore useful when separating a storage problem from an indexing or display problem.

Use the [testnet Explorer](https://explorer.pubky.app/testnet/) to inspect data created in the [Getting Started guide](/explore/pubky-protocol/getting-started/). Public network data and local testnet data use different discovery networks, so choose the corresponding Explorer.

See the [Pubky Explorer README](https://github.com/pubky/pubky-explorer/blob/main/README.md) for the usage demonstration, testnet connection, and development setup.
