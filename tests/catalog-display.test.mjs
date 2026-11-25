import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/catalog-display.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { hasCatalogPhoto, prioritizeProductsWithPhoto } = await import(
  "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
);

test("fotografías candidatas deben tener URL HTTP(S) o ruta relativa segura", () => {
  assert.equal(hasCatalogPhoto({ thumbnail: "/images/products/xiomara.webp" }), true);
  assert.equal(hasCatalogPhoto({ images: [{ url: "https://www.sicarubeauty.com/x.webp" }] }), true);
  assert.equal(hasCatalogPhoto({ thumbnail: "" }), false);
  assert.equal(hasCatalogPhoto({ thumbnail: "javascript:alert(1)" }), false);
  assert.equal(hasCatalogPhoto({ thumbnail: "//untrusted.example/x.webp" }), false);
  assert.equal(hasCatalogPhoto({ images: [] }), false);
});

test("prioriza fotos preservando orden y todas las fichas sin modificar datos comerciales", () => {
  const products = [
    { id: "a", thumbnail: null, sku: "A" },
    { id: "b", thumbnail: "/b.webp", sku: "B" },
    { id: "c", thumbnail: null, sku: "C" },
    { id: "d", thumbnail: "https://example.com/d.webp", sku: "D" },
  ];
  const ordered = prioritizeProductsWithPhoto(products);
  assert.deepEqual(ordered.map(x => x.id), ["b", "d", "a", "c"]);
  assert.deepEqual(products.map(x => x.id), ["a", "b", "c", "d"]);
  assert.equal(ordered[0], products[1]);
  assert.equal(ordered[2].sku, "A");
  assert.equal(ordered.length, products.length);
});
