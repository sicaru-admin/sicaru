import { CATALOG_MODE } from "@/lib/catalog-mode";
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

export default async function ProductosPage() {
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
        title="Productos profesionales para cada necesidad"
        description={CATALOG_MODE ? "Descubre coloración, tratamientos y herramientas en nuestro catálogo digital. Compras y envíos online próximamente." : "Explora coloración, tratamientos, cuidado diario y herramientas seleccionadas para uso en casa o salón."}
      />
      <ProductosContent products={products} />
    </>
  );
}
