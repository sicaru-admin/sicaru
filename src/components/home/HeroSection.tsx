import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { HomeHeroVisual } from "./HomeHeroVisual";

const whatsappHref =
  "https://wa.me/528281111023?text=Hola%2C%20quiero%20asesor%C3%ADa%20para%20elegir%20productos%20Sicar%C3%BA.";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f5f1eb]">
      <div className="mx-auto grid max-w-[1480px] gap-7 px-5 py-7 sm:px-8 lg:px-10 md:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] md:items-center md:gap-8 md:py-9 lg:gap-10 lg:py-10">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f6d8a]">
            SICARÚ · BELLEZA PROFESIONAL
          </p>

          <h1 className="mt-3 max-w-[15ch] font-heading text-[2.2rem] font-medium leading-[1.02] text-[#2e2b2b] sm:text-[3.15rem] md:max-w-[15.5ch] lg:text-[3.65rem]">
            Belleza profesional para transformar y cuidar tu cabello
          </h1>

          <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-[#2e2b2b] sm:text-base">
            Coloración, tratamientos, herramientas y asesoría personalizada para estilistas y para quienes buscan mejores resultados en casa.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/productos"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-[#7f6d8a] px-5 py-3 text-sm font-semibold text-[#faf8f5] transition-colors duration-[250ms] hover:bg-[#8e7a9e] focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.22)]"
            >
              Explorar productos
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border border-[#7f6d8a]/55 bg-[#faf8f5] px-4 py-3 text-sm font-semibold text-[#7f6d8a] transition-colors duration-[250ms] hover:bg-[#efe7dd] focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.18)]"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
              Recibir asesoría
            </a>
          </div>
        </div>

        <HomeHeroVisual />
      </div>
    </section>
  );
}
