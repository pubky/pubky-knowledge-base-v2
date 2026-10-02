---
title: "Pubky Docker"
---

**[Pubky Docker](https://github.com/pubky/pubky-docker)** runs a full local Pubky environment, including Pubky Homeserver, Homegate, and the Pubky 'social' components Pubky Nexus and pubky.app.

Use it to develop an app against a disposable local testnet, or to test changes across the social application's components. The [Developer Guide](/explore/pubky-protocol/developer-guide/) uses it to provide a Homeserver for your first app. You do not need to run the full stack for every SDK integration.

:::caution[Warning]
Pubky Docker is intended for local development, testing, and experimentation—not production hosting.
:::

## Testnet Architecture

The stack includes a local DHT and PKARR relay for discovery, an HTTP relay for authentication, and Homegate for signup. A simple SDK app needs the Homeserver and local protocol services; the social stack also provides Nexus and pubky.app.

The following simplified diagram shows the default local testnet topology:

```mermaid
flowchart TB
    Browser["Browser<br/>pubky.app client"]

    subgraph Stack[" "]
        direction TB
        StackLabel@{ shape: text, label: "Docker — testnet" }
        App["pubky.app"]
        Nexus["Pubky Nexus"]
        Homegate["Homegate"]

        subgraph PubkyDockerTestnet[" "]
            direction TB
            Homeserver["Pubky Homeserver<br/><small>8pinxxgqs41n4aididenw5apqp<br/>1urfmzdztr8jt4abrkdn435ewo</small>"]
            Services["Local testnet services<br/>DHT · PKARR relay · HTTP relay"]
            TestnetLabel@{ shape: text, label: "Pubky testnet" }
            TestnetSpacer@{ shape: text, label: "Pubky testnet" }
        end

        style TestnetSpacer color:transparent
        StackLabel ~~~ App
        App -->|social API| Nexus
        App -->|user data| Homeserver
        App <-->|PKARR and auth| Services
        Nexus --> Homeserver
        Homegate --> Homeserver
        Homeserver ---|discovery and auth| Services
        Services ~~~ TestnetLabel
        Services ~~~ TestnetSpacer
    end

    Authenticator["Authenticator<br/>(e.g.&nbsp;simulator.pubkyring.app)"]
    Browser ~~~ StackLabel
    Browser -->|loads frontend| App
    Browser -->|signup| Homegate
    TestnetLabel ~~~ Authenticator
    TestnetSpacer ~~~ Authenticator
    Authenticator -->|auth| Services
```

For authorization during local development, the [Ring Simulator](https://simulator.pubkyring.app/) can act as the authenticator. The [authentication overview](/explore/pubky-protocol/authentication/) explains that flow.

For setup, configuration, and running specific component revisions, see the [Pubky Docker README](https://github.com/pubky/pubky-docker/blob/main/Readme.md).

Check running component versions with [`./list-component-versions.sh`](https://github.com/pubky/pubky-docker/blob/main/list-component-versions.sh).
