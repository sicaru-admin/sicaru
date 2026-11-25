import test from "node:test";
import assert from "node:assert/strict";
import { reconcile } from "../scripts/audit-fantasy-skus.mjs";

test("exportación parcial nunca acredita ausencia", () => {
  const report = reconcile({products: [], snapshot_complete: false});
  assert.equal(report.rows[0].disposition, "INDETERMINADO_EXPORTACION_PARCIAL");
  assert.equal(report.can_propose_creation, false);
});
test("SKU exacto existente se reutiliza sin escribir", () => {
  const report = reconcile({snapshot_complete:true, products:[{
    id:"prod_1", handle:"gel-rubber", status:"draft", variants:[{id:"variant_1",sku:"17133"}]
  }]});
  assert.equal(report.rows[0].disposition, "REUTILIZAR_TRAS_VALIDAR_IDENTIDAD");
  assert.equal(report.rows[0].matches[0].variant_id, "variant_1");
  assert.equal(report.writes_performed, false);
});
test("coincidencias repetidas se bloquean", () => {
  const report = reconcile({snapshot_complete:true,products:[
    {id:"p1",variants:[{id:"v1",sku:"17133"}]},
    {id:"p2",variants:[{id:"v2",sku:"17133"}]}
  ]});
  assert.equal(report.rows[0].disposition,"BLOQUEAR_DUPLICADOS");
});
test("exige variants[] para impedir falsos ausentes", () => {
  assert.throws(()=>reconcile({snapshot_complete:true,products:[{id:"incompleto"}]}),/exportación incompleta/);
});
