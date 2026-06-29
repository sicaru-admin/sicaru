self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key)))),
      self.registration.unregister(),
      self.clients
        .matchAll({ includeUncontrolled: true, type: "window" })
        .then((clients) =>
          Promise.all(clients.map((client) => client.navigate(client.url)))
        ),
    ])
  );
});
