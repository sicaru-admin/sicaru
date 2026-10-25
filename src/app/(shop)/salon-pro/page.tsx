import type { Metadata } from "next";
import Link from "next/link";
import { InternalPageHeader } from "@/components/internal/InternalPageHeader";
import { CommercialContact } from "@/components/internal/CommercialContact";

export const metadata: Metadata = {
  title: "SICARÚ para profesionales",
  description: "Productos para estilistas, coloristas y barberos. Consulta disponibilidad, cotizaciones y precios especiales según los productos y condiciones aplicables.",
};

export default function SalonProPage() {
  return <>
    <InternalPageHeader eyebrow="Para profesionales" title="Un aliado para tu trabajo" description="Acompañamos a estilistas, coloristas, barberos y profesionales de la belleza con atención cercana y productos para su actividad." />
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 md:py-16">
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["Consulta disponibilidad", "Cuéntanos qué productos, tonos y presentaciones necesitas para revisar las opciones disponibles."],
          ["Solicita una cotización", "Comparte tu lista y cantidades para conocer una propuesta según tu compra."],
          ["Conoce precios especiales", "Consulta las condiciones aplicables a los productos que buscas. Las opciones se confirman en cada cotización."],
        ].map(([title, text]) => <div key={title} className="rounded-xl border border-[#9b89a8]/25 bg-[#faf8f5] p-6"><h2 className="font-heading text-2xl text-[#2e2b2b]">{title}</h2><p className="mt-4 text-sm leading-7 text-[#2e2b2b]/75">{text}</p></div>)}
      </div>
      <div className="mt-8 rounded-xl bg-[#f5f1eb] p-6 sm:p-8">
        <h2 className="font-heading text-2xl text-[#2e2b2b]">¿Compras productos para tu trabajo?</h2>
        <p className="mt-4 leading-7 text-[#2e2b2b]/75">Escríbenos y consulta nuestras opciones para profesionales.</p>
        <CommercialContact message="Hola, compro productos para mi trabajo. Quisiera consultar disponibilidad, cotizaciones y opciones para profesionales." label="Consultar opciones para profesionales" />
      </div>
      <Link href="/productos" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#7f6d8a] underline underline-offset-4">Explorar el catálogo</Link>
    </section>
  </>;
}
