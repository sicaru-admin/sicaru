import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { CacheFirst, NetworkFirst, Serwist, StaleWhileRevalidate } from "serwist"

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope & typeof globalThis

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Google Fonts stylesheets
    {
      matcher: ({ url }) =>
        url.origin === "https://fonts.googleapis.com",
      handler: new StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
      }),
    },
    // Google Fonts webfont files
    {
      matcher: ({ url }) =>
        url.origin === "https://fonts.gstatic.com",
      handler: new CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              return response?.status === 200 ? response : null
            },
          },
        ],
      }),
    },
    // Static assets (_next/static)
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/_next/static"),
      handler: new CacheFirst({
        cacheName: "next-static-assets",
      }),
    },
    // PWA icons and static images
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/icon-") ||
        url.pathname.startsWith("/favicon"),
      handler: new CacheFirst({
        cacheName: "pwa-icons",
      }),
    },
    // Product and collection pages (HTML)
    {
      matcher: ({ request, url }) =>
        request.mode === "navigate" &&
        (url.pathname.startsWith("/productos/") ||
          url.pathname.startsWith("/marcas/") ||
          url.pathname.startsWith("/colecciones/")),
      handler: new StaleWhileRevalidate({
        cacheName: "product-pages",
      }),
    },
    // Medusa API GET requests
    {
      matcher: ({ url, request }) =>
        (url.pathname.startsWith("/store/") ||
          url.origin === (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000")) &&
        request.method === "GET",
      handler: new NetworkFirst({
        cacheName: "medusa-api",
        networkTimeoutSeconds: 10,
      }),
    },
    // CDN images
    {
      matcher: ({ url }) =>
        url.hostname === "cdn.sicaru.com" ||
        url.hostname === "medusa-public-images.s3.eu-west-1.amazonaws.com",
      handler: new CacheFirst({
        cacheName: "cdn-images",
      }),
    },
    // Default cache rules from Serwist
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.mode === "navigate",
      },
    ],
  },
})

serwist.addEventListeners()
