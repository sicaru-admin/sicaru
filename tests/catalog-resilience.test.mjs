import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import { SourceTextModule, SyntheticModule, createContext } from "node:vm";
import { catalogRequest } from "../src/lib/catalog-request.ts";

// Execute the real data modules against a deterministic SDK, without network access.
async function loadDataModule(path, sdk, catalogMode = true) {
  const context = createContext({ setTimeout, clearTimeout, process });
  const cache = new Map();
  const mock = (values) => new SyntheticModule(Object.keys(values), function () {
    for (const [key, value] of Object.entries(values)) this.setExport(key, value);
  }, { context });
  const medusa = mock({ sdk });
  const types = mock({ HttpTypes: {} });
  const flag = mock({ CATALOG_MODE: catalogMode });
  async function load(file) {
    if (cache.has(file)) return cache.get(file);
    const source = await readFile(new URL(`../src/${file}.ts`, import.meta.url), "utf8");
    const sourceModule = new SourceTextModule(stripTypeScriptTypes(source), { context });
    cache.set(file, sourceModule);
    await sourceModule.link(async (specifier) => {
      if (specifier === "@/lib/medusa") return medusa;
      if (specifier === "@medusajs/types") return types;
      if (specifier === "@/lib/catalog-mode") return flag;
      return load(specifier.replace("@/", ""));
    });
    return sourceModule;
  }
  const sourceModule = await load(path);
  await sourceModule.evaluate();
  return sourceModule.namespace;
}

test("catalog requests return successful data", async () => {
  assert.deepEqual(await catalogRequest(async () => ({ products: [] })), { products: [] });
});

test("catalog failures propagate so pages can render their fallback", async () => {
  await assert.rejects(catalogRequest(async () => { throw new Error("backend offline"); }), /backend offline/);
});

test("an unresponsive backend has a bounded timeout", async () => {
  await assert.rejects(catalogRequest(() => new Promise(() => {}), 10), /timed out/);
});

test("product lookup distinguishes a missing product from a backend failure", async () => {
  let offline = false;
  const sdk = { store: {
    region: { list: async () => ({ regions: [{ id: "reg_mx", currency_code: "mxn" }] }) },
    product: { list: async () => { if (offline) throw new Error("offline"); return { products: [] }; } },
  } };
  const data = await loadDataModule("lib/data/products", sdk);
  assert.equal(await data.getProductByHandle("missing"), null);
  offline = true;
  await assert.rejects(data.getProductByHandle("existing"), /offline/);
});

test("invalid product, category and collection payloads never reach rendering", async () => {
  const sdk = { store: {
    region: { list: async () => ({ regions: [{ id: "reg_mx", currency_code: "mxn" }] }) },
    product: { list: async () => ({}) },
    category: { list: async () => ({}) },
    collection: { list: async () => ({}) },
  } };
  const products = await loadDataModule("lib/data/products", sdk);
  const categories = await loadDataModule("lib/data/categories", sdk);
  const collections = await loadDataModule("lib/data/collections", sdk);
  await assert.rejects(products.getProducts(), /Invalid product response/);
  await assert.rejects(categories.getCategoryByHandle("color"), /Invalid category response/);
  await assert.rejects(collections.getCollectionByHandle("voglia"), /Invalid collection response/);
});

test("region failures are recoverable instead of becoming an empty successful result", async () => {
  const data = await loadDataModule("lib/data/regions", { store: { region: { list: async () => ({}) } } });
  await assert.rejects(data.getMexicoRegion(), /Invalid region response/);
});

test("restricted checkout cannot initiate payments or complete an order", async () => {
  let writes = 0;
  const sdk = { store: {
    payment: { initiatePaymentSession: async () => { writes++; } },
    cart: { complete: async () => { writes++; } },
  } };
  const checkout = await loadDataModule("lib/data/checkout", sdk);
  await assert.rejects(checkout.initiatePaymentSession({}, "test"), /no están habilitados/);
  await assert.rejects(checkout.completeCart("cart_test"), /no están habilitados/);
  assert.equal(writes, 0);
});
