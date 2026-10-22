import assert from "node:assert/strict";
import { test } from "node:test";
import { getParcelQuoteMessage, getDhlWhatsAppUrl } from "../src/lib/shipping.ts";
import { getProductAvailability } from "../src/lib/product-availability.ts";
import { readCheckoutDraft, saveCheckoutDraft, clearCheckoutDraft } from "../src/lib/checkout-draft.ts";
test("the parcel inquiry keeps product choices and quantities without promising a rate", () => {
  const items = [{title:"Tinte",variant_title:"6/1",quantity:2},{title:"Tinte",variant_title:"7/0",quantity:1}];
  const url = new URL(getDhlWhatsAppUrl("528281136652",items));
  assert.equal(url.pathname,"/528281136652");
  const text=url.searchParams.get("text");
  for (const expected of ["2 × Tinte (6/1)","1 × Tinte (7/0)","Envío por cotizar","confirmar costo, IVA y cobertura"]) assert(text.includes(expected),expected);
  assert.doesNotMatch(text,/\$40|\$49|entrega local|Total con/);
});
test("missing or invalid merchandise amounts do not invent a product subtotal", () => {
  for (const amount of [undefined,null,NaN,-1]) assert(!getParcelQuoteMessage([],amount).includes("Subtotal de productos:"));
});
test("out-of-stock differs from a requested quantity above stock and from unknown inventory", () => {
  const variant={manage_inventory:true,allow_backorder:false,inventory_quantity:0};
  assert.equal(getProductAvailability(variant),"out_of_stock");
  assert.equal(getProductAvailability({...variant,inventory_quantity:2},3),"insufficient");
  assert.equal(getProductAvailability({...variant,inventory_quantity:2},2),"available");
  assert.equal(getProductAvailability({...variant,inventory_quantity:undefined}),"unknown");
  assert.equal(getProductAvailability(null),"unselected");
});
test("checkout drafts survive return, are scoped to a cart, and can be cleared only for the completed cart", () => {
  const values=new Map(); const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
  const draft={email:"test@example.invalid",address:{first_name:"Prueba",city:"Cadereyta",postal_code:"67480",country_code:"mx"}};
  saveCheckoutDraft(storage,"first",draft);
  assert.deepEqual(readCheckoutDraft(storage,"first"),draft);
  assert.equal(readCheckoutDraft(storage,"second"),null);
  storage.setItem("sicaru_checkout_draft:broken","{");
  assert.equal(readCheckoutDraft(storage,"broken"),null);
  clearCheckoutDraft(storage,"second");assert.deepEqual(readCheckoutDraft(storage,"first"),draft);
  clearCheckoutDraft(storage,"first");assert.equal(readCheckoutDraft(storage,"first"),null);
});
