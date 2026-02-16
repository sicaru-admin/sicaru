import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCategoryByHandle } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";

export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const category = await getCategoryByHandle(handle);

  if (!category) {
    return {
      title: "Categoria no encontrada",
    };
  }

  return {
    title: category.name,
    description: `Productos de la categoria ${category.name} en Distribuidora Sicaru`,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const category = await getCategoryByHandle(handle);

  if (!category) {
    notFound();
  }

  const { products } = await getProducts({
    category_id: [category.id],
  });

  const collectionSchema = generateCollectionPageSchema({
    name: category.name,
    description:
      category.description ||
      `Productos de la categoría ${category.name} en Distribuidora Sicarú`,
    url: `/categorias/${handle}`,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Productos", url: "/productos" },
    { name: category.name, url: `/categorias/${handle}` },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <JsonLd schema={[collectionSchema, breadcrumbSchema]} />

      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1 text-sm text-gray-500"
      >
        <Link href="/" className="hover:text-sicaru-purple-600">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/productos" className="hover:text-sicaru-purple-600">
          Productos
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-sicaru-purple-900 font-medium">
          {category.name}
        </span>
      </nav>

      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        {category.name}
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay productos disponibles en esta categoria.
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
