import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Distribuidora Sicarú — Productos de Belleza Profesional",
    short_name: "Sicarú",
    description:
      "Distribuidora autorizada de productos de belleza profesional. Küül, Voglia, Nekane, Hidra Color, Xiomara, Vitale y Montis con envío a todo México.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#2D1B4E",
    theme_color: "#6B3FA0",
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
