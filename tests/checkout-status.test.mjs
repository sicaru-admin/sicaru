import assert from "node:assert/strict";
import { test } from "node:test";
import { getOrderPaymentState } from "../src/lib/payment-status.ts";
import { getParcelQuoteMessage, getWhatsAppUrl } from "../src/lib/shipping.ts";
test("pending, missing and rejected payments never render paid", () => {
 for (const status of [undefined, "pending", "in_process", "authorized", "rejected", "cancelled"]) {
  const state = getOrderPaymentState({payment_collections:[{payment_sessions:[{data:{mp_status:status}}]}]});
  assert.notEqual(state,"paid");
 }
 assert.equal(getOrderPaymentState({payment_status:"captured"}),"paid");
 assert.equal(getOrderPaymentState({payment_collections:[{status:"failed",payment_sessions:[{data:{mp_status:"approved"}}]}]}),"rejected");
});
test("parcel quote inquiry preserves variants and subtotal without a delivery fee", () => {
 const text = getParcelQuoteMessage([
  {title:"Tinte",variant_title:"6/1",quantity:2},{title:"Tinte",variant_title:"7/0",quantity:1}
 ],255);
 assert.match(text,/2 × Tinte \(6\/1\)/); assert.match(text,/1 × Tinte \(7\/0\)/);
 assert.match(text,/Subtotal de productos: \$255.00 MXN/);
 assert.match(text,/Envío por cotizar/);
 assert.doesNotMatch(text,/entrega local|\$40|\$49|gratuit/);
 assert.equal(getWhatsAppUrl("",text),null);
});
