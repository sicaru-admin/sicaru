import test from "node:test";
import assert from "node:assert/strict";
import { getApprovedPrice, getInventoryStatus, hasKnownAvailability, matchesProductQuery } from "../src/lib/product-retail.ts";

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
test("catalog inventory requires explicit verification of the exact variant", () => {
  assert.equal(hasKnownAvailability({ id: "unknown" }), false);
  assert.equal(hasKnownAvailability({ ...variant, inventory_quantity: 0 }), false);
  for (const quantity of [500, 10, 5, 0]) {
    assert.equal(getInventoryStatus({ ...variant, inventory_quantity: quantity }), "unverified");
    assert.equal(hasKnownAvailability({ ...variant, inventory_quantity: quantity }), false);
  }
  assert.equal(hasKnownAvailability({ id: "unmanaged", manage_inventory: false }), false);
  assert.equal(hasKnownAvailability({ ...variant, allow_backorder: true }), false);
  for (const flag of [false, "true", 1, null]) {
    assert.equal(hasKnownAvailability({ ...variant, metadata: { storefront_inventory_verified: flag } }), false);
  }
  const verified = { ...variant, metadata: { storefront_inventory_verified: true } };
  assert.equal(hasKnownAvailability(verified), true);
  assert.equal(getInventoryStatus({ ...verified, inventory_quantity: 0 }), "unavailable");
  for (const quantity of [undefined, null, "5", NaN, Infinity, -1]) {
    assert.equal(getInventoryStatus({ ...verified, inventory_quantity: quantity }), "unverified");
  }
  assert.equal(getInventoryStatus({ ...verified, manage_inventory: false }), "unverified");
  assert.equal(getInventoryStatus({ ...variant, metadata: { storefront_price_approved: true } }), "unverified");
  assert.equal(getInventoryStatus(variant), "unverified");
});
test("non-catalog availability preserves managed inventory, unmanaged and backorder behavior", () => {
  assert.equal(hasKnownAvailability(variant, false), true);
  assert.equal(hasKnownAvailability({ ...variant, inventory_quantity: 0 }, false), false);
  assert.equal(hasKnownAvailability({ id: "unmanaged", manage_inventory: false }, false), true);
  assert.equal(hasKnownAvailability({ ...variant, inventory_quantity: 0, allow_backorder: true }, false), true);
});
test("search includes brand, tone and SKU without accent sensitivity", () => {
  assert.equal(matchesProductQuery(product, "voglia 7.1"), true);
  assert.equal(matchesProductQuery(product, "coloracion V-71"), true);
  assert.equal(matchesProductQuery(product, "voglia negro"), false);
});
