import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { getCategoryByHandle } from "@/lib/data/categories"
import { getProducts } from "@/lib/data/products"
import { InternalPageHeader } from "@/components/internal/InternalPageHeader"
import { ProductCatalogCard } from "@/components/products/ProductCatalogCard"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema"
import { getCategoryData } from "@/lib/constants/categories"

export const revalidate = 1800

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { handle } = await params
    const category = await getCategoryByHandle(handle)

    if (!category) {
      return {}
    }

    const categoryData = getCategoryData(handle)

    return {
      title: category.name,
      description:
        categoryData?.description ||
        `Productos de la categoría ${category.name} en Distribuidora Sicarú`,
    }
  } catch {
    return { title: "Categoría — Distribuidora Sicarú" }
  }
}

export default async function CategoryPage({ params }: Props) {
  const { handle } = await params
  const category = await getCategoryByHandle(handle)

  if (!category) {
    notFound()
  }

  const { products } = await getProducts({ category_id: [category.id] })
  const categoryData = getCategoryData(handle)

  const collectionSchema = generateCollectionPageSchema({
    name: category.name,
    description:
      categoryData?.description ||
      category.description ||
      `Productos de la categoría ${category.name} en Distribuidora Sicarú`,
    url: `/categorias/${handle}`,
  })
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Productos", url: "/productos" },
    { name: category.name, url: `/categorias/${handle}` },
  ])

  const description =
    categoryData?.description ||
    category.description ||
    `Explora nuestra colección de ${category.name}. Encuentra los mejores productos en Sicarú.`

  return (
    <>
      <JsonLd schema={[collectionSchema, breadcrumbSchema]} />

      <div className="bg-[#f5f1eb] pt-3 md:pt-5">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-1.5 px-5 text-sm text-[#2e2b2b]/60 sm:px-8 lg:px-10"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[#7f6d8a] focus:outline-none focus-visible:text-[#7f6d8a]"
          >
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4 text-[#9b89a8]" aria-hidden="true" />
          <Link
            href="/productos"
            className="transition-colors hover:text-[#7f6d8a] focus:outline-none focus-visible:text-[#7f6d8a]"
          >
            Productos
          </Link>
          <ChevronRight className="h-4 w-4 text-[#9b89a8]" aria-hidden="true" />
          <span className="text-[#2e2b2b]">{category.name}</span>
        </nav>
      </div>

      <div className="[&>section]:py-8 md:[&>section]:py-16 [&_h1]:mt-3 md:[&_h1]:mt-4 [&_p]:mt-3 md:[&_p]:mt-5">
        <InternalPageHeader
          eyebrow="CATEGORÍA SICARÚ"
          title={category.name}
          description={description}
        />
      </div>

      <section className="bg-[#faf8f5] py-7 md:py-12 lg:py-14">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
          <div className="mb-5 border-y border-[#efe7dd] py-4 md:mb-10 md:py-6">
            <p className="text-sm font-medium text-[#2e2b2b]/65" aria-live="polite">
              {products.length} producto{products.length === 1 ? "" : "s"}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="border border-[#efe7dd] bg-[#f5f1eb] px-5 py-14 text-center md:px-8 md:py-16">
              <h2 className="font-heading text-2xl font-medium text-[#2e2b2b] md:text-3xl">
                No hay productos disponibles en esta categoría
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#2e2b2b]/65">
                Puedes explorar el catálogo completo mientras actualizamos esta selección.
              </p>
              <Link
                href="/productos"
                className="mt-6 inline-flex min-h-11 items-center justify-center bg-[#7f6d8a] px-6 py-3 text-sm font-semibold text-[#faf8f5] transition-colors hover:bg-[#8e7a9e] focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.22)]"
              >
                Ver todos los productos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
              {products.map((product) => (
                <ProductCatalogCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
