---
title: "Self-host a Homeserver on Umbrel"
description: "Install and run a Pubky Homeserver on umbrelOS with a packaged dashboard and account-free public access."
---

The [Pubky Homeserver Umbrel app](https://github.com/pubky/umbrel-app-store) is a packaged way to run your own [Homeserver](/explore/pubkycore/homeserver/) on an Umbrel. It bundles the Homeserver, its database, an admin dashboard, and optional public access through Cloudflare Tunnel.

:::caution[Experimental]
The Umbrel package is experimental and is currently distributed through a Pubky community app store while it is in beta.
:::

## Install

1. In Umbrel, open **App Store**.
2. Select the three-dot menu in the top-right, then **Community App Stores**.
3. Enter `https://github.com/pubky/umbrel-app-store` and select **Add**.
4. When the **Pubky** app store appears, select **Open**.
5. Select **Pubky Homeserver**, then **Install**.

When installation finishes, open **Pubky Homeserver** from the Umbrel home screen.

![Pubky Homeserver dashboard on Umbrel showing setup progress, connection details, a temporary public address, and PKARR publication status](/images/pubky-homeserver-umbrel-dashboard.png)

The dashboard is where you create invite codes, manage files, and check whether the Homeserver is reachable and published to the Pubky network.

## Public access with Preview mode

The Umbrel package supports Cloudflare **Preview mode**, which uses an account-free [Quick Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/) to expose the Homeserver over HTTPS without port forwarding. Preview mode is opt-in: if the Overview does not already show **Preview mode**, follow **Make your homeserver reachable**, or open **Settings → Cloudflare** and enable Preview once.

After that, the package handles startup automatically:

1. Cloudflare assigns a random `*.trycloudflare.com` public hostname.
2. The package adds that hostname to the Homeserver configuration.
3. The Homeserver starts and immediately publishes a signed [PKARR](/explore/pubkycore/pkarr/introduction/) record containing the new address.

The hostname is temporary and normally changes whenever the Umbrel app restarts. This is less disruptive than it would be with a conventional server address: user PKARR records point to the Homeserver's stable public key, while the Homeserver's own PKARR record publishes its current network address. Clients that resolve the records again can therefore discover the replacement hostname without changing the user's identity or moving their data.

This reduces the impact of an address change, but does not make Preview mode permanent. The old hostname stops working, and there can be a short period while the app restarts and the updated PKARR record becomes visible.

## Preview mode tradeoffs

| Advantages | Tradeoffs |
| --- | --- |
| No Cloudflare account or domain required | The public hostname is temporary |
| No router port forwarding required | Restarts briefly make the Homeserver unreachable |
| HTTPS public access with automatic PKARR updates on app start | Quick Tunnels are intended for testing, not production |
| The Homeserver public key remains stable when its address changes | Quick Tunnels do not support Server-Sent Events, so live Homeserver event streams and indexing may be delayed or missed |

Cloudflare also limits Quick Tunnels to 200 concurrent in-flight requests. For a stable, fully supported deployment, use the permanent Cloudflare account-and-domain option available under **Settings → Cloudflare**.

## Create your account

:::caution[Pubky Ring does not support this setup yet]
Signing up or signing in to an Umbrel Homeserver with [Pubky Ring](https://pubkyring.app/) does not currently work because Ring cannot yet use the Homeserver's ICANN HTTPS fallback. Support is being addressed.
:::

Once support is available, create an invite code in **Invites**, then scan its QR code with Pubky Ring to create your account on this Homeserver.

:::caution[Keep backups enabled]
Your Homeserver identity and user data live in the app's data directory. Include Pubky Homeserver in your umbrelOS backups; losing that directory means losing the server identity and its stored user data.
:::

For current package changes and troubleshooting, see the maintained [Umbrel installation guide](https://github.com/pubky/umbrel-app-store/blob/master/INSTALL.md) and [release notes](https://github.com/pubky/umbrel-app-store/releases).
