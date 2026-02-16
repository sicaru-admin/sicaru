import type { Metadata } from "next";
import { ProductosContent } from "./ProductosContent";

export const metadata: Metadata = {
  title: "Nuestros Productos",
  description:
    "Explora nuestro catálogo completo de productos de belleza profesional. Coloración, tratamientos, shampoos y más de las mejores marcas mexicanas.",
};

export const revalidate = 1800;

export default function ProductosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Nuestros Productos
      </h1>
      <ProductosContent />
    </div>
  );
}
