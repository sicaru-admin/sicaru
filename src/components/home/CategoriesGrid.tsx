import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * SICARÚ approved photographic direction A/B/C.
 * All photographs are existing source assets. No synthetic packages, decorative
 * blur or checkout promises. C is a provisional information hierarchy.
 */
const categoryLinks = [
  { href: "/categorias/color-y-tintes", label: "Coloración", description: "Explora productos y tonos", image: "/images/products-hero/voglia-color-fun.webp", alt: "Voglia Color Fun, fotografía real de producto", background: "bg-[#8E7A9E]", foreground: "text-[#FAF8F5]" },
  { href: "/categorias/herramientas-pro", label: "Herramientas", description: "Equipa tu trabajo", image: "/images/products-hero/navaja-profesional.webp", alt: "Navaja profesional de barbería, fotografía real de producto", background: "bg-[#F5F1EB]", foreground: "text-[#2E2B2B]" },
  { href: "/salon-pro", label: "Para profesionales", description: "Productos para tu profesión", image: "/images/products-hero/vitale-bifase-pro-keratin.webp", alt: "Vitale Bifase Pro-Keratin, fotografía real de producto", background: "bg-[#9B89A8]", foreground: "text-[#2E2B2B]" },
] as const;

export function CategoriesGrid() {
  return (
    <section className="bg-[#FAF8F5] py-7 sm:py-10" aria-labelledby="home-categories">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-7">
          <div>
            <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#7F6D8A] sm:text-xs">SICARÚ · Explora por necesidad</p>
            <h2 id="home-categories" className="scroll-mt-36 text-[clamp(1.65rem,3vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.055em] text-[#2E2B2B]">¿Qué buscas hoy?</h2>
          </div>
          <Link href="/productos" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#7F6D8A] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A] sm:text-sm">Ver productos <ArrowUpRight className="size-4" aria-hidden="true"/></Link>
        </div>
        <div className="grid gap-3 lg:grid-cols-[1.14fr_0.86fr] lg:gap-4">
          <Link href="/categorias/tratamientos-y-mascarillas" className="group relative isolate flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[18px] bg-[#F5F1EB] p-6 text-[#2E2B2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A] sm:min-h-[490px] sm:p-9 lg:min-h-[580px]">
            <div className="relative z-10 max-w-[55%]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7F6D8A]">Cuidado capilar</p>
              <h3 className="mt-3 text-[clamp(2rem,4vw,3.8rem)] font-bold leading-[0.98] tracking-[-0.065em]">Cuida tu cabello.</h3>
            </div>
            <div className="pointer-events-none absolute bottom-[-7%] right-[-26%] h-[84%] w-[76%] sm:bottom-[-4%] sm:right-[-4%] sm:h-[92%] sm:w-[65%]">
              <Image src="/images/products-hero/voglia-total-repair.webp" alt="Voglia Total Repair, fotografía real de tratamiento capilar" fill sizes="(max-width: 1023px) 72vw, 40vw" className="object-contain" />
            </div>
            <span className="relative z-10 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#7F6D8A] px-5 py-3 text-xs font-semibold text-[#FAF8F5] sm:text-sm">Explorar tratamientos <ArrowUpRight className="size-4" aria-hidden="true"/></span>
          </Link>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
            {categoryLinks.map((category) => (
              <Link key={category.href} href={category.href} className={`group relative isolate flex min-h-[190px] overflow-hidden rounded-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A] sm:min-h-[235px] lg:min-h-[181px] ${category.background} ${category.foreground}`}>
                <div className="relative z-10 flex w-[57%] flex-col items-start justify-between p-5 sm:p-6">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] opacity-90">{category.description}</p>
                  <div className="flex flex-col items-start gap-2">
                    <h3 className="text-[clamp(1.2rem,2.4vw,1.9rem)] font-bold leading-tight tracking-[-0.045em]">{category.label}</h3>
                    <span className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-current/40"><ArrowUpRight className="size-5" aria-hidden="true" /></span>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-y-[3%] right-[-4%] w-[48%]">
                  <Image src={category.image} alt={category.alt} fill sizes="(max-width: 639px) 45vw, 20vw" className="object-contain" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
