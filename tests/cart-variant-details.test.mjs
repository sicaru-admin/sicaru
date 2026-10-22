import assert from "node:assert/strict";
import { test } from "node:test";
import { getCartLineVariantLabel } from "../src/components/cart/cart-line-variant.ts";
import { getParcelQuoteMessage } from "../src/lib/shipping.ts";
test("real single-presentation variants remain visible in cart and parcel quote drafts", () => {
  for (const title of ["90ml","90 ml","250 g","1 L"]) {
    const variant_title=getCartLineVariantLabel({variant_title:title});
    assert.equal(variant_title,"Presentación: "+title);
    assert(getParcelQuoteMessage([{title:"Tinte",variant_title,quantity:2}],170).includes("2 × Tinte (Presentación: "+title+")"));
  }
});
test("tone and presentation values are preserved together without inventing a tone for volume", () => {
  assert.equal(getCartLineVariantLabel({variant_title:"90ml",variant_option_values:{Tono:"6/1",Presentación:"90ml"}}),"Tono: 6/1 · Presentación: 90ml");
  assert.equal(getCartLineVariantLabel({variant_title:"6/1"}),"Tono: 6/1");
  assert.equal(getCartLineVariantLabel({variant_title:"Default Variant",variant:{title:"90ml"}}),"Presentación: 90ml");
  assert.equal(getCartLineVariantLabel({variant_title:"Default Variant"}),null);
});
