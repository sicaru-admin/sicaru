import type { Metadata } from "next"
import Link from "next/link"
import { BRANDS } from "@/lib/constants/brands"
import { InternalPageHeader } from "@/components/internal/InternalPageHeader"
import { BrandDirectoryCard } from "@/components/brands/BrandDirectoryCard"

export const metadata: Metadata = {
  title: "Marcas profesionales — Distribuidora Sicarú",
  description:
    "Explora las marcas disponibles en Sicarú para coloración, cuidado, tratamiento y acabado profesional.",
  openGraph: {
    title: "Marcas profesionales — Distribuidora Sicarú",
    description:
      "Explora las marcas disponibles en Sicarú para coloración, cuidado, tratamiento y acabado profesional.",
  },
}

const BRAND_DESCRIPTIONS: Record<string, string> = {
  kuul: "Coloración, oxidantes y cuidado técnico para rutinas profesionales de salón.",
  voglia: "Líneas para color, tratamiento, barbería y acabado con enfoque profesional.",
  "nekane-capilar":
    "Tratamientos capilares enfocados en hidratación, nutrición y cuidado del cabello.",
  "hidra-color":
    "Opciones de coloración y cuidado para mantener un acabado uniforme.",
  xiomara:
    "Productos de styling, fijación y acabado para distintas necesidades de peinado.",
  vitale:
    "Tratamientos y fórmulas de apoyo para cabello procesado o con necesidad de reparación.",
  montis:
    "Cuidado capilar con una propuesta más natural dentro del catálogo Sicarú.",
}

export default function MarcasPage() {
  const brands = Object.values(BRANDS).map((brand) => ({
    name: brand.name,
    handle: brand.handle,
    description:
      BRAND_DESCRIPTIONS[brand.handle] ||
      "Línea disponible en el catálogo Sicarú para necesidades profesionales de belleza.",
    available: false,
  }))

  return (
    <>
      <InternalPageHeader
        eyebrow="MARCAS SICARÚ"
        title="Marcas profesionales para cada necesidad"
        description="Explora las líneas disponibles en Sicarú y encuentra opciones para coloración, cuidado, tratamiento y acabado profesional."
      />

      <section className="bg-[#faf8f5] py-10 md:py-14 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
          <p className="max-w-2xl text-sm leading-7 text-[#2e2b2b]/70 md:text-base md:leading-8">
            Consulta las marcas disponibles en nuestro catálogo y explora sus
            distintas líneas de productos profesionales.
          </p>

          {brands.length === 0 ? (
            <div className="mt-8 border border-[#efe7dd] bg-[#f5f1eb] p-6 md:p-8">
              <h2 className="font-heading text-2xl font-medium text-[#2e2b2b]">
                No hay marcas disponibles
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#8e7a9e]">
                Consulta el catálogo general para descubrir los productos
                disponibles.
              </p>
              <Link
                href="/productos"
                className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[#7f6d8a] transition-colors hover:text-[#8e7a9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8]"
              >
                Ver todos los productos
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {brands.map((brand) => (
                <BrandDirectoryCard key={brand.handle} brand={brand} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
