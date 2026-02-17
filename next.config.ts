import withSerwistInit from "@serwist/next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
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
    ],
  },
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

const analyzeBundles = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyzeBundles(withSerwist(nextConfig));
