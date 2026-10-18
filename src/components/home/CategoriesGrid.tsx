import Link from "next/link";
import {getCategories} from "@/lib/data/categories";
import {categoryLabel} from "@/lib/catalog";
export async function CategoriesGrid(){
  const {categories}=await getCategories();
  const real=Array.from(new Map(categories.map(c=>[categoryLabel(c),c])).values());
  if(!real.length)return null;
  return <section className="mx-auto max-w-7xl px-4 py-6"><h2 className="mb-4 text-2xl">Compra por categoría</h2><div className="flex flex-wrap gap-2">{real.map(c=><Link key={c.id} href={"/productos?categoria="+encodeURIComponent(c.id)} className="flex min-h-11 items-center rounded-full border border-sicaru-purple-200 bg-white px-4 text-sm font-medium text-sicaru-purple-700">{categoryLabel(c)}</Link>)}</div></section>;
}
