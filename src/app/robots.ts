import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.sicarubeauty.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout", "/cuenta/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
