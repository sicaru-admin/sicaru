import test from "node:test";
import assert from "node:assert/strict";
import { reconcile } from "../scripts/audit-fantasy-skus.mjs";

const complete = (products) => ({
  products,
  coverage: {
    source: "medusa-admin",
    export_confirmed_complete: true,
    archived_included: true,
    states: ["published","draft","proposed","rejected","archived"],
    pages: [{offset:0,limit:100,count:products.length,received:products.length}]
  }
});

const p = (id="p1",variant="v1",sku="17133") => ({
  id,handle:"gel-rubber",status:"draft",
  categories:[{id:"cat_1",name:"Uñas profesionales",handle:"unas-profesionales"}],
  variants:[{id:variant,sku}]
});

test("sin cobertura certificada no declara SKU ausente", () => {
  const result = reconcile({ products:[], snapshot_complete:true });
  assert.equal(result.coverage.complete,false);
  assert.equal(result.rows[0].disposition,"INDETERMINADO_EXPORTACION_NO_ACREDITADA");
  assert.equal(result.can_propose_creation,false);
});
test("cobertura acreditada permite solamente constatar ausencia", () => {
  const result=reconcile(complete([]));
  assert.equal(result.coverage.complete,true);
  assert.equal(result.rows[0].disposition,"SIN_COINCIDENCIAS_EN_EXPORTACION_ACREDITADA");
  assert.equal(result.can_propose_creation,false);
});
test("coincidencia única incluye ID y categoría sin autorizar actualización", () => {
  const result=reconcile(complete([p()]));
  assert.equal(result.rows[0].disposition,"REVISAR_IDENTIDAD_EXISTENTE");
  assert.equal(result.rows[0].matches[0].categories[0].id,"cat_1");
  assert.equal(result.writes_performed,false);
});
test("registro repetido de misma variante no cuenta como duplicado", () => {
  const result=reconcile(complete([p(),p()]));
  assert.equal(result.rows[0].disposition,"REVISAR_IDENTIDAD_EXISTENTE");
  assert.equal(result.rows[0].matches.length,1);
});
test("dos variantes distintas con mismo SKU quedan bloqueadas", () => {
  const result=reconcile(complete([p(),p("p2","v2")]));
  assert.equal(result.rows[0].disposition,"BLOQUEAR_COINCIDENCIAS_MULTIPLES");
});
test("coincidencia sin IDs o categorías se bloquea", () => {
  const broken=p();delete broken.variants[0].id;delete broken.categories;
  const result=reconcile(complete([broken]));
  assert.equal(result.rows[0].disposition,"BLOQUEAR_IDENTIDAD_INCOMPLETA");
});
test("páginas con hueco no acreditan completitud", () => {
  const snapshot=complete([p()]);
  snapshot.coverage.pages=[{offset:1,limit:100,count:1,received:1}];
  const result=reconcile(snapshot);
  assert.equal(result.coverage.complete,false);
});
test("exportación sin variants[] no declara ausencia", () => {
  const result=reconcile(complete([{id:"p1"}]));
  assert.equal(result.faults.length,1);
  assert.equal(result.rows[0].disposition,"INDETERMINADO_EXPORTACION_NO_ACREDITADA");
});
test("SKU se mantiene como cadena exacta", () => {
  const result=reconcile(complete([p("p1","v1","017133")]));
  assert.equal(result.rows[0].disposition,"SIN_COINCIDENCIAS_EN_EXPORTACION_ACREDITADA");
});
