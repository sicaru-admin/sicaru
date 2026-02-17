import Link from "next/link"
import { BRANDS } from "@/lib/constants/brands"

interface RelatedBrandsProps {
  currentHandle: string
}

export function RelatedBrands({ currentHandle }: RelatedBrandsProps) {
  const otherBrands = Object.values(BRANDS).filter(
    (b) => b.handle !== currentHandle
  )

  return (
    <section className="py-12">
      <h2 className="mb-8 font-heading text-2xl font-bold text-sicaru-purple-900 md:text-3xl">
        También Te Puede Interesar
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {otherBrands.map((brand) => (
          <Link
            key={brand.handle}
            href={`/marcas/${brand.handle}`}
            className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="h-1.5" style={{ backgroundColor: brand.color }} />
            <div className="flex flex-1 flex-col items-center p-4 text-center">
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
                {brand.tagline}
              </p>
              <span className="mt-auto pt-3 text-xs font-semibold text-sicaru-pink transition-colors group-hover:text-sicaru-purple-600">
                Ver Productos &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
