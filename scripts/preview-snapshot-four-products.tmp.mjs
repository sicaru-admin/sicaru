#!/usr/bin/env node
// SICARÚ: snapshot efímero de SOLO LECTURA en build Preview PR #34.
// No cambiar Medusa ni mostrar claves, precios, inventarios o datos de clientes.
if(process.env.VERCEL_ENV!=="preview"||process.env.VERCEL_GIT_COMMIT_REF!=="fix/catalogo-fotos-identidad-nov2026"){console.log("[SICARU_SNAPSHOT] SKIPPED");process.exit(0)}
const base=process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL, key=process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
if(!base||!key){console.log("[SICARU_SNAPSHOT] BLOCKED missing public env");process.exit(0)}
const ids=new Set(["prod_01M79C6MFY2YPX504ZMDW9HJ0A","prod_01M79C7BHA8D7GCZG4DTBM1Q68","prod_01M79C817D78WYM8K6D9W32NH1","prod_01KVV3GD5ZR40Q6YWBS7QHJ48Z"]);
const cleanUrl=v=>typeof v==="string"?v.replace(/[?#].*$/,""):null;
const cleanText=v=>typeof v==="string"?v.slice(0,2500):null;
try{
 const all=[];
 for(let o=0;o<500;o+=100){
  const u=new URL("/store/products",base);u.searchParams.set("limit","100");u.searchParams.set("offset",String(o));
  const response=await fetch(u,{headers:{"x-publishable-api-key":key},cache:"no-store",signal:AbortSignal.timeout(15000)});
  if(!response.ok){console.log("[SICARU_SNAPSHOT] HTTP_"+response.status);process.exit(0)}
  const d=await response.json();if(!Array.isArray(d.products)){console.log("[SICARU_SNAPSHOT] INVALID_RESPONSE");process.exit(0)}
  all.push(...d.products);if(d.products.length<100)break;
 }
 const target=all.filter(p=>ids.has(p.id));console.log("[SICARU_SNAPSHOT] read="+target.length+"/4 all="+all.length);
 for(const p of target){const x={id:p.id,handle:p.handle,title:p.title,description:cleanText(p.description),subtitle:cleanText(p.subtitle),
 thumbnail:cleanUrl(p.thumbnail),images:(p.images||[]).map(i=>({id:i.id||null,url:cleanUrl(i.url),rank:i.rank??null})),
 variants:(p.variants||[]).map(v=>({id:v.id,title:v.title,sku:v.sku||null,barcode:v.barcode||null})),
 masterId:p.metadata?.sicaru_master_product_id||null};
 console.log("[SICARU_SNAPSHOT] "+JSON.stringify(x))}
}catch(e){console.log("[SICARU_SNAPSHOT] FETCH_FAILED "+(e instanceof Error?e.name:"unknown"))}
