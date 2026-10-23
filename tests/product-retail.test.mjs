import test from "node:test";
import assert from "node:assert/strict";
import { getApprovedPrice, hasKnownAvailability, matchesProductQuery } from "../src/lib/product-retail.ts";

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
