import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  { label: "Coloración", href: "/categorias/color-y-tintes", image: "/images/products-hero/voglia-color-fun.webp", alt: "Voglia Color Fun, coloración profesional" },
  { label: "Tratamientos", href: "/categorias/tratamientos-y-mascarillas", image: "/images/products-hero/voglia-total-repair.webp", alt: "Voglia Total Repair, tratamiento capilar" },
  { label: "Herramientas", href: "/categorias/herramientas-pro", image: "/images/products-hero/navaja-profesional.webp", alt: "Navaja profesional para barbería" },
  { label: "Para profesionales", href: "/salon-pro", image: "/images/products-hero/vitale-bifase-pro-keratin.webp", alt: "Vitale Bifase Pro-Keratin para el cuidado capilar profesional", companion: true },
];

export function CategoriesGrid() {
  return (
    <section className="bg-[#faf8f5] py-5 sm:py-7" aria-labelledby="home-categories">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">
        <h2 id="home-categories" className="mb-3 scroll-mt-36 text-base font-semibold text-[#2e2b2b] sm:mb-4 sm:text-xl">Compra por categoría</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
          {categories.map((category) => (
            <Link key={category.href} href={category.href} className="group relative min-w-0 overflow-hidden rounded-xl border border-[#efe7dd] bg-[#faf8f5] transition-colors hover:border-[#9b89a8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a] motion-reduce:transition-none">
              <div className="relative h-28 overflow-hidden bg-[#f5f1eb]/60 sm:h-40">
                <div className={`absolute inset-y-0 left-1/2 w-20 sm:w-[120px] ${category.companion ? "-translate-x-[70%]" : "-translate-x-1/2"}`}>
                  <Image src={category.image} alt={category.alt} fill sizes="(max-width: 639px) 120px, 180px" className="object-cover drop-shadow-[0_4px_3px_rgba(46,43,43,0.08)] transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
                </div>
                {category.companion && <div className="absolute bottom-0 left-1/2 h-[72%] w-16 -translate-x-[5%] sm:w-[88px]">
                  <Image src="/images/products-hero/hidra-color-mask.webp" alt="Hidra Color Mask, tratamiento matizante" fill sizes="(max-width: 639px) 100px, 150px" className="object-cover drop-shadow-[0_4px_3px_rgba(46,43,43,0.08)]" />
                </div>}
              </div>
              <div className="flex min-h-11 items-center justify-between gap-1 border-t border-[#efe7dd]/70 px-2.5 py-2 text-[#2e2b2b] sm:px-4">
                <h3 className="text-[0.7rem] font-semibold leading-4 sm:text-sm">{category.label}</h3>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#7f6d8a]" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
