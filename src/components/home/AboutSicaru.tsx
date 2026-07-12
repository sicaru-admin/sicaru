import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutSicaru() {
  return (
    <section className="bg-[#f5f1eb] py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative border border-[#d8cedc] bg-[#faf8f5] p-4">
          <div className="absolute -right-5 -top-5 hidden h-24 w-24 border border-[#8e7a9e]/30 md:block" />
          <div className="relative aspect-[4/5] overflow-hidden bg-[#efe7dd]">
            <Image
              src="/images/nosotros-fundadora-sicaru.jpg"
              alt="Sicarú, tienda profesional de productos de belleza"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <p className="sicaru-eyebrow">04 · Quiénes somos</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-[#2e2b2b] md:text-5xl">
            Una tienda profesional, cercana y especializada
          </h2>
          <p className="mt-5 text-base leading-8 text-[#2e2b2b]/72">
            Sicarú nació para acercar productos profesionales de belleza a
            estilistas y clientes que buscan resultados reales. Seleccionamos
            coloración, tratamientos, herramientas y cuidado capilar de marcas
            especializadas, acompañados de atención personalizada para ayudarte
            a elegir mejor.
          </p>
          <p className="mt-4 border-l border-[#7f6d8a]/45 pl-5 font-heading text-2xl leading-snug text-[#7f6d8a]">
            Más que vender productos, queremos ayudarte a encontrar la solución
            adecuada para tu cabello o para tu trabajo profesional.
          </p>
          <Link href="/nosotros" className="sicaru-button-secondary mt-8">
            Conoce Sicarú
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
