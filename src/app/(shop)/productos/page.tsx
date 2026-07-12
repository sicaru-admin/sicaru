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

export default async function ProductosPage({
  searchParams,
}: {
  searchParams?: Promise<{ buscar?: string }>;
}) {
  const { products } = await getProducts({ limit: 100 });
  const params = await searchParams;
  const initialQuery = params?.buscar || "";

  return (
    <>
      <section className="relative overflow-hidden bg-[#f5f1eb] py-14 text-[#2e2b2b] md:py-20">
        <div className="absolute right-0 top-0 hidden h-full w-[34%] bg-[#efe7dd] lg:block" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <p className="sicaru-eyebrow">Catálogo Sicarú</p>
            <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold leading-tight md:text-5xl">
              Productos profesionales para cuidar, tratar y estilizar tu cabello
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#2e2b2b]/70">
              Explora una selección pensada para uso personal y salón. Si tienes
              dudas, escríbenos y te ayudamos a elegir.
            </p>
          </div>
          <div className="relative min-h-64 border border-[#d8cedc] bg-[#faf8f5] p-4">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#efe7dd]">
              <Image
                src="/images/productos-carta-colores-tienda.jpg"
                alt="Carta de colores profesional y productos capilares en exhibición en tienda Sicarú"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 34vw"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="sicaru-section mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
        <ProductosContent products={products} initialQuery={initialQuery} />
      </div>
    </>
  );
}
