"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { ArrowRight, ImageIcon, Search } from "lucide-react";

const CATEGORY_LINKS = [
  { label: "Color y tintes", href: "/categorias/color-y-tintes" },
  { label: "Tratamientos", href: "/categorias/tratamientos-y-mascarillas" },
  {
    label: "Shampoo y acondicionador",
    href: "/categorias/shampoo-y-acondicionador",
  },
  { label: "Styling", href: "/categorias/styling-y-acabado" },
  { label: "Herramientas Pro", href: "/categorias/herramientas-pro" },
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

  return (
    <div>
      <div className="mb-8 rounded-[8px] border border-[#efe7dd] bg-[#faf8f5] p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] lg:items-end">
          <div>
            <p className="sicaru-eyebrow">Encuentra lo que buscas</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#2e2b2b]/65">
              Busca por producto, marca o necesidad capilar.
            </p>
          </div>
          <label className="relative block w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7f6d8a]" />
            <input
              type="search"
              aria-label="Buscar productos"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar productos..."
              className="sicaru-input h-11 w-full pl-11 pr-4 text-sm outline-none transition-colors duration-200 placeholder:text-[#2e2b2b]/40 focus:border-[#7f6d8a]"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#efe7dd] pt-4">
          {CATEGORY_LINKS.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="inline-flex min-h-9 items-center rounded-[6px] border border-[#7f6d8a]/20 bg-[#f5f1eb] px-3 text-xs font-medium text-[#7f6d8a] transition-colors duration-200 hover:border-[#7f6d8a]/45 hover:bg-[#efe7dd]"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm text-[#2e2b2b]/60">
          {filteredProducts.length} producto
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
        {query.trim() && (
          <p className="hidden text-xs text-[#7f6d8a] sm:block">
            Resultados para &ldquo;{query.trim()}&rdquo;
          </p>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-[8px] border border-dashed border-[#9b89a8]/45 bg-[#f5f1eb] px-6 py-16 text-center text-sm text-[#2e2b2b]/60">
          No se encontraron productos.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/productos/${product.handle}`}
              className="sicaru-card group block overflow-hidden transition-colors duration-200 hover:border-[#9b89a8]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#efe7dd] p-3">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain object-center p-3 transition-transform duration-200 group-hover:scale-[1.015]"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-[#7f6d8a]/65">
                    <ImageIcon className="h-7 w-7" />
                    <span className="text-center text-[0.68rem] font-medium uppercase tracking-[0.08em]">
                      Imagen próximamente
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3.5 sm:p-4">
                <h2 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#2e2b2b]">
                  {product.title}
                </h2>
                <p className="mt-3 text-sm font-semibold text-[#7f6d8a]">
                  {formatPrice(product)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-[#7f6d8a] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Ver detalle
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
