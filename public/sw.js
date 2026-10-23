// SICARÚ retail refinement 2026-10-23: retire legacy cached storefronts.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ includeUncontrolled: true, type: "window" });
    await Promise.all(windows.map((client) => client.navigate(client.url)));
  })());
});
