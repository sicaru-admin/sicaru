import Link from "next/link";

const brands = [
  { name: "Küül", handle: "kuul" },
  { name: "Voglia", handle: "voglia" },
  { name: "Nekane Capilar", handle: "nekane-capilar" },
  { name: "Hidra Color", handle: "hidra-color" },
  { name: "Xiomara", handle: "xiomara" },
  { name: "Vitale", handle: "vitale" },
  { name: "Montis", handle: "montis" },
];

export function BrandsShowcase() {
  return (
    <section className="border-y border-[#efe7dd] bg-[#faf8f5] py-5 sm:py-7" aria-labelledby="home-brands">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">
        <h2 id="home-brands" className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#7f6d8a]">Nuestras marcas</h2>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 md:gap-x-10">
          {brands.map((brand) => <Link key={brand.handle} href={`/marcas/${brand.handle}`} className="inline-flex min-h-12 items-center text-sm font-semibold sm:text-base text-[#2e2b2b] transition-colors hover:text-[#7f6d8a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a]">{brand.name}</Link>)}
        </div>
      </div>
    </section>
  );
}
