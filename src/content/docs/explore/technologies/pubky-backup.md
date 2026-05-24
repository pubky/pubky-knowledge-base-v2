---
title: "Pubky Backup"
---

**Pubky Backup** is a public desktop application for keeping local copies of a Pubky user's published Homeserver data.

- **GitHub**: https://github.com/pubky/pubky-backup
- **Platforms**: macOS, Windows, Debian Linux, and AppImage-compatible Linux
- **Purpose**: Local backup, snapshots, and data portability for [credible exit](/explore/concepts/credible-exit/)

Pubky Backup watches one or more pubkys, downloads public `/pub/...` resources from their [Homeservers](/explore/pubkycore/homeserver/), and stores them in regular local files.

## Install

Download a build from the [v0.5.0 release page](https://github.com/pubky/pubky-backup/releases/tag/v0.5.0):

- **macOS**: Download the signed `macos-amd64` or `macos-arm64` tarball, extract it, and run the app.
- **Windows**: Download and run the `.msi` installer.
- **Debian Linux**: Download the `.deb` package and install it, for example:
  ```bash
  sudo apt install ./pubky-backup-v0.5.0-linux-amd64.deb
  ```
- **Other Linux distributions**: Download the `.AppImage`, make it executable, and run it:
  ```bash
  chmod +x pubky-backup-v0.5.0-linux-amd64.AppImage
  ./pubky-backup-v0.5.0-linux-amd64.AppImage
  ```

## Core Features

- **Multi-pubky backup**: Add multiple pubky public keys and sync them in the background.
- **Published-data backup**: Mirrors public `/pub/...` resources into local per-pubky folders.
- **Event-based sync**: Uses Homeserver event streams with cursor tracking so restarts continue from the last processed event.
- **Configurable interval**: Defaults to 5 minutes; the UI offers 30 seconds, 5, 10, 15, 30, and 60 minute intervals.
- **Manual force sync**: Trigger an immediate sync for a selected pubky.
- **Activity log**: Records initial backups, files backed up, snapshots, and sync failures.
- **Snapshots**: Creates timestamped `.zip` archives of a pubky's backed-up data.
- **Movable backup location**: Move the local `keys` directory from the settings page.
- **System tray status**: Keeps syncing in the background and shows aggregate sync/error state.

## How It Works

1. The user enters a pubky public key.
2. The app validates the key, discovers its Homeserver through PKDNS, and checks that `/pub/` data is available.
3. A backup controller subscribes to that pubky's Homeserver event stream in batches.
4. `PUT` events download the changed resource and write it locally.
5. `DELETE` events remove the local copy.
6. The app persists a cursor so the next sync resumes from the last processed event.

The default storage root is `~/.pubky-backup`. Backed-up data is stored under `keys/<pubky>/data/`, while sync state, activity logs, and snapshots are stored alongside it:

```text
~/.pubky-backup/
|-- config.json
|-- logs/
|   `-- error.log
`-- keys/
    `-- <pubky>/
        |-- state/
        |   |-- cursor
        |   `-- activity.log
        |-- data/
        |   `-- pub/
        |       `-- ...
        `-- snapshots/
            `-- <timestamp>.zip
```

## Role in Credible Exit

Pubky Backup makes credible exit more practical by reducing the risk that a Homeserver outage, policy change, or shutdown leaves a user without a copy of their published data. With a current backup, a user can inspect their own data, preserve a point-in-time snapshot, and prepare a migration to another Homeserver.

The current release is a **backup tool, not an automated restore tool**. Re-uploading backed-up data to a new Homeserver is currently a manual workflow using Pubky tooling such as the SDK or [Pubky CLI](/explore/technologies/pubky-cli/). Homeserver mirroring and seamless failover are still planned separately.

## Limitations

- Pubky Backup only backs up data that is available under public `/pub/...` paths.
- It does not back up a user's private key or recovery phrase. Use [Pubky Ring](/explore/technologies/pubky-ring/) recovery material for identity backup.
- It does not currently provide one-click restore or re-upload into a new Homeserver.
- It is not a tamper-proof audit log. Until data signing and mirroring are implemented, a local backup mainly improves availability and portability.

See the [repository](https://github.com/pubky/pubky-backup) for source code, build instructions, and development notes.
