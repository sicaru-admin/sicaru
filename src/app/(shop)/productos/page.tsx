import type { Metadata } from "next";
import { ProductosContent } from "./ProductosContent";
import { getProducts } from "@/lib/data/products";
import { InternalPageHeader } from "@/components/internal/InternalPageHeader";
import { ProductsHeroComposition } from "@/components/products/ProductsHeroComposition";

const whatsappHref =
  "https://wa.me/528281111023?text=Hola%2C%20quiero%20asesor%C3%ADa%20para%20elegir%20productos%20Sicar%C3%BA";

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
        title="Encuentra el cuidado profesional que tu cabello necesita"
        description="Coloración, reparación, hidratación, herramientas y cuidado capilar seleccionado para estilistas y para quienes buscan resultados profesionales en casa."
        secondaryLine="Selección profesional · Atención personalizada · Compra por WhatsApp"
        primaryAction={{ label: "Explorar productos", href: "#catalogo" }}
        secondaryAction={{ label: "Recibir asesoría", href: whatsappHref }}
        visual={<ProductsHeroComposition />}
      />
      <div className="sicaru-section mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-10">
        <ProductosContent products={products} />
      </div>
    </>
  );
}
