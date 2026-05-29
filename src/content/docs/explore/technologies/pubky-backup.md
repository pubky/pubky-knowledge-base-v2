---
title: "Pubky Backup"
---

**Pubky Backup** is the desktop backup app for maintaining a local copy of published Homeserver data.

- **Repository**: [github.com/pubky/pubky-backup](https://github.com/pubky/pubky-backup)
- **Downloads and install notes**: [Pubky Backup README](https://github.com/pubky/pubky-backup/blob/main/README.md)
- **Core architecture and API**: [pubky-backup-core README](https://github.com/pubky/pubky-backup/blob/main/src-tauri/pubky-backup-core/README.md)

Pubky Backup targets published `/pub/...` data from [Homeservers](/explore/pubkycore/homeserver/). It complements [Pubky Ring](/explore/technologies/pubky-ring/): Ring protects identity keys while Backup protects a local copy of published data.

## Role in Credible Exit

Pubky Backup makes credible exit more practical by reducing the risk that a Homeserver outage, policy change, or shutdown leaves a user without a copy of their published data. With a current backup, a user can inspect their own data, preserve a point-in-time snapshot, and prepare a migration to another Homeserver.

Pubky Backup backs up published data and supports snapshots. There is no dedicated tool yet for re-uploading backed-up data to a new Homeserver, but it can be done manually with Pubky tooling such as the SDK. Homeserver mirroring and seamless failover are planned separately.

## Limitations

- Published data backup is separate from identity key backup. Keep your [Pubky Ring](/explore/technologies/pubky-ring/) recovery phrase secure.
- Local backup improves availability and portability, but it is not Homeserver mirroring or automatic failover.
