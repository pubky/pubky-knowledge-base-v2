---
title: "Pubky Passport"
description: "Create and recover a Pubky identity with Google and sign in to Pubky apps from your browser."
---

Pubky Passport is a browser-based signer for Pubky. It lets you create an identity and approve sign-in requests from Pubky apps without installing a mobile app. It plays a similar role to [Pubky Ring](/explore/technologies/pubky-ring/), which manages identities on your phone.

[Open Pubky Passport](https://passport.pubky.app/) and choose **Continue with Google**. Passport creates your Pubky identity or restores the one backed up for that Google account. When an app asks to sign in, you review its requested permissions before approving access.

## Identity and recovery

Passport creates and uses your secret key in the browser, with an encrypted backup in your Google Drive. Recovering that backup requires both Google access and the Passport service; neither can recover it alone.

You can download a password-protected recovery file or move your identity to Pubky Ring. Do this before detaching Google: detachment deletes the Drive backups and leaves your identity in the browser, making independent recovery essential if you lose that browser's data.

See the [Passport README](https://github.com/pubky/pubky-passport/blob/main/README.md) for details. Developers adding Passport sign-in should follow the upstream [integration guide](https://github.com/pubky/pubky-passport/blob/main/docs/integration.md).
