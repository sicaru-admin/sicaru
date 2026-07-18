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
  const { products } = await getProducts({ limit: 100 });

  return (
    <>
      <InternalPageHeader
        eyebrow="CATÁLOGO SICARÚ"
        title="Productos profesionales para cada necesidad"
        description="Explora coloración, tratamientos, cuidado diario y herramientas seleccionadas para uso en casa o salón."
      />
      <ProductosContent products={products} />
    </>
  );
}
