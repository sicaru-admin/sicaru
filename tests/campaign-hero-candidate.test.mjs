import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const candidate = readFileSync(resolve(root, "src/components/home/CampaignHeroCandidate.tsx"), "utf8");
const liveHome = readFileSync(resolve(root, "src/app/(shop)/page.tsx"), "utf8");

function luminance(hex) {
  const values = [1, 3, 5].map((start) => {
    const srgb = parseInt(hex.slice(start, start + 2), 16) / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}

test("campaign uses approved SICARÚ colors with accessible contrast", () => {
  assert.match(candidate, /bg-\[#7F6D8A\]/);
  assert.match(candidate, /bg-\[#9B89A8\]/);
  assert.match(candidate, /text-white/);
  assert.doesNotMatch(candidate, /#49314B|#36243D|#39273E/);
  const contrast = (luminance("#FFFFFF") + 0.05) / (luminance("#7F6D8A") + 0.05);
  assert.ok(contrast >= 4.5, `text contrast ${contrast.toFixed(2)} is below 4.5:1`);
});

test("candidate requires distinct photographic assets and HTML copy/CTA", () => {
  assert.match(candidate, /sicaru-hero-mobile\.webp/);
  assert.match(candidate, /sicaru-hero-desktop\.webp/);
  assert.match(candidate, /media="\(max-width: 767px\)"/);
  assert.match(candidate, /md:object-\[86%_center\]/);
  assert.match(candidate, /lg:object-\[70%_center\]/);
  assert.match(candidate, /xl:object-\[60%_center\]/);
  assert.match(candidate, /Belleza profesional para ti y tu salón/);
  assert.match(candidate, /href="\/productos"/);
  assert.match(candidate, /href="\/salon-pro"/);
  assert.doesNotMatch(candidate, /Mercado Pago|DHL|compra ahora/i);
});

test("candidate stays inactive while photograph masters await final approval", () => {
  assert.doesNotMatch(liveHome, /CampaignHeroCandidate/);
  assert.match(liveHome, /<HeroSection \/>/);
});

test("laboratorio protege producción, respeta noindex y no muestra archivos faltantes", () => {
  const page = readFileSync(resolve(root, "src/app/(shop)/qa/banner-candidato/page.tsx"), "utf8");
  assert.match(page, /robots: \{ index: false, follow: false \}/);
  assert.match(page, /process\.env\.VERCEL_ENV !== "preview"/);
  assert.match(page, /process\.env\.NODE_ENV !== "development"/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /<MissingPhotos \/>/);
  assert.match(page, /availablePhotoAssets\(\)/);
  assert.match(page, /<CategoriesGrid \/>/);
  assert.match(page, /<WhatsAppBanner \/>/);
  assert.doesNotMatch(page, /<FeaturedProducts \/>|<BrandsShowcase \/>/);
});
