import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { getApprovedPrice, hasKnownAvailability, matchesProductQuery, getVogliaComboAsset, getProductPhoto, getProductGallery, VOGLIA_COMBO_ASSETS } from "../src/lib/product-retail.ts";

const variant = { id: "sku_a", title: "7.1 Rubio cenizo", sku: "V-71", manage_inventory: true, inventory_quantity: 3, metadata: {}, calculated_price: { calculated_amount: 97, currency_code: "mxn" } };
const product = { title: "Tinte", description: "Coloración profesional", collection: { title: "Voglia" }, variants: [variant] };

test("an unapproved price is never exposed", () => {
  assert.equal(getApprovedPrice(product, variant), null);
});
test("approval applies to the exact variant", () => {
  const approved = { ...variant, metadata: { storefront_price_approved: true } };
  assert.equal(getApprovedPrice({ ...product, variants: [approved, variant] }, approved).calculated_amount, 97);
  assert.equal(getApprovedPrice({ ...product, metadata: { storefront_price_approved: true }, variants: [approved, variant] }, variant), null);
});
test("a single SKU can inherit product approval but not an invalid price", () => {
  const approved = { ...product, metadata: { storefront_price_approved: true } };
  assert.equal(getApprovedPrice(approved, variant).calculated_amount, 97);
  assert.equal(getApprovedPrice(approved, { ...variant, calculated_price: { calculated_amount: NaN } }), null);
});
test("unknown inventory and zero stock cannot be presented as available", () => {
  assert.equal(hasKnownAvailability({ id: "unknown" }), false);
  assert.equal(hasKnownAvailability({ ...variant, inventory_quantity: 0 }), false);
  assert.equal(hasKnownAvailability(variant), true);
  assert.equal(hasKnownAvailability({ id: "unmanaged", manage_inventory: false }), true);
});
test("search includes brand, tone and SKU without accent sensitivity", () => {
  assert.equal(matchesProductQuery(product, "voglia 7.1"), true);
  assert.equal(matchesProductQuery(product, "coloracion V-71"), true);
  assert.equal(matchesProductQuery(product, "voglia negro"), false);
});

test("each supplied combo binds by exact identifier, never by a similar tube or tone", () => {
  for (const asset of VOGLIA_COMBO_ASSETS) {
    const kitVariant = { ...variant, sku: asset.identifier };
    const kitProduct = { ...product, variants: [kitVariant] };
    assert.equal(getVogliaComboAsset(asset.identifier), asset);
    assert.equal(getProductPhoto(kitProduct), asset.src);
    assert.equal(getProductGallery(kitProduct)[0].url, asset.src);
    assert.equal(getApprovedPrice(kitProduct, kitVariant).calculated_amount, 97);
    assert.equal(getVogliaComboAsset(asset.identifier.toLowerCase()), undefined);
    assert.equal(getVogliaComboAsset(asset.identifier + "-TUBO"), undefined);
  }
  for (const sku of ["VOGLIA-TINTE-1-90ML", "VOGLIA-TINTE-3-90ML", "VOGLIA-TINTE-4CC-90ML", "8601", "KIT-VOGLIA-8604-1036 "]) {
    const tube = { ...variant, sku };
    const tubeProduct = { ...product, title: "Combo tono 1", variants: [tube] };
    assert.equal(getApprovedPrice(tubeProduct, tube), null);
    assert.equal(getProductPhoto(tubeProduct), undefined);
    assert.equal(getProductGallery(tubeProduct).length, 0);
  }
});

test("combo approval never creates or changes a backend price or availability", () => {
  const kit = { id: "test_kit", sku: "KIT-VOGLIA-8601-1036" };
  assert.equal(getApprovedPrice(product, kit), null);
  assert.equal(hasKnownAvailability(kit), false);
  for (const calculated_price of [{ calculated_amount: 98, currency_code: "mxn" }, { calculated_amount: 97, currency_code: "usd" }, { calculated_amount: 9700, currency_code: "mxn" }]) {
    assert.equal(getApprovedPrice(product, { ...kit, metadata: { storefront_price_approved: true }, calculated_price }), null);
  }
  const before = JSON.stringify(product);
  getProductGallery(product);
  getProductPhoto(product);
  assert.equal(JSON.stringify(product), before);
});

test("variant photos never leak into other SKUs or an unselected mixed product", () => {
  const kit = { ...variant, sku: "KIT-VOGLIA-8601-1036" };
  const mixed = { ...product, thumbnail: "/original.webp", variants: [kit, variant] };
  assert.equal(getProductPhoto(mixed), "/original.webp");
  assert.equal(getProductPhoto(mixed, kit), "/productos/voglia/KIT-VOGLIA-8601-1036.webp");
  assert.equal(getProductPhoto(mixed, variant), "/original.webp");
  assert.equal(getApprovedPrice(mixed, variant), null);
});

test("WebP files preserve the supplied ZIP bytes exactly", async () => {
  const hashes = ["d70cd2940096a1c3a17186cb510a200ab3cf425191cf60820e3a6ca1ce4e736c", "f98bcecd41e9c5d1eee4c938366adca7f53184aed671cd73d78a60ad88020604", "840883a34264a786c56210c3c9ab9f231b31a4b596216bd1e06a5748202489ac"];
  for (const [index, asset] of VOGLIA_COMBO_ASSETS.entries()) {
    const bytes = await readFile(new URL(`../public${asset.src}`, import.meta.url));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.equal(createHash("sha256").update(bytes).digest("hex"), hashes[index]);
  }
});
