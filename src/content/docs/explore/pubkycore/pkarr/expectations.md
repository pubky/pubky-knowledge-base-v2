---
title: "expectations"
---

Understanding the expectations and limitations of [PKARR](/explore/pubkycore/pkarr/introduction/) is crucial for effective use. This note outlines what [PKARR](/explore/pubkycore/pkarr/introduction/) is not and what users should expect.

## Not a Storage Platform

[PKARR](/explore/pubkycore/pkarr/introduction/) is not a storage platform. Records are ephemeral and need to be refreshed regularly to remain on the DHT.

## Not a Real-time Communication Medium

[PKARR](/explore/pubkycore/pkarr/introduction/) is not designed for real-time communication. It is optimized for infrequent updates and heavy caching to reduce traffic.

## Rate Limiting and Proof of Work

Expectations include enforcing harsh rate-limiting and possibly demanding proof of work for updates.

## Caching and Propagation Time

Records are heavily cached, and updates might take some time to propagate. In case of a cache miss, querying the [DHT](/explore/technologies/dht/) might take a few seconds.

## Next Steps

For a deeper understanding of why [PKARR](/explore/pubkycore/pkarr/introduction/) was created and its motivation, refer to the [why PKARR?](/explore/pubkycore/pkarr/why-pkarr/) note.
