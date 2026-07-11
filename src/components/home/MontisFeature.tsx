import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flag, Leaf, Recycle, Star } from "lucide-react";

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
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase text-[#8e7a9e]">
            Marca destacada
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-[#2e2b2b] md:text-4xl lg:text-5xl">
            Cuidado capilar con una sensación más natural
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#2e2b2b]/70 md:text-lg">
            Montis suma ingredientes botánicos a rutinas de cabello que buscan
            hidratación, suavidad y brillo sin perder una presentación limpia y
            profesional.
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
