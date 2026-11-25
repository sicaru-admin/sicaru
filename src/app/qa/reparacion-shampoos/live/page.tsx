import type { Metadata } from "next";
import type { HttpTypes } from "@medusajs/types";
import { RetailProductCard } from "@/components/products/RetailProductCard";
import { notFound } from "next/navigation";
import { CATALOG_MODE } from "@/lib/catalog-mode";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {title:"Diagnóstico de imágenes · SICARÚ",robots:{index:false,follow:false}};

type PublicImage = {url?: string | null};
type PublicProduct = {
  id?:string;handle?:string;title?:string;thumbnail?:string|null;
  images?:PublicImage[];metadata?:Record<string,unknown>;
};
type Row = {kind:"r3"|"montis"; handle:string;expectedTitle:string;masterId:string;historicalMedusaId?:string;front?:string};
const rows:Row[] = [
  {kind:"r3",handle:"xiomara-shampoo-platinum-250ml",expectedTitle:"XIOMARA Shampoo Platinum 250 ml",masterId:"PRD-9CC3A06A6F10",historicalMedusaId:"prod_01M79C6MFY2YPX504ZMDW9HJ0A",front:"/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp"},
  {kind:"r3",handle:"xiomara-shampoo-platinum-libre-sulfatos-250ml",expectedTitle:"XIOMARA Shampoo Platinum Libre de Sulfatos 250 ml",masterId:"PRD-3CE612A96316",historicalMedusaId:"prod_01M79C7BHA8D7GCZG4DTBM1Q68",front:"/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal-r3.webp"},
  {kind:"r3",handle:"nekane-morazul-shampoo-matizador-300g",expectedTitle:"NEKANE Morazul Shampoo Matizador 300 g",masterId:"PRD-ABEB7E8039E3",historicalMedusaId:"prod_01M79C817D78WYM8K6D9W32NH1",front:"/images/products/nekane-morazul-shampoo-matizador-300g/01-principal-r3.webp"},
  {kind:"montis",handle:"",expectedTitle:"Shampoo de Caballo Montis 650 ml",masterId:"PRD-MONTIS-CABALLO-650"},
];
const safe = (str:unknown) => typeof str==="string"&&str.trim() ? str : "";
function Status({current, expected}:{current:string;expected:string}) {
  return <span className={current===expected?"text-green-700":"text-amber-800"}>{current===expected?"Coincide":"Sin coincidencia verificada"}</span>;
}

async function listPublicProducts():Promise<{products:PublicProduct[];error?:string}> {
  const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  if (!base || !key) return {products:[],error:"Preview sin URL o clave publicable de Medusa. No se accedió a Admin."};
  try {
    const products:PublicProduct[]=[];
    for(let offset=0;offset<200;offset+=100){
      const url=new URL("/store/products",base);
      url.searchParams.set("limit","100");
      url.searchParams.set("offset",String(offset));
      const res=await fetch(url,{headers:{"x-publishable-api-key":key},cache:"no-store",signal:AbortSignal.timeout(10000)});
      if(!res.ok)return {products:[],error:`Store API devolvió HTTP ${res.status}. No se efectuó ninguna modificación.`};
      const data:unknown=await res.json();
      if(!data||typeof data!=="object"||!("products" in data)||!Array.isArray(data.products))
        return {products:[],error:"La respuesta de Store API no contiene products[]."};
      products.push(...(data.products as PublicProduct[]));
      if(data.products.length<100)return {products};
    }
    return {products:[],error:"El catálogo excede 200 registros; no se presenta una consulta incompleta."};
  }catch {return {products:[],error:"No se pudo consultar la API pública desde Preview. No se efectuó ninguna modificación."};}
}

