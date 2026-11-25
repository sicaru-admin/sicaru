import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const storeFile = await readFile(new URL("../src/lib/constants/store.ts", import.meta.url), "utf8");
const number = storeFile.match(/whatsapp:\s*"(\d+)"/)?.[1];
assert.ok(number, "El teléfono oficial debe estar definido en STORE");
const source = await readFile(new URL("../src/lib/catalog-inquiry.ts", import.meta.url), "utf8");
const inlined = source.replace(
  /import \{ STORE \} from ["']@\/lib\/constants\/store["'];?/,
  `const STORE = { whatsapp: "${number}" };`
);
assert.notEqual(inlined, source, "La utilidad debe usar STORE central y no un teléfono inventado");
const script = ts.transpileModule(inlined, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { getCatalogSearchWhatsAppHref, getCatalogCategoryWhatsAppHref } = await import(
  "data:text/javascript;base64," + Buffer.from(script).toString("base64")
);

test("búsqueda sin resultados conserva consulta original sin inventar disponibilidad", () => {
  const url = new URL(getCatalogSearchWhatsAppHref("  pestañas   KIKI MPC4  "));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/" + number);
  assert.match(url.searchParams.get("text"), /pestañas KIKI MPC4/);
  assert.match(url.searchParams.get("text"), /confirmar disponibilidad y precio/);
  assert.doesNotMatch(url.searchParams.get("text"), /en stock|tenemos disponible|paga ahora/i);
});

test("categoría sin productos permite consulta por WhatsApp sin prometer existencias", () => {
  const url = new URL(getCatalogCategoryWhatsAppHref("Herramientas profesionales"));
  assert.equal(url.pathname, "/" + number);
  assert.match(url.searchParams.get("text"), /Herramientas profesionales/);
  assert.match(url.searchParams.get("text"), /opciones y disponibilidad/);
});

test("entrada muy larga y saltos de línea no crean enlaces WhatsApp ilimitados", () => {
  const value = " tinto  " + "X".repeat(500) + "\nPAGO";
  const url = new URL(getCatalogSearchWhatsAppHref(value));
  const text = url.searchParams.get("text");
  assert.ok(text.length < 250);
  assert.ok(!text.includes("\n"));
});

test("rutas de consulta se mantienen sin backend y sin checkout", async () => {
  const catalog = await readFile(new URL("../src/app/(shop)/productos/ProductosContent.tsx", import.meta.url), "utf8");
  const category = await readFile(new URL("../src/app/(shop)/categorias/[handle]/page.tsx", import.meta.url), "utf8");
  const cart = await readFile(new URL("../src/app/(shop)/carrito/page.tsx", import.meta.url), "utf8");
  assert.match(catalog, /getCatalogSearchWhatsAppHref\(query\)/);
  assert.match(catalog, /getCatalogCategoryWhatsAppHref\("Herramientas profesionales"\)/);
  assert.match(category, /getCatalogCategoryWhatsAppHref\(category.name\)/);
  assert.match(cart, /No se realiza ninguna compra ni pago en esta página/);
  assert.match(catalog, /No encontramos productos con esa búsqueda/);
  const productsPage = await readFile(new URL("../src/app/(shop)/productos/page.tsx", import.meta.url), "utf8");
  assert.match(productsPage, /catalogUnavailable = true/);
  assert.match(catalog, /data-testid="catalog-unavailable"/);
  assert.match(catalog, /no significa que los productos estén agotados/);
  assert.doesNotMatch(source, /fetch\(|sdk\.|createOrder\(|payment\.|checkout/);
});
