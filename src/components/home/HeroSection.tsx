import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHeroVisual } from "./HomeHeroVisual";

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-[#f5f1eb]">
      <div className="mx-auto grid max-w-[1480px] gap-8 px-5 py-8 sm:px-8 md:grid-cols-2 md:items-center md:gap-10 md:py-12 lg:px-10 lg:py-16">
        <div className="max-w-xl">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#7f6d8a] sm:text-xs">
            SICARÚ · BELLEZA PROFESIONAL
          </p>
          <h1 className="mt-4 max-w-[13ch] font-heading text-[2.75rem] font-medium leading-[1.05] text-[#2e2b2b] sm:text-6xl lg:text-7xl">
            Belleza profesional, cercana y real.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#2e2b2b]/75 sm:text-base">
            Coloración, tratamientos y herramientas para estilistas y para quienes quieren cuidar su cabello con productos confiables.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/productos" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[6px] bg-[#7f6d8a] px-5 py-3 text-sm font-semibold text-[#faf8f5] transition-colors hover:bg-[#6d5b79] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a]">
              Explorar productos <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/nosotros" className="inline-flex min-h-12 items-center justify-center rounded-[6px] border border-[#7f6d8a]/45 px-5 py-3 text-sm font-semibold text-[#7f6d8a] transition-colors hover:bg-[#efe7dd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a]">
              Conocer SICARÚ
            </Link>
          </div>
        </div>
        <HomeHeroVisual />
      </div>
    </section>
  );
}
