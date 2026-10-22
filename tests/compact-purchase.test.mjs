import assert from "node:assert/strict";
import {test} from "node:test";
import {getParcelQuoteMessage} from "../src/lib/shipping.ts";
import {rememberCheckout,readRememberedCheckout,forgetRememberedCheckout} from "../src/lib/checkout-draft.ts";
import {getProductPriceRange,matchesCatalogQuery} from "../src/lib/catalog.ts";
test("a parcel inquiry never invents delivery coverage, a fee or a final order total",()=>{
 const text = getParcelQuoteMessage([{title:"Tinte",quantity:2,variant_title:"1 Negro"}],194);
 assert(text.includes("2 × Tinte (1 Negro)"));assert(text.includes("Subtotal de productos: $194.00 MXN"));
 assert(text.includes("Envío por cotizar"));assert(text.includes("confirmar costo, IVA y cobertura"));
 assert(!text.includes("Total con"));assert(!text.includes("$234.00"));assert(!text.includes("entrega local"));
});
test("remembered checkout contains only address/contact fields and can be removed",()=>{
  const values=new Map(),storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
  assert.equal(readRememberedCheckout(storage),null);
  rememberCheckout(storage,{email:"test@example.invalid",address:{first_name:"Prueba",postal_code:"67480",card_number:"never-store",security_code:"never-store",token:"never-store"}});
  assert.deepEqual(readRememberedCheckout(storage),{email:"test@example.invalid",address:{first_name:"Prueba",postal_code:"67480"}});assert(![...values.values()].join().includes("never-store"));
  forgetRememberedCheckout(storage);assert.equal(readRememberedCheckout(storage),null);
});
test("search matches brand and approved tone while Desde requires distinct actual prices",()=>{
  const p={title:"Combo",collection:{title:"Voglia"},variants:[{title:"1 Negro",calculated_price:{calculated_amount:97}},{title:"3 Castaño oscuro",calculated_price:{calculated_amount:97}}]};
  assert(matchesCatalogQuery(p,"voglia 3 castano"));assert(!matchesCatalogQuery(p,"7 rubio"));assert.equal(getProductPriceRange(p).varies,false);
  assert.equal(getProductPriceRange({...p,variants:[p.variants[0],{calculated_price:{calculated_amount:105}}]}).varies,true);assert.equal(getProductPriceRange({variants:[]}),null);
});
