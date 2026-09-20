---
title: "Pubky Backup"
---

**Pubky Backup** is the desktop backup app for maintaining a local copy of published Homeserver data. It helps preserve access to your files if your hosting provider becomes unavailable or you decide to leave.

## What a backup protects

- **Identity key backup:** lets you recover control of your identity. Manage this separately through [Pubky Ring](/explore/technologies/pubky-ring/).
- **Synchronized data copy:** keeps a local copy of your published Homeserver data.
- **Snapshot:** preserves a point-in-time copy, rather than only following the current published state.

Keeping both your keys and your data makes [credible exit](/explore/concepts/credible-exit/) more practical. Pubky Backup does not provide automatic failover or restoration to another Homeserver; a local copy is one part of preparing to move, not a complete migration workflow.

See the [Pubky Backup README](https://github.com/pubky/pubky-backup/blob/main/README.md) for downloads and setup. The [core library documentation](https://github.com/pubky/pubky-backup/blob/main/src-tauri/pubky-backup-core/README.md) describes synchronization and snapshots.
