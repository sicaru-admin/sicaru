import type { Metadata } from "next";
import Link from "next/link";
import { fantasyPilotProducts } from "@/lib/fantasy-pilot";

export const metadata: Metadata = {
  title: "Uñas profesionales · Vista previa SICARÚ",
  description: "Selección inicial de productos profesionales para uñas en SICARÚ.",
  robots: { index: false, follow: false },
};

export default function PreviewNailsCategory() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] px-5 py-10 text-[#2E2B2B] sm:px-8">
      <div className="mx-auto max-w-[1200px]">
        <Link href="/productos" className="text-sm font-semibold text-[#7F6D8A] underline underline-offset-4">
          Volver al catálogo
        </Link>
        <p className="mt-9 text-xs font-semibold uppercase tracking-[0.18em] text-[#7F6D8A]">
          SICARÚ · Vista previa no publicada
        </p>
        <h1 className="mt-3 font-heading text-4xl font-medium md:text-5xl">
          Uñas profesionales
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#2E2B2B]/75">
          Explora productos profesionales para uñas: geles de color, bases rubber,
          acrílicos, polygel, preparadores y accesorios. La primera selección
          de Fantasy Nails se encuentra en revisión de imágenes, precios
          aplicados y disponibilidad.
        </p>
        <p className="mt-6 text-sm font-semibold text-[#7F6D8A]">
          6 fichas piloto · Disponibilidad por confirmar
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fantasyPilotProducts.map((product) => (
            <Link
              key={product.sku}
              href={`/piloto-fantasy-nails/${product.slug}`}
              className="group flex min-h-[180px] flex-col justify-between border border-[#EFE7DD] bg-white/65 p-5 transition-colors hover:border-[#9B89A8]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7F6D8A]">
                  Fantasy Nails · SKU {product.sku}
                </p>
                <h2 className="mt-3 font-heading text-xl font-medium leading-tight group-hover:text-[#7F6D8A]">
                  {product.title}
                </h2>
              </div>
              <span className="mt-5 text-xs font-semibold text-[#7F6D8A]">
                Ver ficha preliminar
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-xs leading-6 text-[#7F6D8A]">
          Vista de revisión, no catálogo de venta. No sustituye las fichas definitivas
          del gestor Medusa ni confirma existencias.
        </p>
      </div>
    </main>
  );
}
