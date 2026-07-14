import type { Metadata } from "next";
import { ProductosContent } from "./ProductosContent";
import { getProducts } from "@/lib/data/products";
import { InternalPageHeader } from "@/components/internal/InternalPageHeader";

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
        title="Productos profesionales para cada necesidad de tu cabello"
        description="Explora coloración, tratamientos, herramientas y cuidado capilar para uso profesional y en casa."
      />
      <div className="sicaru-section mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14">
        <ProductosContent products={products} />
      </div>
    </>
  );
}
