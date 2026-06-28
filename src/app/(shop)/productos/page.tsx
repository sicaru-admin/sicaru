import type { Metadata } from "next";
import Image from "next/image";
import { ProductosContent } from "./ProductosContent";
import { getProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Nuestros Productos",
  description:
    "Explora nuestro catálogo completo de productos de belleza profesional. Coloración, tratamientos, shampoos y más de las mejores marcas mexicanas.",
};

export const revalidate = 1800;

export default async function ProductosPage() {
  const { products } = await getProducts({ limit: 100 });

  return (
    <>
      <section className="relative overflow-hidden bg-sicaru-purple-700 py-12 text-white">
        <Image
          src="/images/productos-carta-colores-tienda.jpg"
          alt="Carta de colores profesional y productos capilares en exhibición en tienda Sicarú"
          fill
          className="object-cover opacity-15"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-heading text-3xl font-bold md:text-4xl">
            Nuestros Productos
          </h1>
          <p className="mt-3 text-white/80">
            Coloración, tratamientos, shampoos y más de las mejores marcas mexicanas
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <ProductosContent products={products} />
      </div>
    </>
  );
}
