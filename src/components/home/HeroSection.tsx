import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHeroVisual } from "./HomeHeroVisual";

export function HeroSection() {
  return (
    <section className="overflow-hidden border-b border-[#efe7dd] bg-[#f5f1eb]" aria-labelledby="retail-hero">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[1.12fr_1fr] items-center gap-0 px-4 py-4 sm:gap-5 sm:px-8 sm:py-6 lg:grid-cols-2 lg:px-10 lg:py-7">
        <div className="relative z-10 min-w-0 max-w-lg py-2">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#7f6d8a] sm:text-xs">SICARÚ BEAUTY</p>
          <h1 id="retail-hero" className="mt-2 max-w-[16ch] text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.035em] text-[#2e2b2b] sm:text-[2.5rem] lg:text-[3.25rem]">Belleza profesional para ti y tu salón</h1>
          <p className="mt-3 max-w-sm text-xs leading-5 text-[#2e2b2b]/80 sm:text-base sm:leading-6">Coloración, tratamientos, herramientas y más</p>
          <Link href="/productos" className="mt-4 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-[#7f6d8a] px-3 py-2.5 text-[0.68rem] font-semibold text-[#faf8f5] transition-colors hover:bg-[#6c5c76] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a] motion-reduce:transition-none sm:gap-2 sm:px-6 sm:text-sm">
            Explorar productos <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
          </Link>
          <Link href="#home-categories" className="mt-1 hidden min-h-11 w-fit items-center text-sm font-medium text-[#7f6d8a] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f6d8a] sm:flex">Ver categorías</Link>
        </div>
        <HomeHeroVisual />
      </div>
    </section>
  );
}
