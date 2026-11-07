import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const stagingMediaOrigin = "https://sicaru-backend-staging-voglia.up.railway.app";
const isVariantMediaPreview =
  process.env.VERCEL_ENV === "preview" &&
  process.env.VERCEL_GIT_COMMIT_REF === "codex/variant-product-photos" &&
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL === stagingMediaOrigin;

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      ...(isVariantMediaPreview ? [new URL("/static/**", stagingMediaOrigin)] : []),
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sicaru.com",
      },
      {
        protocol: "https",
        hostname: "api.distribuidorasicaru.com",
      },
      {
        protocol: "https",
        hostname: "sicaru-six.vercel.app",
      },
      {
        protocol: "https",
        hostname: "www.sicarubeauty.com",
      },
      {
        protocol: "https",
        hostname: "sicarubeauty.com",
      },
    ],
  },
};

const analyzeBundles = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyzeBundles(nextConfig);
