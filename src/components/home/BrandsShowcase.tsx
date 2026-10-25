import Link from "next/link";

import { getPublishedBrandOptions } from "@/lib/data/brand-navigation";

export async function BrandsShowcase() {
  const { brands } = await getPublishedBrandOptions();
  return (
    <section className="border-y border-[#efe7dd] bg-[#faf8f5] py-5 sm:py-7" aria-labelledby="home-brands">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">
        <h2 id="home-brands" className="text-base font-semibold text-[#2e2b2b] sm:text-xl">Nuestras marcas</h2>
        <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
          {brands.length === 0 && <Link href="/productos" className="inline-flex min-h-11 items-center text-sm underline">Explorar el catálogo</Link>}
          {brands.map((brand) => <Link key={brand.handle} href={brand.href} className="inline-flex min-h-11 flex-grow items-center justify-center rounded-lg border border-[#efe7dd] bg-[#f5f1eb]/60 px-3 py-2 text-xs font-semibold text-[#2e2b2b] transition-colors hover:border-[#9b89a8] hover:text-[#7f6d8a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f6d8a] motion-reduce:transition-none sm:px-5 sm:text-sm">{brand.name}</Link>)}
        </div>
      </div>
    </section>
  );
}
