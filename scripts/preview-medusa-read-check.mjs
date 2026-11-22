#!/usr/bin/env node
/**
 * Diagnóstico limitado a la rama Preview del PR #34.
 * Consulta GET Store API durante build y escribe solo IDs, títulos y rutas de
 * imágenes, nunca precios, existencias ni claves. No modifica Medusa.
 */
const branch = "fix/catalogo-fotos-identidad-nov2026";
if (process.env.VERCEL_ENV !== "preview" || process.env.VERCEL_GIT_COMMIT_REF !== branch) {
  process.stdout.write("[SICARU_CATALOG_AUDIT] SKIPPED: not target preview branch\n");
  process.exit(0);
}
const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
if (!base || !key) {
  process.stdout.write("[SICARU_CATALOG_AUDIT] BLOCKED: Store API URL or public key unavailable\n");
  process.exit(0);
}
const targets = [
  {handle:"xiomara-shampoo-platinum-250ml",historicalId:"prod_01M79C6MFY2YPX504ZMDW9HJ0A",masterId:"PRD-9CC3A06A6F10"},
  {handle:"xiomara-shampoo-platinum-libre-sulfatos-250ml",historicalId:"prod_01M79C7BHA8D7GCZG4DTBM1Q68",masterId:"PRD-3CE612A96316"},
  {handle:"nekane-morazul-shampoo-matizador-300g",historicalId:"prod_01M79C817D78WYM8K6D9W32NH1",masterId:"PRD-ABEB7E8039E3"},
  {handle:"montis-shampoo-extracto-natural",masterId:"PRD-MONTIS-CABALLO-650"},
];
const normalize = value => typeof value==="string" ? value.trim().toLowerCase() : "";
const publicPath = raw => {
  if (typeof raw!=="string" || !raw.trim()) return "MISSING";
  try {const u=new URL(raw,base);return u.origin+u.pathname;}catch{return "INVALID";}
};
async function run(){
  try {
    const list=[];
    for (let offset=0;offset<500;offset+=100) {
      const url=new URL("/store/products",base);
      url.searchParams.set("limit","100");
      url.searchParams.set("offset",String(offset));
      const response=await fetch(url,{headers:{"x-publishable-api-key":key},cache:"no-store",signal:AbortSignal.timeout(15000)});
      if(!response.ok){process.stdout.write(`[SICARU_CATALOG_AUDIT] API_HTTP_${response.status}\n`);return;}
      const payload=await response.json();
      if(!Array.isArray(payload?.products)){process.stdout.write("[SICARU_CATALOG_AUDIT] INVALID_RESPONSE\n");return;}
      list.push(...payload.products);
      if(payload.products.length<100) break;
    }
    process.stdout.write(`[SICARU_CATALOG_AUDIT] STORE_API_OK total=${list.length}\n`);
    for(const target of targets){
      const matches=list.filter(p=>normalize(p.handle)===target.handle || (target.handle.startsWith("montis")&&(normalize(p.title)==="montis shampoo extracto natural" || p.metadata?.sicaru_master_product_id===target.masterId)));
      if(matches.length!==1){process.stdout.write(`[SICARU_CATALOG_AUDIT] ${target.handle} MATCH_COUNT=${matches.length}; manual review required\n`);continue;}
      const p=matches[0];
      const metadataId=typeof p.metadata?.sicaru_master_product_id==="string"?p.metadata.sicaru_master_product_id:"MISSING";
      const sameMaster=metadataId===target.masterId;
      const sameHistorical=!!target.historicalId&&p.id===target.historicalId;
      process.stdout.write(JSON.stringify({
        marker:"SICARU_CATALOG_AUDIT",handle:target.handle,
        productId:p.id??null,title:p.title??null,masterId:metadataId,
        identity:sameMaster?"MASTER_MATCH":sameHistorical?"HISTORICAL_ID_ONLY":"UNVERIFIED",
        thumbnail:publicPath(p.thumbnail),
        firstImage:publicPath(p.images?.[0]?.url),galleryCount:p.images?.length??0
      })+"\n");
    }
  } catch(error){
    process.stdout.write(`[SICARU_CATALOG_AUDIT] REQUEST_FAILED type=${error instanceof Error?error.name:"unknown"}\n`);
  }
}
await run();
