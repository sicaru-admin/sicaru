import type { Metadata } from "next";
import Image from "next/image";
import { ProductosContent } from "./ProductosContent";
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
      <section className="relative overflow-hidden bg-[#2e2b2b] py-20 text-white md:py-24">
        <Image
          src="/images/productos-carta-colores-tienda.jpg"
          alt="Carta de colores profesional y productos capilares en exhibición en tienda Sicarú"
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2e2b2b]/90 via-[#7f6d8a]/70 to-[#efe7dd]/20" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase text-[#efe7dd]">
            Catálogo Sicarú
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold leading-tight md:text-5xl">
            Productos profesionales para cuidar, tratar y estilizar tu cabello
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
            Explora una selección pensada para uso personal y salón. Si tienes
            dudas, escríbenos y te ayudamos a elegir.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
        <ProductosContent products={products} />
      </div>
    </>
  );
}
