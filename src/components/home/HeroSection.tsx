import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

const whatsappHref =
  "https://wa.me/528281111023?text=Hola%2C%20quiero%20asesor%C3%ADa%20para%20elegir%20productos%20Sicar%C3%BA.";

export function HeroSection() {
  return (
    <section className="bg-[#f5f1eb]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 md:gap-12 md:py-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f6d8a]">
            SICARÚ · BELLEZA PROFESIONAL
          </p>

          <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.08] text-[#2e2b2b] sm:text-5xl lg:text-[3.45rem]">
            Productos profesionales y asesoría para cuidar, transformar y reparar tu cabello
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-[#2e2b2b] sm:text-lg">
            Coloración, tratamientos, herramientas y cuidado capilar para estilistas y para quienes buscan mejores resultados en casa.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/productos"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-[#7f6d8a] px-6 py-3 text-sm font-semibold text-[#faf8f5] transition-colors duration-300 hover:bg-[#8e7a9e]"
            >
              Explorar productos
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border border-[#7f6d8a] bg-transparent px-6 py-3 text-sm font-semibold text-[#7f6d8a] transition-colors duration-300 hover:bg-[#efe7dd]"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
              Recibir asesoría por WhatsApp
            </a>
          </div>

          <p className="mt-7 max-w-xl text-sm font-medium leading-7 text-[#7f6d8a]">
            Tienda física en Cadereyta · Atención personalizada · Marcas profesionales
          </p>
        </div>

        <div className="bg-[#efe7dd] p-4 sm:p-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[#faf8f5]">
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
