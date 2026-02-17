import Link from "next/link";

const BRANDS = [
  {
    name: "Küül",
    color: "#E8351E",
    description: "Líder mexicano en coloración profesional — Henkel",
    handle: "kuul",
  },
  {
    name: "Voglia",
    color: "#8B5CF6",
    description: "Tintes y línea de barbería desde León, GTO",
    handle: "voglia",
  },
  {
    name: "Nekane Capilar",
    color: "#EC4899",
    description: "Tratamientos capilares de hidratación profunda",
    handle: "nekane-capilar",
  },
  {
    name: "Hidra Color",
    color: "#3B82F6",
    description: "Sistema de coloración cremosa profesional",
    handle: "hidra-color",
  },
  {
    name: "Xiomara",
    color: "#F59E0B",
    description: "Styling y fijación profesional",
    handle: "xiomara",
  },
  {
    name: "Vitale",
    color: "#10B981",
    description: "Keratina y tratamientos de reconstrucción",
    handle: "vitale",
  },
  {
    name: "Montis",
    color: "#166534",
    description: "Marca mexicana con extractos 100% naturales",
    handle: "montis",
  },
];

export function BrandsShowcase() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
          Nuestras Marcas
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
          {BRANDS.map((brand) => (
            <Link
              key={brand.handle}
              href={`/marcas/${brand.handle}`}
              className="card-tilt group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Accent bar */}
              <div
                className="h-1.5"
                style={{ backgroundColor: brand.color }}
              />

              <div className="flex flex-1 flex-col items-center p-4 text-center">
                {/* Initial circle */}
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: brand.color }}
                >
                  {brand.name[0]}
                </div>

                <h3 className="text-sm font-bold text-sicaru-purple-900">
                  {brand.name}
                </h3>
                <p className="mt-1 text-xs leading-snug text-gray-500">
                  {brand.description}
                </p>

                <span className="mt-auto pt-3 text-xs font-semibold text-sicaru-pink transition-colors group-hover:text-sicaru-purple-600">
                  Ver Productos &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
