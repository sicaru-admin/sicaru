"use client";

import { useEffect } from "react";

const RESET_KEY = "sicaru-cache-reset-2026-06-29";

export function BrowserCacheReset() {
  useEffect(() => {
    const run = async () => {
      if (sessionStorage.getItem(RESET_KEY) === "done") return;

      sessionStorage.setItem(RESET_KEY, "done");

      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map((registration) => registration.unregister())
        );
      }

      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }

      if (navigator.serviceWorker?.controller) {
        window.location.reload();
      }
    };

    run().catch(() => {
      sessionStorage.setItem(RESET_KEY, "done");
    });
  }, []);

  return null;
}
