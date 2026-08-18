import Medusa from "@medusajs/js-sdk";

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PREVIEW_PAYMENTS_PUBLISHABLE_KEY =
  "pk_134a7f19db7492484ff22eee3b0ff006cb96e521f1ee68b786ce254bd81fcde8";

const publishableKey = MEDUSA_BACKEND_URL.includes("preview-payments")
  ? PREVIEW_PAYMENTS_PUBLISHABLE_KEY
  : process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey,
});
