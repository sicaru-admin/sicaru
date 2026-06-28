import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { getCategoryByHandle } from "@/lib/data/categories"
import { getProducts } from "@/lib/data/products"
import { ProductCard } from "@/components/ui/ProductCard"
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

  const gradientClasses = categoryData?.gradient
    ? `bg-gradient-to-br ${categoryData.gradient}`
    : "bg-gradient-to-br from-sicaru-purple-700 to-sicaru-purple-500"

  return (
    <>
      <JsonLd schema={[collectionSchema, breadcrumbSchema]} />

      {/* Category Hero */}
      <section className={`${gradientClasses} py-14 text-white`}>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-1 text-sm"
          >
            <Link
              href="/"
              className="text-white/70 transition-colors hover:text-white"
            >
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link
              href="/productos"
              className="text-white/70 transition-colors hover:text-white"
            >
              Productos
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="text-white">{category.name}</span>
          </nav>

          <h1 className="mt-4 font-heading text-3xl font-bold md:text-4xl">
            {category.name}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-lg text-white/80">
            {description}
          </p>

          <span className="mt-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm">
            {products.length} productos
          </span>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-500">
              No hay productos disponibles en esta categoría por el momento.
            </p>
            <Link
              href="/productos"
              className="mt-4 inline-block text-sicaru-purple-600 underline hover:text-sicaru-purple-800"
            >
              Ver todos los productos
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
    </>
  )
}
