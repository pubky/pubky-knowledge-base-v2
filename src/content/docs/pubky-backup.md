---
title: "Pubky Backup"
description: "Keep local copies and snapshots of your Homeserver data. Learn what Pubky Backup protects and how it differs from identity key backup."
---

**[Pubky Backup](https://github.com/pubky/pubky-backup)** keeps a local copy of files from a Homeserver. It helps preserve access to your files if your hosting provider becomes unavailable or [you decide to leave](/credible-exit/).

Add a public key to back up that identity's public files. To include your private files, sign in to Pubky Backup and approve read access in [Pubky Ring](/pubky-ring/).

## What a backup protects

- **Identity key backup:** lets you recover control of your identity. Manage this separately through [Pubky Ring](/pubky-ring/).
- **Synchronized data copy:** keeps a local copy of your Homeserver files.
- **Snapshot:** preserves a point-in-time copy of your backup.

Local copies and snapshots preserve the original file contents. Anyone with access to the backup location can read files stored without encryption. Signing out stops private sync and keeps existing copies on disk.

Keeping both your keys and your data makes [credible exit](/credible-exit/) more practical. Moving to another Homeserver still requires you to restore your files manually.

See the [Pubky Backup README](https://github.com/pubky/pubky-backup/blob/main/README.md) for downloads and setup. The [core library documentation](https://github.com/pubky/pubky-backup/blob/main/src-tauri/pubky-backup-core/README.md#private-data-signing-in) explains how private file sync works.
