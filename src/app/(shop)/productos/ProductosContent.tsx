"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { ArrowRight, ImageIcon, Search } from "lucide-react";

const CATEGORY_LINKS = [
  {
    href: "/categorias/tratamientos-y-mascarillas",
    label: "Tratamientos y mascarillas",
  },
  {
    href: "/categorias/color-y-tintes",
    label: "Color y tintes",
  },
  {
    href: "/categorias/styling-y-acabado",
    label: "Styling y acabado",
  },
  {
    href: "/categorias/herramientas-pro",
    label: "Herramientas profesionales",
  },
  {
    href: "/categorias/shampoo-y-acondicionador",
    label: "Shampoo y acondicionador",
  },
];

function formatPrice(product: HttpTypes.StoreProduct) {
  const price = product.variants?.[0]?.calculated_price;

  if (price?.calculated_amount == null) return "Precio no disponible";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: price.currency_code || "MXN",
  }).format(price.calculated_amount);
}

export function ProductosContent({
  products,
}: {
  products: HttpTypes.StoreProduct[];
}) {
  const [query, setQuery] = useState("");
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es-MX");

    if (!normalizedQuery) return products;

    return products.filter((product) =>
      [product.title, product.description, product.handle]
        .filter(Boolean)
        .some((value) =>
          value!.toLocaleLowerCase("es-MX").includes(normalizedQuery)
        )
    );
  }, [products, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <section className="bg-[#faf8f5] py-10 md:py-12 lg:py-14">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <nav aria-label="Categorías de productos" className="mb-10 md:mb-12">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8e7a9e]">
                Explora por categoría
              </p>
              <h2 className="mt-2 font-heading text-2xl font-medium text-[#2e2b2b] md:text-3xl">
                Encuentra el tipo de producto que necesitas
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 border-y border-[#efe7dd] min-[360px]:grid-cols-2 lg:grid-cols-5">
            {CATEGORY_LINKS.map((category, index) => (
              <Link
                key={category.href}
                href={category.href}
                className="group flex min-h-[76px] flex-col justify-between border-b border-[#efe7dd] px-4 py-4 text-left transition-colors duration-[200ms] hover:bg-[#f5f1eb] focus:outline-none focus-visible:bg-[#f5f1eb] focus-visible:shadow-[inset_0_-3px_0_#7f6d8a] min-[360px]:border-r lg:border-b-0"
              >
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#9b89a8]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-2 text-sm font-semibold leading-5 text-[#2e2b2b] transition-colors group-hover:text-[#7f6d8a]">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="mb-8 border-y border-[#efe7dd] py-6 md:mb-10 md:py-7">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.48fr)] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8e7a9e]">
                Catálogo completo
              </p>
              <h2 className="mt-2 font-heading text-2xl font-medium text-[#2e2b2b] md:text-3xl">
                Busca por producto, marca o necesidad
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#2e2b2b]/65">
                Conserva una búsqueda simple para encontrar tratamientos,
                coloración, keratina, frizz o herramientas profesionales.
              </p>
            </div>

            <div className="w-full">
              <label
                htmlFor="productos-search"
                className="mb-2 block text-sm font-semibold text-[#2e2b2b]"
              >
                Buscar en productos
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8e7a9e]" />
                <input
                  id="productos-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por producto, marca o necesidad"
                  className="sicaru-input h-12 w-full pl-12 pr-4 text-sm outline-none transition-colors placeholder:text-[#2e2b2b]/40 focus:border-[#7f6d8a] focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.16)]"
                />
              </div>
            </div>
          </div>

          <p
            className="mt-5 text-sm font-medium text-[#2e2b2b]/65"
            aria-live="polite"
          >
            {filteredProducts.length} producto
            {filteredProducts.length !== 1 ? "s" : ""}
            {hasQuery ? " encontrado" : " disponible"}
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="border border-[#efe7dd] bg-[#f5f1eb] px-5 py-14 text-center md:px-8 md:py-16">
            <h2 className="font-heading text-2xl font-medium text-[#2e2b2b] md:text-3xl">
              No encontramos productos con esa búsqueda
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#2e2b2b]/65">
              Prueba con otra palabra o explora una de nuestras categorías.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-6 inline-flex min-h-11 items-center justify-center bg-[#7f6d8a] px-6 py-3 text-sm font-semibold text-[#faf8f5] transition-colors hover:bg-[#8e7a9e] focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.22)]"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/productos/${product.handle}`}
                className="sicaru-card group block overflow-hidden transition-colors duration-[200ms] hover:border-[#9b89a8] focus:outline-none focus-visible:border-[#7f6d8a] focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.16)]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#f5f1eb]">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      sizes="(max-width: 360px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-[220ms] group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-[#9b89a8]">
                      <ImageIcon className="h-6 w-6" strokeWidth={1.4} />
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em]">
                        Imagen próximamente
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#2e2b2b]">
                    {product.title}
                  </h2>
                  <p className="mt-3 text-sm font-semibold text-[#7f6d8a]">
                    {formatPrice(product)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-[#7f6d8a] opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                    Ver detalle
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
