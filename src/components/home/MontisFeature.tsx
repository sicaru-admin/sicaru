import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Droplets, Leaf, Sparkles } from "lucide-react";

const benefits = [
  { icon: Droplets, title: "Cuidado capilar", text: "Consulta opciones disponibles" },
  { icon: Sparkles, title: "Rutina de cabello", text: "Productos para cuidado en casa" },
  { icon: BadgeCheck, title: "Uso profesional", text: "Productos para estilistas" },
  { icon: Leaf, title: "Disponibilidad", text: "Consulta por WhatsApp o en tienda" },
];

export function MontisFeature() {
  return (
    <section
      className="py-12 md:py-14"
      style={{
        background: "#efe7dd",
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase text-[#8e7a9e]">
            Marca destacada
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-[#2e2b2b] md:text-4xl lg:text-5xl">
            Cuidado capilar con una sensación más natural
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#2e2b2b]/70 md:text-lg">
            Montis forma parte de los productos disponibles en Sicarú. Consulta
            disponibilidad y recomendaciones por WhatsApp o en tienda.
          </p>
          <Link
            href="/marcas/montis"
            className="mt-8 inline-flex items-center gap-2 bg-[#7f6d8a] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2e2b2b]"
          >
            Ver Montis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/producto-champu-sabila-natural.jpg"
              alt="Producto Montis disponible en Sicarú"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="border border-[#d8cedc] bg-[#faf8f5] p-4"
              >
                <b.icon className="mb-2 h-7 w-7 text-[#8e7a9e]" />
                <h3 className="text-sm font-bold text-[#2e2b2b]">{b.title}</h3>
                <p className="mt-1 text-xs text-[#2e2b2b]/60">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
