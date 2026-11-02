import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import vm from "node:vm";

class MemoryStorage {
  constructor(seed = {}) {
    this.data = new Map(Object.entries(seed));
  }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
  clear() { this.data.clear(); }
  key(index) { return [...this.data.keys()][index] ?? null; }
  get length() { return this.data.size; }
}

function loadCatalogCart() {
  const source = readFileSync(new URL("../src/lib/catalog-cart.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = { exports: {} };
  vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`)(
    (id) => { throw new Error("Unexpected runtime import " + id); },
    mod,
    mod.exports
  );
  return mod.exports;
}

const api = loadCatalogCart();

test("carrito local conserva dos variantes del mismo producto por variant_id", () => {
  let cart = api.createEmptyCatalogCart();
  cart = api.addCatalogItem(cart, {
    variantId: "variant_voglia_831",
    productTitle: "Voglia Tinte Permanente 90ml",
    variantTitle: "8.31 Rubio claro dorado cenizo",
    variantSku: "VOGLIA-TINTE-8-31-90ML",
    variantOptionValues: { Tono: "8.31 Rubio claro dorado cenizo", "Presentación": "90 ml" },
  }, 2);
  cart = api.addCatalogItem(cart, {
    variantId: "variant_voglia_6622",
    productTitle: "Voglia Tinte Permanente 90ml",
    variantTitle: "6.622 Rojo violeta · rojo cereza · borgoña",
    variantSku: "VOGLIA-TINTE-6-622-90ML",
    variantOptionValues: { Tono: "6.622 Rojo violeta · rojo cereza · borgoña", "Presentación": "90 ml" },
  }, 3);

  assert.equal(cart.items.length, 2);
  assert.equal(cart.items[0].quantity, 2);
  assert.equal(cart.items[1].quantity, 3);
  assert.equal(cart.items[0].unit_price, 0);
  assert.equal(cart.items[1].unit_price, 0);
});

test("persistencia versionada sobrevive recarga y no guarda precios como autoridad", () => {
  const storage = new MemoryStorage();
  let cart = api.createEmptyCatalogCart();
  cart = api.addCatalogItem(cart, {
    variantId: "variant_1",
    productTitle: "Producto",
    variantTitle: "90 ml",
    variantSku: "SKU-1",
  }, 2);
  cart.items[0].unit_price = 999999;
  api.saveCatalogCart(storage, cart);

  const raw = storage.getItem(api.CATALOG_CART_STORAGE_KEY);
  assert.match(raw, /"version":1/);
  assert.doesNotMatch(raw, /999999/);

  const reloaded = api.loadCatalogCart(storage);
  assert.equal(reloaded.items.length, 1);
  assert.equal(reloaded.items[0].quantity, 2);
  assert.equal(reloaded.items[0].unit_price, 0);
});

test("almacenamiento inválido o antiguo se descarta de forma segura", () => {
  for (const raw of [
    "{mal json",
    JSON.stringify({ version: 0, items: [{ variant_id: "x" }] }),
    JSON.stringify({ version: 1, items: [{ quantity: 9 }] }),
  ]) {
    const storage = new MemoryStorage({ [api.CATALOG_CART_STORAGE_KEY]: raw });
    const cart = api.loadCatalogCart(storage);
    assert.deepEqual(cart.items, []);
    if (raw.includes('"version":0') || raw === "{mal json") {
      assert.equal(storage.getItem(api.CATALOG_CART_STORAGE_KEY), null);
    }
  }
});

test("producto sin SKU y sin presentación sigue siendo consultable sin inventar datos", () => {
  const cart = api.addCatalogItem(api.createEmptyCatalogCart(), {
    variantId: "variant_no_meta",
    productTitle: "Producto sin metadatos",
  }, 1);
  assert.equal(cart.items[0].variant_sku, null);
  assert.equal(cart.items[0].variant_title, null);
  assert.equal(cart.items[0].quantity, 1);
});

test("actualizar, eliminar y duplicar variante son operaciones locales deterministas", () => {
  let cart = api.addCatalogItem(api.createEmptyCatalogCart(), {
    variantId: "variant_a",
    productTitle: "Producto",
  }, 1);
  cart = api.addCatalogItem(cart, {
    variantId: "variant_a",
    productTitle: "Producto",
  }, 2);
  assert.equal(cart.items.length, 1);
  assert.equal(cart.items[0].quantity, 3);

  cart = api.updateCatalogItem(cart, cart.items[0].id, 5);
  assert.equal(cart.items[0].quantity, 5);
  cart = api.removeCatalogItem(cart, cart.items[0].id);
  assert.deepEqual(cart.items, []);
});

test("provider mantiene ruta Medusa fuera de catálogo y ruta local dentro de catálogo", () => {
  const source = readFileSync(new URL("../src/components/cart/CartProvider.tsx", import.meta.url), "utf8");
  assert.match(source, /if \(CATALOG_MODE\)/);
  assert.match(source, /addCatalogItem/);
  assert.match(source, /updateCatalogItem/);
  assert.match(source, /removeCatalogItem/);
  assert.match(source, /await addItem\(activeCart\.id, variantId, quantity\)/);
  assert.match(source, /await updateItem\(cart\.id, lineItemId, quantity\)/);
  assert.match(source, /await removeItem\(cart\.id, lineItemId\)/);
});
