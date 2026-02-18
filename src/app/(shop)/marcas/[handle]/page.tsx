import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { getCollectionByHandle } from "@/lib/data/collections"
import { getProductsByCollection } from "@/lib/data/products"
import { getBrandData, BRANDS } from "@/lib/constants/brands"
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateBrandFAQs,
} from "@/lib/schema"
import { ProductCard } from "@/components/ui/ProductCard"
import { JsonLd } from "@/components/seo/JsonLd"
import { FAQAccordion } from "@/components/ui/FAQAccordion"
import { RelatedBrands } from "@/components/brands/RelatedBrands"

export const revalidate = 1800

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { handle } = await params
    const collection = await getCollectionByHandle(handle)
    const brand = getBrandData(handle)

    if (!collection) {
      return {
        title: "Marca no encontrada — Distribuidora Sicarú",
      }
    }

    const title = `Productos ${brand?.name || collection.title} — Distribuidora Sicarú`
    const description =
      brand?.description ||
      `Compra productos ${collection.title} originales en Distribuidora Sicarú. Envío a todo México. Precios de mayoreo disponibles para profesionales.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
    }
  } catch {
    return { title: "Marca — Distribuidora Sicarú" }
  }
}

export default async function BrandDetailPage({ params }: Props) {
  const { handle } = await params
  const collection = await getCollectionByHandle(handle)

  if (!collection) {
    notFound()
  }

  const { products } = await getProductsByCollection(collection.id)
  const brand = getBrandData(handle)

  const collectionSchema = generateCollectionPageSchema({
    name: brand?.name || collection.title,
    description: brand?.description,
    url: `/marcas/${handle}`,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Marcas", url: "/marcas" },
    { name: brand?.name || collection.title, url: `/marcas/${handle}` },
  ])

  const faqSchema =
    brand?.faqs && brand.faqs.length > 0
      ? generateFAQSchema(brand.faqs)
      : generateFAQSchema(generateBrandFAQs(collection.title))

  const brandName = brand?.name || collection.title

  return (
    <>
      <JsonLd schema={[collectionSchema, breadcrumbSchema, faqSchema]} />

      {/* Brand Hero */}
      <section
        className="w-full text-white"
        style={{
          background: `linear-gradient(135deg, ${brand?.color || "#6B3FA0"}dd 0%, ${brand?.color || "#6B3FA0"}88 100%)`,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 text-center md:py-20">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center justify-center gap-1 text-sm">
            <Link href="/" className="text-white/70 transition hover:text-white">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link
              href="/marcas"
              className="text-white/70 transition hover:text-white"
            >
              Marcas
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="text-white">{brandName}</span>
          </nav>

          {/* Brand Initial Circle */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white">
            {brandName.charAt(0)}
          </div>

          {/* Brand Name */}
          <h1 className="font-heading text-3xl font-bold md:text-5xl">
            {brandName}
          </h1>

          {/* Tagline */}
          {brand?.tagline && (
            <p className="mt-2 text-lg text-white/80">{brand.tagline}</p>
          )}

          {/* Product Count Badge */}
          <span className="mt-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </span>
        </div>
      </section>

      {/* Brand Description */}
      {brand?.description && (
        <section className="mx-auto max-w-7xl px-4 py-10">
          <p className="max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
            {brand.description}
          </p>
        </section>
      )}

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="font-heading text-2xl font-bold text-sicaru-purple-900 md:text-3xl">
            Productos {brandName}
          </h2>
          <span className="text-sm text-gray-500">
            ({products.length}{" "}
            {products.length === 1 ? "producto" : "productos"})
          </span>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
            <p className="text-lg text-gray-500">
              No hay productos disponibles de {brandName} en este momento.
            </p>
            <Link
              href="/marcas"
              className="mt-4 inline-block text-sicaru-purple-600 underline hover:text-sicaru-purple-800"
            >
              Ver todas las marcas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* FAQ Section */}
      {brand?.faqs && brand.faqs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <FAQAccordion
            items={brand.faqs}
            title={`Preguntas Frecuentes sobre ${brandName}`}
          />
        </section>
      )}

      {/* Related Brands */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <RelatedBrands currentHandle={handle} />
      </section>
    </>
  )
}
