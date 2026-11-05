// Synthetic QA only: never imported by src, never connected to Medusa.
import { createServer } from "node:http";

const origin = "http://localhost:9000";
const image = (name, rank = 0) => ({ id: `qa_image_${name}`, url: `${origin}/qa-media/${name}.svg`, rank });
const imageNames = ["general", "general-two", "a-01", "a-02", "b-01"];
function product(id, general, specific) {
  const own = specific ? [[image("a-01"), image("a-02", 1)], [image("b-01")], []] : [[], [], []];
  return {
    id: `qa_product_${id}`, handle: `qa-galeria-${id}`, title: `Prueba QA de galería · ${id}`,
    description: "Datos y diagramas sintéticos para pruebas locales; no son productos o fotografías reales.",
    images: [...general, ...own.flat()], thumbnail: specific ? image("a-01").url : general[0]?.url ?? null,
    collection: null, collection_id: null, categories: [], metadata: { synthetic_variant_media_fixture: true },
    options: [{ id: `qa_option_${id}`, title: "Opción", values: ["A", "B", "C"].map((v) => ({ value: `Opción ${v}` })) }],
    variants: own.map((images, index) => ({
      id: `qa_variant_${id}_${index}`, product_id: `qa_product_${id}`,
      title: `Opción ${["A", "B", "C"][index]}`, sku: `QA-${id}-${index}`, images, thumbnail: null,
      options: [{ option_id: `qa_option_${id}`, value: `Opción ${["A", "B", "C"][index]}`, option: { id: `qa_option_${id}`, title: "Opción" } }],
      // Synthetic availability for local cart tests; never a physical stock claim.
      manage_inventory: true, inventory_quantity: 1, allow_backorder: false,
      metadata: { synthetic_variant_media_fixture: true, storefront_price_approved: false },
    })),
  };
}
const products = [product("variantes", [image("general")], true), product("sin-general", [], true), product("sin-imagen", [], false), product("general", [image("general"), image("general-two", 1)], false)];
const stats = { reads: 0, rejectedWrites: 0, externalBackendConnection: false };

createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3226");
  res.setHeader("Access-Control-Allow-Headers", "content-type,x-publishable-api-key,authorization,x-medusa-locale");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "GET") {
    stats.rejectedWrites++; res.writeHead(405);
    return res.end(JSON.stringify({ message: "Synthetic read-only fixture: writes disabled" }));
  }
  stats.reads++;
  const url = new URL(req.url, origin);
  if (url.pathname.startsWith("/qa-media/")) {
    const name = url.pathname.slice("/qa-media/".length).replace(/\.svg$/, "");
    if (!imageNames.includes(name)) { res.writeHead(404); return res.end(); }
    res.setHeader("Content-Type", "image/svg+xml");
    return res.end(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#FAF8F5"/><rect x="160" y="200" width="480" height="400" rx="24" fill="${name.startsWith("a") ? "#8E7A9E" : name.startsWith("b") ? "#7F6D8A" : "#c4bbb0"}"/><text x="400" y="370" text-anchor="middle" font-size="44" font-family="sans-serif" fill="white">PRUEBA QA</text><text x="400" y="450" text-anchor="middle" font-size="52" font-family="sans-serif" fill="white">${name.toUpperCase()}</text><text x="400" y="720" text-anchor="middle" font-size="22" font-family="sans-serif" fill="#544b5d">Diagrama sintético · no es fotografía de producto</text></svg>`);
  }
  let payload;
  if (url.pathname === "/store/products") {
    const handle = url.searchParams.get("handle");
    let chosen = structuredClone(handle ? products.filter((p) => p.handle === handle) : products);
    // Only return the native relation when the real client requests its expansion.
    if (!url.searchParams.get("fields")?.includes("*variants.images")) chosen.forEach((p) => p.variants.forEach((v) => { delete v.images; }));
    const count = chosen.length, offset = Number(url.searchParams.get("offset") || 0), limit = Number(url.searchParams.get("limit") || 20);
    chosen = chosen.slice(offset, offset + limit);
    payload = { products: chosen, count, offset, limit };
  } else if (url.pathname === "/store/regions") payload = { regions: [{ id: "qa_region_mx", name: "México", currency_code: "mxn" }], count: 1 };
  else if (url.pathname === "/store/collections") payload = { collections: [], count: 0 };
  else if (url.pathname === "/store/product-categories") payload = { product_categories: [], count: 0 };
  else if (url.pathname === "/__qa/status") payload = stats;
  else { res.statusCode = 404; payload = { message: "Not part of the synthetic fixture" }; }
  res.end(JSON.stringify(payload));
}).listen(9000, "127.0.0.1", () => console.log("Variant media QA · 127.0.0.1:9000 · read-only synthetic fixture"));
