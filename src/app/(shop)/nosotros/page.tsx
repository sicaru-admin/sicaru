import type { Metadata } from "next";
import Link from "next/link";
import { STORE } from "@/lib/constants/store";

export const metadata: Metadata = {
  title: "Conoce SICARÚ — Beauty Store",
  description: "Tu tienda mexicana de belleza en el centro de Cadereyta Jiménez, Nuevo León. Productos para tu cuidado personal y tu profesión.",
};
const primary = "inline-flex min-h-12 items-center justify-center rounded-full bg-[#7f6d8a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8e7a9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a]";
const subtle = "inline-flex min-h-11 items-center text-sm font-semibold text-[#2e2b2b] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a]";

export default function NosotrosPage() {
  return <>
    <section className="overflow-hidden bg-[#f5f1eb]">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2e2b2b]">Beauty Store · Cadereyta</p>
          <h1 className="mt-3 font-heading text-5xl leading-tight text-[#2e2b2b] lg:text-6xl">Conoce SICARÚ</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#2e2b2b]/75 sm:text-base">Tu tienda mexicana de belleza en el centro de Cadereyta Jiménez, Nuevo León. Coloración, cuidado y herramientas para uso personal y profesional.</p>
          <Link href="/productos" className={`${primary} mt-5`}>Ver productos</Link>
        </div>
      </div>
    </section>
    <section className="border-b border-[#efe7dd] px-5 py-9 sm:px-8 md:py-12 lg:px-10" aria-labelledby="historia">
      {/* Incorporar aquí una fotografía del establecimiento cuando esté aprobada.
          Sin fotografía verificada, el bloque editorial no reserva un hueco vacío. */}
      <div className="mx-auto grid max-w-[1320px] gap-5 md:grid-cols-[1fr_1.3fr] md:gap-12 lg:gap-20">
        <h2 id="historia" className="max-w-sm font-heading text-3xl leading-tight text-[#2e2b2b] sm:text-4xl">Más de 10 años en Cadereyta.</h2>
        <div className="max-w-2xl space-y-4 text-sm leading-7 text-[#2e2b2b]/80 sm:text-base sm:leading-8">
          <p>Somos una tienda mexicana de productos de belleza para uso personal y profesional.</p>
          <p>Sabemos que no todos buscamos lo mismo. Por eso nos gusta compartir información clara sobre los productos y sus características, para que conozcas tus opciones y elijas sin presiones.</p>
          <p className="font-semibold text-[#2e2b2b]">Visítanos en el centro de Cadereyta Jiménez.</p>
        </div>
      </div>
    </section>
    <section className="bg-[#f5f1eb] px-5 py-8 sm:px-8 md:py-10 lg:px-10" aria-labelledby="descubre">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div>
          <h2 id="descubre" className="font-heading text-3xl leading-tight text-[#2e2b2b] sm:text-4xl">¿Buscas algo en particular?</h2>
          <p className="mt-3 text-sm leading-7 text-[#2e2b2b]/80 sm:text-base">Explora nuestros productos o consúltanos por WhatsApp.</p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 min-[400px]:flex-row min-[400px]:items-center min-[400px]:gap-6">
          <Link href="/productos" className={primary}>Ver productos</Link>
          <a href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent("Hola, quisiera consultar un producto en SICARÚ.")}`} target="_blank" rel="noopener noreferrer" className={subtle}>Consultar por WhatsApp</a>
        </div>
      </div>
    </section>
  </>;
}
