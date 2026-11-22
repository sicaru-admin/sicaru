import test from "node:test";
import assert from "node:assert/strict";
import {makeReport, APPROVED_R3_CANDIDATES} from "../scripts/audit-catalog-photo-repair.mjs";

test("R3 sólo es elegible con handle y ID maestro exactos", () => {
  const p = {id:"prod_1", handle:APPROVED_R3_CANDIDATES[0].handle, title:"XIOMARA Shampoo Platinum 250 ml",
    metadata:{sicaru_master_product_id:APPROVED_R3_CANDIDATES[0].masterId}, thumbnail:"https://example.com/raw.jpg", images:[]};
  const report=makeReport([p]);
  assert.equal(report.r3[0].identity,"MATCH");
  assert.equal(report.r3[0].action,"CANDIDATE_FOR_REVIEW_NO_WRITE");
  assert.equal(report.r3[1].action,"DO_NOT_ASSOCIATE");
});

test("bloquea foto si coincide el handle pero no el ID maestro", () => {
  const p = {id:"prod_2",handle:APPROVED_R3_CANDIDATES[0].handle,title:"Producto diferente",metadata:{sicaru_master_product_id:"PRD-INCORRECTO"}};
  const report=makeReport([p]);
  assert.equal(report.r3[0].identity,"BLOCKED_IDENTITY_NOT_VERIFIED");
  assert.equal(report.r3[0].action,"DO_NOT_ASSOCIATE");
});

test("bloquea renombrar Montis cuando no se comprobó ID maestro", () => {
  const p={id:"prod_3",handle:"montis-shampoo",title:"Montis Shampoo Extracto Natural",thumbnail:null,images:[],metadata:{}};
  const report=makeReport([p]);
  assert.equal(report.montis[0].action,"DO_NOT_RENAME");
  assert.equal(report.montis[0].currentImage.thumbnail.status,"missing");
});

test("registra diferencia Montis sin cambiar el registro", () => {
  const p={id:"prod_4",handle:"montis-shampoo",title:"Montis Shampoo Extracto Natural",metadata:{sicaru_master_product_id:"PRD-MONTIS-CABALLO-650"}};
  const before=structuredClone(p);
  const report=makeReport([p]);
  assert.equal(report.montis[0].proposedTitle,"Shampoo de Caballo Montis 650 ml");
  assert.equal(report.montis[0].action,"TITLE_REVIEW_NO_WRITE");
  assert.deepEqual(p,before);
});

test("ID histórico exacto permite revisión visual, pero exige confirmar Admin", () => {
  const master = APPROVED_R3_CANDIDATES[0];
  const product = {id: master.historicalMedusaId, handle: master.handle, title: master.title, metadata: {}};
  const report = makeReport([product]);
  assert.equal(report.r3[0].historicalProductIdMatches, true);
  assert.equal(report.r3[0].identity, "HISTORICAL_MATCH_REQUIRES_ADMIN_VERIFICATION");
  assert.equal(report.r3[0].action, "CANDIDATE_FOR_REVIEW_NO_WRITE");
});

test("ID histórico de otro producto bloquea asociación aun con handle coincidente", () => {
  const master = APPROVED_R3_CANDIDATES[0];
  const product = {id: "prod_DISTINTO", handle: master.handle, title: master.title, metadata: {}};
  const report = makeReport([product]);
  assert.equal(report.r3[0].historicalProductIdMatches, false);
  assert.equal(report.r3[0].action, "DO_NOT_ASSOCIATE");
});
