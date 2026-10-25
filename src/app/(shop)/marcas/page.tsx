import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getPublishedBrandOptions } from "@/lib/data/brand-navigation"

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Nuestras Marcas — Distribuidora Sicarú",
  description:
    "Explora las marcas con productos publicados en SICARÚ y consulta las opciones disponibles en el catálogo.",
}

export default async function MarcasPage() {
  const { brands, unavailable } = await getPublishedBrandOptions()

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sicaru-purple-700 to-sicaru-purple-500 py-16 text-white md:py-20 overflow-hidden">
        <Image
          src="/images/marcas-colorista-aplicando-tinte.jpg"
          alt="Estilista profesional aplicando tinte de color rojo a clienta en salón de belleza mexicano"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-heading text-3xl font-bold md:text-5xl">
            Nuestras Marcas
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Explora las marcas con productos publicados en nuestro catálogo
          </p>
        </div>
      </section>

      {/* Brand Cards Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brands.length === 0 && <div><p>{unavailable ? "No pudimos consultar las marcas en este momento." : "Por ahora no hay marcas con productos publicados en esta selección."}</p><Link href="/productos" className="mt-4 inline-flex min-h-11 items-center underline">Explorar el catálogo</Link></div>}
          {brands.map((brand) => (
            <Link
              key={brand.handle}
              href={brand.href}
              className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className="h-2"
                style={{ backgroundColor: brand.color }}
              />
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
                    style={{ backgroundColor: brand.color }}
                  >
                    {brand.name.charAt(0)}
                  </div>
                  <h2 className="text-lg font-bold text-sicaru-purple-900">
                    {brand.name}
                  </h2>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                  {brand.description}
                </p>
                <div className="mt-4">
                  <span className="text-sm font-semibold text-sicaru-pink transition-colors group-hover:text-sicaru-purple-600">
                    Ver productos publicados &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
