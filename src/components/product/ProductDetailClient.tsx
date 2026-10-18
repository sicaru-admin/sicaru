"use client";
import { useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { ProductActions } from "./ProductActions";
import { ImageGallery } from "./ImageGallery";
export function ProductDetailClient({product,images,brand}:{product:HttpTypes.StoreProduct;images:{id:string;url:string}[];brand?:string}) {
  const [variant,setVariant]=useState<HttpTypes.StoreProductVariant|null>(null);
  const variantImages=(variant as (HttpTypes.StoreProductVariant&{images?:{id:string;url:string}[]})|null)?.images;
  return <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-10">
    <ImageGallery key={variantImages?.map(i=>i.id).join()??"product"} images={variantImages?.length?variantImages:images} title={product.title??"Producto"} />
    <div className="min-w-0">
      {brand && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-sicaru-purple-700">{brand}</p>}
      <h1 className="font-heading text-2xl leading-tight md:text-3xl">{product.title}</h1>
      {typeof product.metadata?.components==="string" && <p className="mt-2 text-sm text-gray-600">{product.metadata.components}</p>}
      <div className="mt-4"><ProductActions product={product} onVariantChange={setVariant} /></div>
    </div>
  </div>;
}
