import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const brand = read("src/components/layout/BrandWordmark.tsx");
const navbar = read("src/components/layout/Navbar.tsx");

test("no se recorta ni modifica el logotipo gráfico oficial", () => {
  for (const path of ["public/brand/logo-dark.png", "public/brand/logo-cream.png", "public/brand/logo-violet.png"]) {
    assert.ok(existsSync(resolve(root, path)), path);
  }
  assert.match(brand, /aria-label="Sicarú, inicio"/);
  assert.match(brand, />\s*SICARÚ\s*</);
  assert.doesNotMatch(brand, /overflow-hidden|object-cover|logo-dark\.png/);
});

test("solo el encabezado eleva la escala de wordmark con tamaños adaptativos", () => {
  assert.match(navbar, /<BrandWordmark className="shrink-0/);
  assert.match(navbar, /text-\[1\.98rem\]!/);
  assert.match(navbar, /sm:text-\[2\.35rem\]!/);
  assert.match(navbar, /md:text-\[2\.15rem\]!/);
  assert.match(navbar, /lg:text-\[2\.65rem\]!/);
  assert.match(navbar, /<HeaderSearch \/>/);
  assert.match(navbar, /<MobileNav \/>/);
});
