import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Distribuidora Sicarú — Productos de Belleza Profesional",
    short_name: "Sicarú",
    description:
      "Sicarú es una tienda de productos profesionales de belleza en Cadereyta Jiménez, Nuevo León.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#8e7a9e",
    orientation: "portrait-primary",
    categories: ["shopping", "beauty"],
    lang: "es-MX",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
