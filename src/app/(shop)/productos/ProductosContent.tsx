"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { ArrowRight, ImageIcon, Search } from "lucide-react";

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
      <div className="mb-8 flex flex-col gap-5 border-b border-[#efe7dd] pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[#8e7a9e]">
            Compra por nombre o necesidad
          </p>
          <p className="mt-2 text-sm leading-6 text-[#2e2b2b]/60">
            Busca marca, tratamiento, coloración, keratina, frizz o cualquier
            producto que tengas en mente.
          </p>
        </div>
        <label className="relative block w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8e7a9e]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar productos..."
            className="h-12 w-full border border-[#d8cedc] bg-[#faf8f5] pl-12 pr-4 text-sm text-[#2e2b2b] outline-none transition-colors placeholder:text-[#2e2b2b]/40 focus:border-[#7f6d8a]"
          />
        </label>
      </div>

      <p className="mb-5 text-sm text-[#2e2b2b]/60">
        {filteredProducts.length} producto
        {filteredProducts.length !== 1 ? "s" : ""}
      </p>

      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-sm text-gray-400">
          No se encontraron productos
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/productos/${product.handle}`}
              className="group block overflow-hidden border border-[#efe7dd] bg-[#faf8f5] transition-colors hover:border-[#9b89a8]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#efe7dd]">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-[#9b89a8]">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-xs font-medium uppercase">
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
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-[#7f6d8a] opacity-0 transition-opacity group-hover:opacity-100">
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
