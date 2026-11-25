#!/usr/bin/env node
/**
 * SICARÚ · Conciliación Fantasy Nails, SOLO LECTURA.
 * Usage: node scripts/audit-fantasy-skus.mjs /path/export-admin-completo.json
 * Reads an explicit local Admin export. Never contacts Medusa or writes records.
 * Missing SKUs may be classified as absent only when snapshot_complete === true.
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

export function reconcile(snapshot) {
  const products = Array.isArray(snapshot?.products) ? snapshot.products : null;
  if (!products) throw new Error("La exportación debe contener products[]");
  const complete = snapshot.snapshot_complete === true;
  const rows = [];
  for (const [sku, name] of targets) {
    const matches = [];
    for (const product of products) {
      if (!Array.isArray(product.variants)) throw new Error("Producto sin variants[]: exportación incompleta");
      for (const variant of product.variants) {
        if (typeof variant.sku === "string" && variant.sku.trim() === sku) {
          matches.push({
            product_id: product.id ?? null,
            variant_id: variant.id ?? null,
            handle: product.handle ?? null,
            status: product.status ?? null,
            sku: variant.sku,
          });
        }
      }
    }
    const disposition = matches.length > 1 ? "BLOQUEAR_DUPLICADOS"
      : matches.length === 1 ? "REUTILIZAR_TRAS_VALIDAR_IDENTIDAD"
      : complete ? "AUSENTE_EN_EXPORTACION_COMPLETA" : "INDETERMINADO_EXPORTACION_PARCIAL";
    rows.push({ sku, name, disposition, matches });
  }
  return { complete, audited_products: products.length, rows,
    can_propose_creation: complete && rows.some((row) => row.disposition === "AUSENTE_EN_EXPORTACION_COMPLETA"),
    writes_performed: false };
}

if (process.argv[1]?.endsWith("audit-fantasy-skus.mjs")) {
  const file = process.argv[2];
  if (!file) {
    console.error("Uso: node scripts/audit-fantasy-skus.mjs export-admin-completo.json");
    process.exitCode = 2;
  } else {
    try {
      const report = reconcile(JSON.parse(readFileSync(file, "utf8")));
      console.log(JSON.stringify(report, null, 2));
      if (report.rows.some((row) => row.disposition === "BLOQUEAR_DUPLICADOS")) process.exitCode = 1;
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 2;
    }
  }
}
