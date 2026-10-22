"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { ImageIcon } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { getProductPriceRange } from "@/lib/catalog";
export function ProductCatalogCard({product}:{product:HttpTypes.StoreProduct}) {
  const {addToCart,isLoading}=useCart();
  const [failed,setFailed]=useState(false),[added,setAdded]=useState(false),[error,setError]=useState("");
  const lock=useRef(false);
  const variants=product.variants??[],variant=variants[0],range=getProductPriceRange(product);
  const options=variants.length>1||(product.options??[]).some(option=>(option.values?.length??0)>0&&option.title!=="Default option");
  const soldOut=variants.length>0&&variants.every(v=>v.manage_inventory&&!v.allow_backorder&&v.inventory_quantity===0);
  const href=`/productos/${product.handle}`;
  const currency=variant?.calculated_price?.currency_code??"MXN";
  const inclusive=variants.every(v=>v.calculated_price?.is_calculated_price_tax_inclusive);
  async function add(){
    if(lock.current||!variant?.id)return;lock.current=true;setError("");setAdded(false);
    try{await addToCart(variant.id,1);setAdded(true);}catch{setError("No se pudo agregar. Abre el producto para revisar su disponibilidad.");}finally{lock.current=false;}
  }
  return <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-sicaru-purple-200 bg-white" data-product-card>
    <Link href={href} className="relative block aspect-square bg-[#f5f1eb]" aria-label={`Ver ${product.title}`}>
      {product.thumbnail&&!failed?<Image src={product.thumbnail} alt={product.title??"Producto"} fill onError={()=>setFailed(true)} sizes="(max-width:767px) 50vw,25vw" className="object-contain p-3" />:<span className="flex h-full flex-col items-center justify-center gap-2 text-center text-xs text-gray-500"><ImageIcon aria-hidden="true" className="h-7 w-7"/>Imagen no disponible</span>}
    </Link>
    <div className="flex flex-1 flex-col p-3">
      <Link href={href} className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-sicaru-purple-900">{product.title}</Link>
      <p className="mt-2 text-base font-semibold text-sicaru-purple-700">{range?`${range.varies?"Desde ":""}${new Intl.NumberFormat("es-MX",{style:"currency",currency}).format(range.minimum)}`:"Precio no disponible"}</p>
      {range&&<p className="mt-1 text-[11px] text-gray-500">{inclusive?"IVA incluido":"IVA al continuar"}</p>}
      <div className="mt-auto pt-3">
        {soldOut?<p className="py-3 text-sm text-gray-500">Agotado</p>:options?<Link href={href} className="flex min-h-11 items-center justify-center rounded-md border border-sicaru-purple-700 px-2 text-center text-xs font-semibold text-sicaru-purple-700">Elegir opciones</Link>:<button type="button" onClick={()=>void add()} disabled={!range||isLoading} className="min-h-11 w-full rounded-md bg-sicaru-purple-700 px-2 text-sm font-semibold text-white disabled:opacity-50">{isLoading?"Agregando…":"Agregar"}</button>}
        <p role="status" className="mt-1 text-xs text-green-800">{added?"Añadido al carrito":""}</p>
        {error&&<p role="alert" className="mt-1 text-xs text-red-700">{error}</p>}
      </div>
    </div>
  </article>;
}
