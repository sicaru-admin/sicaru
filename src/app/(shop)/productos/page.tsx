import type { Metadata } from "next";
import { ProductosContent } from "./ProductosContent";
import { InternalPageHeader } from "@/components/internal/InternalPageHeader";
import { getProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Nuestros Productos",
  description:
    "Explora productos profesionales de belleza seleccionados por Sicarú. Tratamientos, coloración, styling y cuidado capilar con asesoría cercana.",
};

export const revalidate = 1800;

export default async function ProductosPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const query = (typeof q === "string" ? q : "").trim().slice(0, 120);
  let products: Awaited<ReturnType<typeof getProducts>>["products"] = [];
  try {
    const result = await getProducts({ limit: 100 });
    products = result.products;
  } catch {
    // Si Railway no responde, el catálogo mantiene la página en lugar de romperla.
  }

  return (
    <>
      <InternalPageHeader
        eyebrow="CATÁLOGO SICARÚ"
        title="Encuentra tu próximo favorito"
        description="Coloración, tratamientos y herramientas para ti y tu salón."
      />
      <ProductosContent key={query} products={products} initialQuery={query} />
    </>
  );
}
