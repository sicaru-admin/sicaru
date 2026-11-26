import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

const previewOnly = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development";
const image = "/images/products/kuul-cure-me-reconstructor-1kg/cure-me-1kg-preview-400.webp";

export const metadata: Metadata = {
  title: "Revisión KÜÜL Cure Me 1 kg | SICARÚ",
  robots: { index: false, follow: false },
};

export default function CureMeOneKgPhotoReview() {
  if (!previewOnly) notFound();

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-10 text-[#2E2B2B] sm:px-8">
      <div className="mx-auto max-w-4xl space-y-7">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#7F6D8A]">SICARÚ · Revisión privada de producto</p>
        <h1 className="font-heading text-3xl md:text-5xl">KÜÜL Cure Me Reconstructor System · 1 kg</h1>
        <p className="max-w-2xl text-sm leading-6">Vista previa editorial de identificación y fotografía aportada por Dirección. No es una ficha publicada ni una actualización de Medusa. El archivo optimizado a 400 × 300 px es temporal para revisión; conservar el original para el arte final.</p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#efe7dd] bg-[#F5F1EB]">
            <Image src={image} alt="Envase verde KÜÜL Reconstructor System Cure Me, 1 kg, fotografía aportada por SICARÚ" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" priority />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7F6D8A]">Identidad propuesta</p>
            <h2 className="text-2xl font-semibold">KÜÜL Cure Me Reconstructor System 1 kg</h2>
            <p>Tratamiento reconstructor para cabello maltratado o químicamente procesado. Presentación de 1 kg, según etiqueta de la fotografía.</p>
            <p className="text-sm">Precio y existencia: por confirmar. Código proveedor reciente documentado: 7501438306731; pendiente de validar contra el EAN del envase.</p>
            <a className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#7F6D8A] px-6 py-3 text-sm font-semibold text-[#7F6D8A]" href="https://wa.me/528281136652?text=Hola%2C%20quisiera%20consultar%20K%C3%9C%C3%9CL%20Cure%20Me%20Reconstructor%20System%201%20kg.%20%C2%BFMe%20confirman%20precio%20y%20disponibilidad%3F" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
          </div>
        </div>
        <div className="rounded-lg border border-[#efe7dd] p-5 text-sm leading-6">
          <h2 className="mb-2 font-semibold">Correcciones pendientes antes de publicación</h2>
          <p>La ficha pública actual todavía dice «Reconstructor 1L» y usa SKU técnico «KUUL-CURE-1L». No modificar ni reutilizar ese SKU sin conciliación administrativa. La mascarilla 1 kg no es el shampoo 1 L ni el leave-in.</p>
        </div>
      </div>
    </main>
  );
}
