import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const source = new URL("../public/images/products-hero/voglia-color-fun.webp", import.meta.url);
const candidate = new URL("../public/images/products/voglia-color-fun-violeta-250ml/01-principal.webp", import.meta.url);

test("VOGLIA Violeta conserva exactamente el archivo fotográfico original", async () => {
  const original = await readFile(source);
  const copied = await readFile(candidate);
  assert.ok(original.byteLength > 100000);
  assert.equal(Buffer.compare(original, copied), 0, "No debe recomprimirse ni modificarse etiqueta/envase");
  const metadata = await sharp(copied).metadata();
  assert.equal(metadata.format, "webp");
  assert.ok(metadata.width >= 800 && metadata.height >= 800, "Resolución insuficiente");
  assert.ok(metadata.hasAlpha, "El WebP debe conservar transparencia");
  const { data, info } = await sharp(copied).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alphaAt = (x, y) => data[(y * info.width + x) * info.channels + 3];
  assert.ok(alphaAt(Math.floor(info.width / 2), Math.floor(info.height / 2)) >= 200, "El envase debe estar visible en el centro");
  assert.ok(alphaAt(info.width - 10, Math.floor(info.height / 2)) <= 8, "La franja derecha no debe ser visible");
});

test("la vista de revisión solo existe en Preview y no activa Medusa", async () => {
  const page = await readFile(new URL("../src/app/qa/catalogo-voglia-color-fun/page.tsx", import.meta.url), "utf8");
  assert.match(page, /process\.env\.VERCEL_ENV !== "preview"/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /index: false, follow: false/);
  assert.match(page, /voglia-color-fun-violeta-250ml\/01-principal.webp/);
  assert.doesNotMatch(page, /sdk\.|store\.product|fetch\(|getProducts\(|createProduct|updateProduct/);
});
