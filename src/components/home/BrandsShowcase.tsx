import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BRANDS = [
  {
    name: "Voglia",
    description: "Tratamientos, protectores y acabado profesional.",
    href: "/marcas/voglia",
  },
  {
    name: "Küül",
    description: "Coloración profesional y cuidado técnico para salón.",
    href: "/marcas/kuul",
  },
  {
    name: "Xiomara",
    description: "Styling, fijación y control para el acabado diario.",
    href: "/marcas/xiomara",
  },
  {
    name: "Nekane",
    description: "Hidratación profunda y reparación para cabello seco.",
    href: "/marcas/nekane-capilar",
  },
  {
    name: "Pomania",
    description: "Productos profesionales disponibles en catálogo.",
    href: "/productos?buscar=pomania",
  },
  {
    name: "Passini",
    description: "Líneas para cuidado y trabajo profesional.",
    href: "/productos?buscar=passini",
  },
  {
    name: "Hidra",
    description: "Color cremoso y cobertura para resultados pulidos.",
    href: "/marcas/hidra-color",
  },
  {
    name: "Montis",
    description: "Cuidado botánico con una sensación más natural.",
    href: "/marcas/montis",
  },
];

export function BrandsShowcase() {
  return (
    <section className="bg-[#faf8f5] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="sicaru-eyebrow">06 · Marcas</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-[#2e2b2b] md:text-4xl">
              Marcas profesionales disponibles
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#2e2b2b]/70">
            Una selección pensada para coloración, reparación, cuidado diario y
            trabajo técnico en salón.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#efe7dd] bg-[#efe7dd] sm:grid-cols-2 lg:grid-cols-4">
          {BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="group bg-[#faf8f5] p-5 transition-colors duration-300 hover:bg-[#f5f1eb]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[6px] border border-[#9b89a8]/35 font-heading text-2xl font-semibold text-[#7f6d8a]">
                {brand.name.charAt(0)}
              </div>
              <h3 className="font-heading text-2xl font-semibold text-[#2e2b2b]">
                {brand.name}
              </h3>
              <p className="mt-3 min-h-12 text-sm leading-6 text-[#2e2b2b]/62">
                {brand.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#7f6d8a]">
                Ver productos
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