export default async function LiveImageAudit() {
  if (!CATALOG_MODE || (process.env.VERCEL_ENV!=="preview" && process.env.NODE_ENV!=="development")) notFound();
  const result=await listPublicProducts();
  return <main className="min-h-screen bg-[#FAF8F5] px-4 py-8 text-[#2E2B2B] sm:px-8">
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-semibold uppercase tracking-[.12em] text-[#7F6D8A]">SICARÚ · Diagnóstico de solo lectura</p>
      <h1 className="mt-2 font-heading text-3xl">Imágenes y nombre recibidos desde Medusa</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6">Consulta pública Store API sin escrituras. La coincidencia de ID maestro es indispensable antes de cualquier reemplazo. El ID histórico solo admite revisión visual y requiere conciliación Admin. Ninguna coincidencia sustituye aprobación visual, SKU o inventario físico.</p>
      {result.error&&<p role="alert" className="mt-5 rounded-lg border border-amber-500 p-4 text-sm">{result.error}</p>}
      {!result.error && <p className="mt-4 text-sm text-[#7F6D8A]">{result.products.length} productos públicos leídos en Preview.</p>}
      <div className="mt-8 space-y-7">
        {rows.map(row=>{
          const matches=result.products.filter(p=>row.kind==="montis"
            ? p.metadata?.sicaru_master_product_id===row.masterId || (p.title||"").toLowerCase()==="montis shampoo extracto natural"
            : p.handle===row.handle);
          return <section key={row.masterId} className="rounded-xl border border-[#E9E1DD] p-4 sm:p-6">
            <h2 className="font-heading text-2xl">{row.expectedTitle}</h2>
            {!result.error&&matches.length===0&&<p className="mt-2 text-sm text-amber-800">Sin coincidencia en Store API. No crear registros ni asociar fotografías automáticamente.</p>}
            {matches.map((p,i)=>{
              const master=safe(p.metadata?.sicaru_master_product_id);
              const current=safe(p.thumbnail)||safe(p.images?.[0]?.url);
              const historicalMatch=!!row.historicalMedusaId && p.id===row.historicalMedusaId && !master;
              const allowCandidate=row.kind==="r3" && (master===row.masterId || historicalMatch);
              return <div key={p.id||i} className="mt-4">
                <p className="text-sm"><strong>Título actual:</strong> {p.title||"Sin nombre"}</p>
                <p className="mt-1 text-xs"><strong>Producto:</strong> {p.id||"Sin ID"} · <strong>Handle:</strong> {p.handle||"Sin handle"}</p>
                <p className="mt-1 text-xs"><strong>ID maestro:</strong> {master||"No expuesto"} · <Status current={master} expected={row.masterId}/></p>
                {historicalMatch&&<p className="mt-1 text-xs text-amber-800">ID Medusa coincide con fixture histórico: solamente permite comparación, no autoriza sustituir imágenes.</p>}
                {!allowCandidate&&row.kind==="r3"&&<p className="mt-1 text-xs text-amber-800">Candidato bloqueado para esta ficha: identidad no conciliada.</p>}
                <p className="mt-1 break-all text-xs"><strong>Thumbnail:</strong> {p.thumbnail||"VACÍO"}</p>
                <p className="mt-1 break-all text-xs"><strong>Primera imagen:</strong> {p.images?.[0]?.url||"VACÍA"}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <p className="mb-2 text-xs">Actual recibido</p>
                    <div className="flex aspect-square items-center justify-center rounded-lg bg-[#F5F1EB] p-3">
                      {current ? <img src={current} alt={`Actual de ${p.title||"producto"}`} className="max-h-full max-w-full object-contain" />:<span className="text-center text-xs text-[#7F6D8A]">Sin URL pública de imagen</span>}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="mb-2 text-xs">Candidato R3 / pendiente</p>
                    <div className="flex aspect-square items-center justify-center rounded-lg bg-[#F5F1EB] p-3">
                      {allowCandidate && row.front ? <img src={row.front} alt={`R3 propuesta para ${row.expectedTitle}`} className="max-h-full max-w-full object-contain" />:<span className="text-center text-xs text-[#7F6D8A]">{row.kind==="montis"?"Montis: WebP V2 aún no aprobado ni incorporado al repositorio":"Imagen bloqueada hasta verificar identidad"}</span>}
                    </div>
                  </div>
                </div>
                {allowCandidate&&row.front&&<div className="mt-6" data-testid={`retail-card-${row.handle}`}>
                  <p className="mb-3 text-xs font-semibold text-[#7F6D8A]">Vista de tarjeta REAL del catálogo · prueba, sin cambios Medusa</p>
                  <div className="grid grid-cols-2 gap-3 sm:max-w-[740px] sm:gap-6">
                    <div className="min-w-0"><p className="mb-2 text-xs">Como llega hoy</p><RetailProductCard product={p as HttpTypes.StoreProduct} disableVerifiedPhoto/></div>
                    <div className="min-w-0"><p className="mb-2 text-xs">Con R3 candidata</p><RetailProductCard product={{...p,thumbnail:row.front} as HttpTypes.StoreProduct}/></div>
                  </div>
                  <p className="mt-2 text-xs text-[#7F6D8A]">El precio y disponibilidad de ambas tarjetas se calculan con la misma ficha recibida; solo cambia thumbnail en memoria para la comparación.</p>
                </div>}
              </div>;
            })}
          </section>;
        })}
      </div>
      <p className="mt-7 text-xs text-[#7F6D8A]">No se muestran ni modifican precios, inventario, EAN ni datos privados. No autoriza publicación.</p>
    </div>
  </main>;
}
