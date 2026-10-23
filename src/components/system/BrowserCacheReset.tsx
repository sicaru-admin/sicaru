"use client";

import { useEffect } from "react";

const RESET_KEY = "sicaru-retail-refinement-2026-10-23";

export function BrowserCacheReset() {
  useEffect(() => {
    let running = false;
    async function refresh() {
      if (running || document.visibilityState === "hidden") return;
      running = true;
      try {
        if (sessionStorage.getItem(RESET_KEY) === "done") return;
        const controlled = !!navigator.serviceWorker?.controller;
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(async (registration) => {
            await registration.update().catch(() => {});
            await registration.unregister();
          }));
        }
        if ("caches" in window) {
          await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
        }
        sessionStorage.setItem(RESET_KEY, "done");
        if (controlled) window.location.reload();
      } catch {
        // Retry on the next online/visible event; never clear the customer's cart.
      } finally { running = false; }
    }
    void refresh();
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return null;
}
