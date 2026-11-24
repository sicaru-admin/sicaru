import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(resolve(root, "src/app/(shop)/qa/banner-morado/page.tsx"), "utf8");

test("laboratorio morado exclusivamente en preview/desarrollo y noindex", () => {
  assert.match(page, /robots: \{ index: false, follow: false \}/);
  assert.match(page, /process\.env\.VERCEL_ENV !== "preview"/);
  assert.match(page, /process\.env\.NODE_ENV !== "development"/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /CATALOG_MODE/);
});

test("conserva navegación comercial y categorías aprobadas", () => {
  assert.match(page, /<CategoriesGrid \/>/);
  assert.match(page, /<BrandsShowcase \/>/);
  assert.match(page, /<FeaturedProducts \/>/);
  assert.match(page, /<WhatsAppBanner \/>/);
  assert.match(page, /href="\/productos"/);
  assert.match(page, /href="\/salon-pro"/);
  assert.match(page, /Explorar productos/);
});

test("recurso conceptual identificado, sin fotografía rechazada ni empaques ficticios", () => {
  assert.ok(existsSync(resolve(root, "public/images/preview/sicaru-textura-en-libertad-concepto.png")));
  assert.match(page, /Imagen conceptual IA/);
  assert.doesNotMatch(page, /hero-mujer-salon-elegante/);
  assert.doesNotMatch(page, /checkout|pago en línea|envío gratis/i);
});
