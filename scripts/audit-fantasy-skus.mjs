#!/usr/bin/env node
/**
 * SICARÚ · Auditoría de exportación Admin, SIN ESCRITURAS.
 *
 * Input JSON:
 * {
 *   "products": [{ "id", "handle", "status", "categories": [], "variants": [{ "id", "sku" }] }],
 *   "coverage": {
 *     "source": "medusa-admin",
 *     "states": ["published", "draft", "proposed", "rejected", "archived"],
 *     "archived_included": true,
 *     "pages": [{"offset":0,"limit":100,"count":120,"received":100}, ...],
 *     "export_confirmed_complete": true
 *   }
 * }
 *
 * The export operator, not this script, must attest whether these states and archives
 * are actually supported by the running Medusa version. Never fabricate coverage.
 */
import { readFileSync } from "node:fs";

export const targets = Object.freeze([
  ["17133", "Gel Rubber Pink Shine"],
  ["17141", "Gel Rubber Petal"],
  ["17136", "Gel Rubber Piel"],
  ["28101", "Gel Polish Super Blanco"],
  ["28102", "Gel Polish Super Negro"],
  ["20132", "TrueBond sin ácido"],
]);

const textId = (v) => typeof v === "string" && v.trim().length > 0;
const requiredStates = ["published", "draft", "proposed", "rejected", "archived"];

function evaluateCoverage(snapshot, products) {
  const c = snapshot?.coverage;
  const problems = [];
  if (c?.source !== "medusa-admin") problems.push("origen administrativo no acreditado");
  if (c?.export_confirmed_complete !== true) problems.push("completitud sin confirmación operativa");
  if (c?.archived_included !== true) problems.push("archivados no acreditados");
  if (!Array.isArray(c?.states) || !requiredStates.every((s) => c.states.includes(s))) {
    problems.push("cobertura de estados no acreditada");
  }
  if (!Array.isArray(c?.pages) || c.pages.length === 0) {
    problems.push("paginación ausente");
  } else {
    const pages = [...c.pages].sort((a,b) => a.offset - b.offset);
    let next = 0;
    const total = pages[0]?.count;
    if (!Number.isSafeInteger(total) || total < 0) problems.push("count inválido");
    for (const p of pages) {
      if (![p.offset, p.limit, p.count, p.received].every(Number.isSafeInteger) ||
          p.limit <= 0 || p.received < 0 || p.received > p.limit ||
          p.offset !== next || p.count !== total) {
        problems.push("paginación discontinua o inconsistente");
        break;
      }
      next += p.received;
    }
    if (next !== total || products.length !== total) problems.push("count no concilia con filas");
  }
  return { complete: problems.length === 0, problems };
}

export function reconcile(snapshot) {
  const products = Array.isArray(snapshot?.products) ? snapshot.products : null;
  if (!products) throw new Error("La exportación debe contener products[]");
  const coverage = evaluateCoverage(snapshot, products);
  const matchesBySku = new Map(targets.map(([sku]) => [sku, new Map()]));
  const faults = [];

  for (const product of products) {
    if (!Array.isArray(product?.variants)) {
      faults.push("Producto sin variants[]: exportación incompleta");
      continue;
    }
    for (const variant of product.variants) {
      const sku = variant?.sku;
      if (typeof sku !== "string" || !matchesBySku.has(sku)) continue;
      const valid = textId(product.id) && textId(variant.id);
      if (!valid) faults.push(`Identificadores incompletos para SKU ${sku}`);
      const entry = {
        product_id: product.id ?? null, variant_id: variant.id ?? null,
        handle: product.handle ?? null, status: product.status ?? null,
        categories: Array.isArray(product.categories)
          ? product.categories.map(c => ({id:c?.id ?? null, name:c?.name ?? null, handle:c?.handle ?? null}))
          : null,
        sku,
      };
      if (entry.categories === null) faults.push(`Categorías sin exportar para SKU ${sku}`);
      // A repeated page/export row for the *same* variant is not another variant.
      const key = valid ? `${product.id}\u0000${variant.id}` : `invalid-${matchesBySku.get(sku).size}`;
      const existing = matchesBySku.get(sku).get(key);
      if (existing && JSON.stringify(existing) !== JSON.stringify(entry)) {
        faults.push(`Datos contradictorios para variante ${variant.id}`);
      }
      matchesBySku.get(sku).set(key, entry);
    }
  }

  const rows = targets.map(([sku,name]) => {
    const matches = [...matchesBySku.get(sku).values()];
    const invalid = matches.some(m => !textId(m.product_id) || !textId(m.variant_id) || m.categories === null);
    const disposition = invalid ? "BLOQUEAR_IDENTIDAD_INCOMPLETA"
      : matches.length > 1 ? "BLOQUEAR_COINCIDENCIAS_MULTIPLES"
      : matches.length === 1 ? "REVISAR_IDENTIDAD_EXISTENTE"
      : coverage.complete && faults.length === 0 ? "SIN_COINCIDENCIAS_EN_EXPORTACION_ACREDITADA"
      : "INDETERMINADO_EXPORTACION_NO_ACREDITADA";
    return {sku,name,disposition,matches};
  });

  return {
    coverage, faults, audited_products: products.length, rows,
    // Never recommend creation based solely on an export; require a separate approval.
    can_propose_creation: false, writes_performed: false,
  };
}

if (process.argv[1]?.endsWith("audit-fantasy-skus.mjs")) {
  const file = process.argv[2];
  if (!file) {
    console.error("Uso: node scripts/audit-fantasy-skus.mjs export-admin.json");
    process.exitCode = 2;
  } else {
    try {
      const report = reconcile(JSON.parse(readFileSync(file, "utf8")));
      console.log(JSON.stringify(report, null, 2));
      if (report.faults.length || report.rows.some(r => r.disposition.startsWith("BLOQUEAR"))) {
        process.exitCode = 1;
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 2;
    }
  }
}
