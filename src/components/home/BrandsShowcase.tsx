import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BRANDS = [
  {
    name: "Küül",
    description: "Coloración profesional y cuidado técnico para salón.",
    handle: "kuul",
  },
  {
    name: "Voglia",
    description: "Tratamientos, protectores y acabado profesional.",
    handle: "voglia",
  },
  {
    name: "Nekane Capilar",
    description: "Hidratación profunda y reparación para cabello seco.",
    handle: "nekane-capilar",
  },
  {
    name: "Hidra Color",
    description: "Color cremoso y cobertura para resultados pulidos.",
    handle: "hidra-color",
  },
  {
    name: "Xiomara",
    description: "Styling, fijación y control para el acabado diario.",
    handle: "xiomara",
  },
  {
    name: "Vitale",
    description: "Keratina y reconstrucción para cabello procesado.",
    handle: "vitale",
  },
  {
    name: "Montis",
    description: "Cuidado botánico con una sensación más natural.",
    handle: "montis",
  },
];

export function BrandsShowcase() {
  return (
    <section className="bg-[#faf8f5] py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[#8e7a9e]">
              Curaduría Sicarú
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-[#2e2b2b] md:text-4xl">
              Marcas profesionales, seleccionadas con intención
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#2e2b2b]/70">
            No todo entra al catálogo: buscamos productos útiles, vendibles y
            fáciles de recomendar para casa o salón.
          </p>
        </div>

        <div className="grid grid-cols-1 border-y border-[#efe7dd] md:grid-cols-2 xl:grid-cols-7">
          {BRANDS.map((brand) => (
            <Link
              key={brand.handle}
              href={`/marcas/${brand.handle}`}
              className="group border-b border-[#efe7dd] bg-[#faf8f5] p-5 transition-colors hover:bg-[#f5f1eb] md:border-r xl:border-b-0"
            >
              <div className="mb-6 h-px w-10 bg-[#9b89a8]" />
              <h3 className="font-heading text-xl font-semibold text-[#2e2b2b]">
                {brand.name}
              </h3>
              <p className="mt-3 min-h-14 text-sm leading-6 text-[#2e2b2b]/60">
                {brand.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#7f6d8a]">
                Ver marca
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
