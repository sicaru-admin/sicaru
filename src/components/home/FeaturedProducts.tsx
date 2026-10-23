import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import { RetailProductCard } from "@/components/products/RetailProductCard";

export async function FeaturedProducts() {
  let products: HttpTypes.StoreProduct[] = [];
  let unavailable = false;
  try { products = (await getProducts({ limit: 8 })).products; }
  catch { unavailable = true; }

  return (
    <section className="bg-[#faf8f5] py-5 sm:py-8" aria-labelledby="home-featured">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="home-featured" className="text-base font-semibold text-[#2e2b2b] sm:text-xl">Productos destacados</h2>
          <Link href="/productos" className="inline-flex min-h-11 shrink-0 items-center gap-1 text-xs font-semibold text-[#7f6d8a] sm:text-sm">Ver todos <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
        </div>
        {products.length ? <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">{products.map((product) => <RetailProductCard key={product.id} product={product} />)}</div> : (
          <div data-testid="featured-recovery" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#efe7dd] bg-[#f5f1eb] px-4 py-5 text-sm text-[#2e2b2b]/70">
            <p>{unavailable ? "No pudimos cargar esta selección." : "Explora más productos por categoría."}</p>
            <Link href="/productos" className="inline-flex min-h-11 items-center font-semibold text-[#7f6d8a] underline underline-offset-4">Explorar productos</Link>
          </div>
        )}
      </div>
    </section>
  );
}
