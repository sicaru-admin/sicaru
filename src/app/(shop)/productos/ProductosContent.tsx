"use client";
import { useEffect, useMemo, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { ProductCatalogCard } from "@/components/products/ProductCatalogCard";
import { categoryLabel, getProductPriceRange, matchesCatalogQuery } from "@/lib/catalog";
type Filters={q:string;categoria:string;marca:string;min:string;max:string};
export function ProductosContent({products,initialFilters}:{products:HttpTypes.StoreProduct[];initialFilters?:Partial<Filters>}) {
  const [filters,setFilters]=useState<Filters>({q:"",categoria:"",marca:"",min:"",max:"",...initialFilters});
  const [hydrated,setHydrated]=useState(false);
  useEffect(()=>{const params=new URLSearchParams(location.search);queueMicrotask(()=>{setFilters({q:params.get("q")??"",categoria:params.get("categoria")??"",marca:params.get("marca")??"",min:params.get("min")??"",max:params.get("max")??""});setHydrated(true);});},[]);
  const categories=useMemo(()=>Array.from(new Map(products.flatMap(p=>(p.categories??[]).map(c=>[c.id,c] as const))).values()),[products]);
  const brands=useMemo(()=>Array.from(new Set(products.map(p=>p.collection?.title).filter((v):v is string=>!!v))).sort(),[products]);
  function update(key:keyof Filters,value:string){setFilters(current=>({...current,[key]:value}));}
  useEffect(()=>{
    if(!hydrated)return;
    const params=new URLSearchParams(location.search);
    for(const [key,value]of Object.entries(filters)){if(value)params.set(key,value);else params.delete(key);}
    const url=location.pathname+(params.size?"?"+params.toString():"");
    history.replaceState(history.state,"",url);
  },[filters,hydrated]);
  useEffect(()=>{
    if(!hydrated)return;
    const key="sicaru_catalog_scroll:"+location.pathname+location.search;
    let frame=0;const save=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{try{sessionStorage.setItem(key,String(scrollY));}catch{}});};
    let saved=0;try{saved=Number(sessionStorage.getItem(key)||0);}catch{}
    const restore=requestAnimationFrame(()=>requestAnimationFrame(()=>scrollTo(0,saved)));
    addEventListener("scroll",save,{passive:true});
    return()=>{cancelAnimationFrame(frame);cancelAnimationFrame(restore);removeEventListener("scroll",save);};
  },[filters,hydrated]);
  useEffect(()=>{const pop=()=>{const p=new URLSearchParams(location.search);setFilters({q:p.get("q")??"",categoria:p.get("categoria")??"",marca:p.get("marca")??"",min:p.get("min")??"",max:p.get("max")??""});};addEventListener("popstate",pop);return()=>removeEventListener("popstate",pop);},[]);
  const shown=useMemo(()=>products.filter(product=>{
    if(!matchesCatalogQuery(product,filters.q))return false;
    if(filters.categoria&&!(product.categories??[]).some(c=>c.id===filters.categoria||c.handle===filters.categoria))return false;
    if(filters.marca&&product.collection?.title!==filters.marca)return false;
    const price=getProductPriceRange(product);
    if(filters.min&&(!price||price.minimum<Number(filters.min)))return false;
    if(filters.max&&(!price||price.minimum>Number(filters.max)))return false;
    return true;
  }),[products,filters]);
  const active=Object.values(filters).some(Boolean);
  return <section className="mx-auto max-w-7xl px-4 pb-8">
    <label htmlFor="catalog-search" className="sr-only">Buscar por producto, marca o tono</label>
    <input id="catalog-search" type="search" value={filters.q} onChange={e=>update("q",e.target.value)} placeholder="Producto, marca o número de tono" className="sicaru-input min-h-12 w-full bg-white px-4 text-sm"/>
    <details className="my-3 rounded-md border border-sicaru-purple-200 bg-white px-3">
      <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">Filtros{active?" · activos":""}</summary>
      <div className="grid grid-cols-2 gap-3 pb-3 text-sm">
        <label>Categoría<select className="mt-1 min-h-11 w-full rounded border bg-white px-2" value={filters.categoria} onChange={e=>update("categoria",e.target.value)}><option value="">Todas</option>{categories.map(c=><option key={c.id} value={c.id}>{categoryLabel(c)}</option>)}</select></label>
        <label>Marca<select className="mt-1 min-h-11 w-full rounded border bg-white px-2" value={filters.marca} onChange={e=>update("marca",e.target.value)}><option value="">Todas</option>{brands.map(b=><option key={b}>{b}</option>)}</select></label>
        <label>Precio mínimo<input type="number" min="0" inputMode="decimal" className="mt-1 min-h-11 w-full rounded border px-2" value={filters.min} onChange={e=>update("min",e.target.value)}/></label>
        <label>Precio máximo<input type="number" min="0" inputMode="decimal" className="mt-1 min-h-11 w-full rounded border px-2" value={filters.max} onChange={e=>update("max",e.target.value)}/></label>
      </div>
    </details>
    <div className="mb-4 flex items-center justify-between text-xs text-gray-600"><p role="status">{shown.length} productos</p>{active&&<button onClick={()=>setFilters({q:"",categoria:"",marca:"",min:"",max:""})} className="min-h-11 underline">Limpiar filtros</button>}</div>
    {shown.length?<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{shown.map(p=><ProductCatalogCard key={p.id} product={p}/>)}</div>:<p className="py-8 text-center text-sm text-gray-600">No encontramos productos. Ajusta la búsqueda o los filtros.</p>}
  </section>;
}
