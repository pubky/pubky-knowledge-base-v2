async function snippet_nexus_global_feed() {
  // --8<-- [start:js_nexus_global_feed]
  const response = await fetch("https://nexus.pubky.app/v0/feeds/global");
  const posts = await response.json();
  // --8<-- [end:js_nexus_global_feed]
}
