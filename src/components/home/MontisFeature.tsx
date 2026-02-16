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
        background: "linear-gradient(135deg, #1A3A25 0%, #0E2618 100%)",
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:items-center md:gap-16">
        {/* Left */}
        <div>
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-emerald-300">
            Marca Destacada
          </span>
          <h2 className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            Montis — La Belleza Natural, Hecha en M&eacute;xico
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
            Montis nace de la riqueza botánica mexicana. Cada producto combina
            extractos 100% naturales con tecnología capilar avanzada para
            ofrecerte resultados profesionales sin comprometer la salud de tu
            cabello ni del planeta.
          </p>
          <Link
            href="/marcas/montis"
            className="mt-8 inline-block rounded-full bg-emerald-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-400"
          >
            Descubrir Montis
          </Link>
        </div>

        {/* Right — benefit cards */}
        <div className="grid grid-cols-2 gap-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
            >
              <b.icon className="mb-2 h-7 w-7 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">{b.title}</h3>
              <p className="mt-1 text-xs text-white/60">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
