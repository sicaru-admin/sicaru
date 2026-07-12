import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

const whatsappHref =
  "https://wa.me/528281111023?text=Hola%2C%20quiero%20asesor%C3%ADa%20para%20elegir%20productos%20Sicar%C3%BA.";

export function HeroSection() {
  return (
    <section className="bg-[#f5f1eb]">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-9 sm:px-8 md:grid-cols-2 md:gap-12 md:py-16 lg:py-20">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f6d8a]">
            SICARÚ · BELLEZA PROFESIONAL
          </p>

          <h1 className="mt-4 max-w-[18ch] font-heading text-[2.15rem] font-semibold leading-[1.04] text-[#2e2b2b] sm:text-5xl md:max-w-[17ch] lg:max-w-[18ch] lg:text-[3.15rem]">
            Belleza profesional para transformar y cuidar tu cabello
          </h1>

          <p className="mt-4 max-w-lg text-[0.95rem] leading-7 text-[#2e2b2b] sm:text-base">
            Coloración, tratamientos, herramientas y asesoría personalizada para estilistas y para quienes buscan mejores resultados en casa.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <Link
              href="/productos"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[6px] bg-[#7f6d8a] px-5 py-2.5 text-sm font-semibold text-[#faf8f5] transition-colors duration-[250ms] hover:bg-[#8e7a9e]"
            >
              Explorar productos
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[6px] border border-[#7f6d8a]/55 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#7f6d8a] transition-colors duration-[250ms] hover:bg-[#efe7dd]"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
              Recibir asesoría
            </a>
          </div>

          <p className="mt-5 max-w-lg text-xs font-normal leading-6 text-[#7f6d8a] sm:text-sm">
            Tienda física · Atención personalizada · Marcas profesionales
          </p>
        </div>

        <div className="mt-1 w-full bg-[#efe7dd] p-3 sm:p-4 md:mt-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#efe7dd] md:aspect-[3/4]">
            <Image
              src="/images/hero-productos-tienda.jpg"
              alt="Productos profesionales de belleza Sicarú en una presentación limpia"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
