"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RESET_KEY = "sicaru-catalog-visibility-2026-11-15";

export function BrowserCacheReset() {
  const router = useRouter();
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
    function refreshVisibleCatalog() {
      if (document.visibilityState === "hidden") return;
      void refresh();
      router.refresh();
    }
    void refresh();
    window.addEventListener("online", refreshVisibleCatalog);
    window.addEventListener("pageshow", refreshVisibleCatalog);
    window.addEventListener("popstate", refreshVisibleCatalog);
    document.addEventListener("visibilitychange", refreshVisibleCatalog);
    return () => {
      window.removeEventListener("online", refreshVisibleCatalog);
      window.removeEventListener("pageshow", refreshVisibleCatalog);
      window.removeEventListener("popstate", refreshVisibleCatalog);
      document.removeEventListener("visibilitychange", refreshVisibleCatalog);
    };
  }, [router]);
  return null;
}
