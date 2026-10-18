import type { Metadata } from "next";
import { ProductosContent } from "./ProductosContent";
import { getProducts } from "@/lib/data/products";
export const metadata:Metadata={title:"Catálogo",description:"Encuentra productos profesionales por marca, categoría y tono."};
export const revalidate=300;
export default async function ProductosPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const [{products},params]=await Promise.all([getProducts({limit:100}),searchParams]);
  const initialFilters=Object.fromEntries(["q","categoria","marca","min","max"].map(key=>[key,typeof params[key]==="string"?params[key]:""]));
  return <><div className="mx-auto max-w-7xl px-4 pb-4 pt-6"><h1 className="text-3xl">Catálogo</h1></div><ProductosContent products={products} initialFilters={initialFilters}/></>;
}
