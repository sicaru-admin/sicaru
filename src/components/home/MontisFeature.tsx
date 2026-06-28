import Image from "next/image";
import Link from "next/link";
import { Leaf, Flag, Recycle, Star } from "lucide-react";

const benefits = [
  { icon: Leaf, title: "Ingredientes Naturales", text: "Extractos botánicos seleccionados" },
  { icon: Flag, title: "Hecho en México", text: "Producción 100% mexicana" },
  { icon: Recycle, title: "Eco-Consciente", text: "Empaques responsables" },
  { icon: Star, title: "Resultados Reales", text: "Cabello sano y brillante" },
];

export function MontisFeature() {
  return (
    <section
      className="py-16 md:py-20"
      style={{
        background: "#efe7dd",
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:items-center md:gap-16">
        {/* Left */}
        <div>
          <span className="mb-4 inline-block rounded-full bg-[#faf8f5] px-4 py-1 text-sm font-medium text-[#7f6d8a]">
            Marca Destacada
          </span>
          <h2 className="font-heading text-3xl font-bold leading-tight text-[#2e2b2b] md:text-4xl lg:text-5xl">
            Montis — La Belleza Natural, Hecha en M&eacute;xico
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#2e2b2b]/70 md:text-lg">
            Montis nace de la riqueza botánica mexicana. Cada producto combina
            extractos 100% naturales con tecnología capilar avanzada para
            ofrecerte resultados profesionales sin comprometer la salud de tu
            cabello ni del planeta.
          </p>
          <Link
            href="/marcas/montis"
            className="mt-8 inline-block rounded-full bg-[#8e7a9e] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#7f6d8a]"
          >
            Descubrir Montis
          </Link>
        </div>

        {/* Right — image + benefit cards */}
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
            <Image
              src="/images/producto-champu-sabila-natural.jpg"
              alt="Champú artesanal de sábila hecho en México con ingredientes naturales como romero, manzanilla y aloe vera"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-lg border border-[#d8cedc] bg-[#faf8f5] p-4"
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
