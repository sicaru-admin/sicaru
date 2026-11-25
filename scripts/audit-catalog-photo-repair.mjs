#!/usr/bin/env node
/**
 * SICARÚ · auditoría de SOLO LECTURA de fotografías y nombre comercial.
 * Ejemplo: NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://... NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=... node scripts/audit-catalog-photo-repair.mjs
 * Alternativa sin conexión: node scripts/audit-catalog-photo-repair.mjs --fixture /ruta/a/store-products.json
 *
 * No realiza escrituras, no muestra credenciales y no altera Medusa ni el sitio.
 */
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export const APPROVED_R3_CANDIDATES = [
  {
    handle: "xiomara-shampoo-platinum-250ml",
    masterId: "PRD-9CC3A06A6F10",
    historicalMedusaId: "prod_01M79C6MFY2YPX504ZMDW9HJ0A",
    title: "XIOMARA Shampoo Platinum 250 ml",
    front: "/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp",
  },
  {
    handle: "xiomara-shampoo-platinum-libre-sulfatos-250ml",
    masterId: "PRD-3CE612A96316",
    historicalMedusaId: "prod_01M79C7BHA8D7GCZG4DTBM1Q68",
    title: "XIOMARA Shampoo Platinum Libre de Sulfatos 250 ml",
    front: "/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal-r3.webp",
    back: "/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/02-reverso-r3.webp",
  },
  {
    handle: "nekane-morazul-shampoo-matizador-300g",
    masterId: "PRD-ABEB7E8039E3",
    historicalMedusaId: "prod_01M79C817D78WYM8K6D9W32NH1",
    title: "NEKANE Morazul Shampoo Matizador 300 g",
    front: "/images/products/nekane-morazul-shampoo-matizador-300g/01-principal-r3.webp",
    back: "/images/products/nekane-morazul-shampoo-matizador-300g/02-reverso-r3.webp",
  },
];

export const MONTIS_CANDIDATE = {
  currentTitle: "Montis Shampoo Extracto Natural",
  proposedTitle: "Shampoo de Caballo Montis 650 ml",
  masterId: "PRD-MONTIS-CABALLO-650",
  verifiedBarcodeInMaster: "7503000640069",
};

export const PLACEHOLDER_NAMES = [
  "Nekane Tratamiento Hidra Intenso",
  "Vitale Keratina Profesional",
  "Hidra Color Tinte Cremoso",
  "Xiomara Gel Fijación Fuerte",
  "Voglia Tinte Permanente 90 ml",
  "KÜÜL Cure Me Reconstructor 1 L",
  "Montis Shampoo Extracto Natural",
];

