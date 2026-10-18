import assert from "node:assert/strict";
import { test } from "node:test";
import { getOrderPaymentState } from "../src/lib/payment-status.ts";
import { getLocalDeliveryWhatsAppUrl, getWhatsAppUrl } from "../src/lib/shipping.ts";
test("pending, missing and rejected payments never render paid", () => {
 for (const status of [undefined, "pending", "in_process", "authorized", "rejected", "cancelled"]) {
  const state = getOrderPaymentState({payment_collections:[{payment_sessions:[{data:{mp_status:status}}]}]});
  assert.notEqual(state,"paid");
 }
 assert.equal(getOrderPaymentState({payment_status:"captured"}),"paid");
 assert.equal(getOrderPaymentState({payment_collections:[{status:"failed",payment_sessions:[{data:{mp_status:"approved"}}]}]}),"rejected");
});
test("local draft includes both variants, quantities, server subtotal and the separate local fee", () => {
 const url = new URL(getLocalDeliveryWhatsAppUrl("525500000000",[
  {title:"Tinte",variant_title:"6/1",quantity:2},{title:"Tinte",variant_title:"7/0",quantity:1}
 ],255,"Centro"));
 const text=url.searchParams.get("text");
 assert.match(text,/2 × Tinte \(6\/1\)/); assert.match(text,/1 × Tinte \(7\/0\)/);
 assert.match(text,/Subtotal de productos: \$255.00 MXN/); assert.match(text,/Entrega local: \$40 MXN fuera del checkout/);
 assert.equal(getWhatsAppUrl("",text),null);
});
