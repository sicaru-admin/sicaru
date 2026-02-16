import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCollectionByHandle } from "@/lib/data/collections";
import { getProductsByCollection } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateBrandFAQs,
} from "@/lib/schema";

export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return {
      title: "Marca no encontrada",
    };
  }

  return {
    title: collection.title,
    description: `Productos de ${collection.title} en Distribuidora Sicaru`,
  };
}

export default async function MarcaDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    notFound();
  }

  const { products } = await getProductsByCollection(collection.id);

  const collectionSchema = generateCollectionPageSchema({
    name: collection.title,
    description: `Productos de ${collection.title} en Distribuidora Sicarú`,
    url: `/marcas/${handle}`,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Marcas", url: "/marcas" },
    { name: collection.title, url: `/marcas/${handle}` },
  ]);
  const faqSchema = generateFAQSchema(generateBrandFAQs(collection.title));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <JsonLd schema={[collectionSchema, breadcrumbSchema, faqSchema]} />

      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1 text-sm text-gray-500"
      >
        <Link href="/" className="hover:text-sicaru-purple-600">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/marcas" className="hover:text-sicaru-purple-600">
          Marcas
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-sicaru-purple-900 font-medium">
          {collection.title}
        </span>
      </nav>

      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        {collection.title}
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay productos disponibles para esta marca.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
