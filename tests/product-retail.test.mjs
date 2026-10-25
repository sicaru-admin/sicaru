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
  const other = { ...variant, id: "sku_b" };
  assert.equal(getApprovedPrice({ ...product, variants: [approved, other] }, approved).calculated_amount, 97);
  assert.equal(getApprovedPrice({ ...product, metadata: { storefront_price_approved: true }, variants: [approved, other] }, other), null);
});
test("product approval never substitutes for approval of the exact variant", () => {
  const productOnly = { ...product, metadata: { storefront_price_approved: true } };
  assert.equal(getApprovedPrice(productOnly, variant), null);
  const approved = { ...variant, metadata: { storefront_price_approved: true } };
  assert.equal(getApprovedPrice({ ...product, variants: [approved] }, approved).calculated_amount, 97);
  const invalid = { ...approved, calculated_price: { calculated_amount: NaN } };
  assert.equal(getApprovedPrice({ ...product, variants: [invalid] }, invalid), null);
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
