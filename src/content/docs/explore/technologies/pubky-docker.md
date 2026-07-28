---
title: "Pubky Docker"
---

**[Pubky Docker](https://github.com/pubky/pubky-docker)** runs a full local Pubky environment, including Pubky Homeserver, Homegate, and the Pubky Social components Pubky Nexus and pubky.app.

:::caution[Warning]
Pubky Docker is intended for local development, testing, and experimentation—not production hosting.
:::

For current setup instructions, configuration, and development workflows, see the [Pubky Docker README](https://github.com/pubky/pubky-docker#readme).

## Testnet Architecture

The following simplified diagram shows the default local testnet topology. The DHT, [PKARR relay](/explore/pubkycore/pkarr/architecture/), and [HTTP relay](/explore/technologies/http-relay/) run locally inside the `homeserver` service.

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
            TestnetLabel@{ shape: text, label: "Pubky Core testnet" }
            TestnetSpacer@{ shape: text, label: "Pubky Core testnet" }
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

## Build from Source

Build from source when you need to run specific component revisions or test changes to the stack.

To build from source, you need the Pubky component repositories. The easiest path is to let the helper script clone and prepare them for you:

```bash
./pubky-docker-cli.sh
```

The script pulls the required repositories, lets you choose Git refs for each component, builds the images, and starts the stack. To inspect which component versions are running in your containers, use:

```bash
./list-component-versions.sh
```

See the [Pubky Docker source setup instructions](https://github.com/pubky/pubky-docker#local-setup-from-source) for more details.

## Links

- [Source repository](https://github.com/pubky/pubky-docker)
- [Published Docker images](https://hub.docker.com/u/synonymsoft)

## Related Documentation

- [Pubky Homeserver](/explore/pubkycore/homeserver/)
- [Pubky Nexus](/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/)
- [Homegate](/explore/technologies/homegate/)
- [pubky.app](/explore/pubky-apps/reference-app/pubky-app/)
