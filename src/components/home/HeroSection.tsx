import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

const WHATSAPP_MESSAGE =
  "Hola, quiero comprar productos profesionales Sicarú por WhatsApp.";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f5f1eb]">
      <div className="absolute right-0 top-0 hidden h-full w-[42%] bg-[#efe7dd] lg:block" />
      <div className="absolute left-6 top-10 hidden h-px w-28 bg-[#8e7a9e]/45 md:block" />
      <div className="mx-auto grid min-h-[680px] max-w-7xl gap-10 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative z-10">
          <p className="sicaru-eyebrow">Belleza profesional</p>
          <h1 className="mt-5 max-w-3xl font-heading text-5xl font-semibold leading-[0.98] text-[#2e2b2b] sm:text-6xl lg:text-7xl">
            Belleza profesional para cuidar, transformar y reparar tu cabello
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#2e2b2b]/70 sm:text-lg">
            En Sicarú reunimos coloración, tratamientos, herramientas y marcas
            profesionales para estilistas y para quienes buscan mejores resultados
            en casa.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/productos" className="sicaru-button-primary">
              Explorar productos
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/528281111023?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sicaru-button-secondary"
            >
              <MessageCircle className="h-4 w-4" />
              Recibir asesoría
            </a>
          </div>

          <div className="mt-10 border-y border-[#7f6d8a]/20 py-4">
            <p className="text-sm font-medium text-[#7f6d8a]">
              Productos profesionales · Atención personalizada · Tienda física
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="relative mx-auto max-w-xl border border-[#d8cedc] bg-[#faf8f5] p-4 shadow-[0_24px_70px_rgba(46,43,43,0.10)] md:p-6">
            <div className="absolute -left-5 top-8 hidden h-24 w-24 border border-[#8e7a9e]/35 md:block" />
            <div className="absolute -right-5 bottom-10 hidden h-32 w-24 bg-[#efe7dd] md:block" />
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efe7dd]">
              <Image
                src="/images/hero-productos-tienda.jpg"
                alt="Productos profesionales Sicarú en composición limpia sobre fondo cálido"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-5 grid grid-cols-[auto_1fr] gap-4 border-t border-[#efe7dd] pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#9b89a8]/35 text-[#7f6d8a]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7f6d8a]">
                  Productos Sicarú
                </p>
                <p className="mt-1 text-sm leading-6 text-[#2e2b2b]/65">
                  Catálogo curado para cuidado capilar, coloración y acabado profesional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
