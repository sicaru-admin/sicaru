import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const page = read("src/app/(shop)/qa/banner-belleza-real/page.tsx");

test("approved banner A remains private to preview and non-indexable", () => {
  assert.match(page, /export const dynamic = "force-dynamic"/);
  assert.match(page, /robots: \{ index: false, follow: false \}/);
  assert.match(page, /process\.env\.VERCEL_ENV !== "preview"/);
  assert.match(page, /process\.env\.NODE_ENV !== "development"/);
  assert.match(page, /notFound\(\)/);
});

test("banner A uses existing commercial product photographs and safe links", () => {
  for (const source of [
    "/images/products-hero/voglia-total-repair.webp",
    "/images/products-hero/vitale-bifase-pro-keratin.webp",
  ]) assert.ok(page.includes(source), source);
  assert.ok(page.includes("/images/hero-mujer-salon-elegante.jpg"));
  assert.ok(page.includes('href="/productos"'));
  assert.ok(page.includes('href="/salon-pro"'));
  assert.ok(page.includes("<CategoriesGrid />"));
  assert.ok(page.includes("pedidos, pagos y envíos se confirman"));
  assert.doesNotMatch(page, /Mercado Pago|compra ahora|envío gratis|pago en línea/i);
});

test("existing production hero files remain unchanged on banner preview branch", () => {
  const hashes = JSON.parse(read("tests/publication-protected-hashes.json"));
  for (const path of [
    "src/components/home/HeroSection.tsx",
    "src/components/home/HomeHeroVisual.tsx",
  ]) {
    const crypto = requireHash(readFileSync(new URL("../" + path, import.meta.url)));
    assert.equal(crypto, hashes[path], path);
  }
});

function requireHash(bytes) {
  // Keep the existing manifest authoritative for production hero files.
  return createHash("sha256").update(bytes).digest("hex");
}