const asString = (v) => typeof v === "string" ? v : "";
const cleanUrl = (value) => {
  const s = asString(value).trim();
  if (!s) return { status: "missing", value: null };
  if (!/^(https?:\/\/|\/(?!\/))/.test(s)) return { status: "invalid-format", value: s };
  return { status: "present", value: s };
};
const getMasterId = (p) => asString(p?.metadata?.sicaru_master_product_id);
const normalized = (s) => asString(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const imageInfo = (p) => ({
  thumbnail: cleanUrl(p?.thumbnail),
  firstGallery: cleanUrl(p?.images?.[0]?.url),
  galleryCount: Array.isArray(p?.images) ? p.images.length : 0,
});

export function makeReport(products) {
  const byHandle = new Map(products.filter(p => p?.handle).map(p => [p.handle, p]));
  const r3 = APPROVED_R3_CANDIDATES.map(c => {
    const product = byHandle.get(c.handle);
    const sameIdentity = !!product && getMasterId(product) === c.masterId;
    const historicalIdMatch = !!product && !getMasterId(product) && product.id === c.historicalMedusaId;
    return {
      handle: c.handle,
      productId: product?.id ?? null,
      currentTitle: product?.title ?? null,
      masterIdInStore: product ? (getMasterId(product) || null) : null,
      expectedMasterId: c.masterId,
      historicalMedusaId: c.historicalMedusaId,
      historicalProductIdMatches: historicalIdMatch,
      identity: !product ? "NOT_PUBLIC" : sameIdentity ? "MATCH" : historicalIdMatch ? "HISTORICAL_MATCH_REQUIRES_ADMIN_VERIFICATION" : "BLOCKED_IDENTITY_NOT_VERIFIED",
      currentImage: product ? imageInfo(product) : null,
      proposedR3: {front:c.front, ...(c.back ? {back:c.back} : {})},
      action: sameIdentity || historicalIdMatch ? "CANDIDATE_FOR_REVIEW_NO_WRITE" : "DO_NOT_ASSOCIATE",
    };
  });
  const montisMatches = products.filter(p =>
    getMasterId(p) === MONTIS_CANDIDATE.masterId ||
    normalized(p?.title) === normalized(MONTIS_CANDIDATE.currentTitle));
  const montis = montisMatches.map(p => ({
    productId: p.id, handle: p.handle, currentTitle: p.title,
    masterIdInStore: getMasterId(p) || null,
    proposedTitle: MONTIS_CANDIDATE.proposedTitle,
    sourceMasterId: MONTIS_CANDIDATE.masterId,
    identity: getMasterId(p) === MONTIS_CANDIDATE.masterId ? "MATCH" : "BLOCKED_IDENTITY_NOT_VERIFIED",
    currentImage: imageInfo(p),
    action: getMasterId(p) === MONTIS_CANDIDATE.masterId ? "TITLE_REVIEW_NO_WRITE" : "DO_NOT_RENAME",
  }));
  const missingImageCandidates = PLACEHOLDER_NAMES.map(name => {
    const matches = products.filter(p => normalized(p.title) === normalized(name));
    return { searchedTitle: name, matches: matches.map(p => ({
      productId: p.id, handle: p.handle, title: p.title, masterIdInStore: getMasterId(p)||null, image: imageInfo(p),
    })) };
  });
  return {checkedAt:new Date().toISOString(),source:"STORE_API_READ_ONLY",
    publicProductCount:products.length, r3, montis, missingImageCandidates,
    note:"No se valida aquí el SKU físico, aprobación visual ni el estado de Admin; nunca ejecutar altas ni actualizar imágenes/precios automáticamente."};
}

async function fetchProducts(baseUrl, publishableKey) {
  const products = [];
  let offset = 0;
  for (let page = 0; page < 20; page++) {
    const url = new URL("/store/products", baseUrl);
    url.searchParams.set("limit", "100");
    url.searchParams.set("offset", String(offset));
    const response = await fetch(url, {headers:{"x-publishable-api-key": publishableKey}, signal: AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error(`Store API HTTP ${response.status} en listado de productos; sin cambios realizados`);
    const data = await response.json();
    if (!Array.isArray(data?.products)) throw new Error("Respuesta inesperada de Store API (products)");
    products.push(...data.products);
    offset += data.products.length;
    if (!data.products.length || offset >= (typeof data.count === "number" ? data.count : Infinity) || data.products.length < 100) return products;
  }
  throw new Error("Más de 20 páginas: abortado para evitar inventario incompleto");
}

async function checkImage(url) {
  try {
    const response = await fetch(url, {method:"GET", headers:{"range":"bytes=0-0"}, signal:AbortSignal.timeout(15000)});
    await response.body?.cancel();
    return {url, status:response.status, contentType:response.headers.get("content-type"),ok:response.ok};
  } catch(e) { return {url, ok:false, error:e instanceof Error ? e.name : "NetworkError"}; }
}

async function main() {
  const fixtureIndex = process.argv.indexOf("--fixture");
  let products;
  if (fixtureIndex >= 0) {
    const path = process.argv[fixtureIndex+1];
    if (!path) throw new Error("Falta ruta de fixture JSON");
    const parsed = JSON.parse(await readFile(path, "utf8"));
    products = Array.isArray(parsed) ? parsed : parsed.products;
    if (!Array.isArray(products)) throw new Error("Fixture sin products[]");
  } else {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    if (!baseUrl || !key) throw new Error("Faltan variables públicas Store API; no usar ni imprimir credenciales de Admin");
    products = await fetchProducts(baseUrl, key);
  }
  const report = makeReport(products);
  if (fixtureIndex < 0) {
    const origin = process.env.CATALOG_PUBLIC_ORIGIN || "https://www.sicarubeauty.com";
    report.r3AssetHttp = [];
    for (const c of APPROVED_R3_CANDIDATES) {
      report.r3AssetHttp.push(await checkImage(new URL(c.front,origin).href));
      if (c.back) report.r3AssetHttp.push(await checkImage(new URL(c.back,origin).href));
    }
  }
  process.stdout.write(JSON.stringify(report,null,2)+"\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(e=>{console.error(e instanceof Error ? e.message : "Fallo desconocido");process.exitCode=1;});
}
