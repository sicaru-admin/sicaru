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
    <div className="space-y-8 md:space-y-10">
      <div className="rounded-lg border border-[#efe7dd] bg-[#f5f1eb] p-5 sm:p-6 md:flex md:items-end md:justify-between md:gap-10">
        <div className="max-w-xl">
          <h2 className="font-heading text-2xl font-semibold leading-tight text-[#2e2b2b] md:text-3xl">
            Encuentra lo que buscas
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#2e2b2b]/68">
            Busca por producto, marca o necesidad capilar.
          </p>
        </div>
        <label className="relative mt-5 block w-full md:mt-0 md:max-w-lg">
          <span className="sr-only">Buscar productos</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7f6d8a]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar productos..."
            className="sicaru-input h-[52px] w-full border-[#d8cedc] bg-[#faf8f5] pl-12 pr-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#2e2b2b]/42 focus:border-[#7f6d8a] focus:shadow-[0_0_0_3px_rgba(127,109,138,0.16)]"
          />
        </label>
      </div>

      <div className="flex items-center justify-between border-b border-[#efe7dd] pb-4">
        <p className="text-sm font-medium text-[#2e2b2b]/68">
          {filteredProducts.length} producto
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#d8cedc] bg-[#faf8f5] px-6 py-16 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-[#9b89a8]" />
          <p className="mt-4 text-sm font-medium text-[#2e2b2b]">
            No se encontraron productos
          </p>
          <p className="mt-2 text-sm leading-6 text-[#2e2b2b]/60">
            Intenta buscar con otro producto, marca o necesidad capilar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/productos/${product.handle}`}
              className="sicaru-card group block overflow-hidden transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#9b89a8] hover:shadow-[0_12px_28px_rgba(46,43,43,0.07)] focus:outline-none focus-visible:border-[#7f6d8a] focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.16)]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f5f1eb] p-4 sm:p-5">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain object-center p-4 transition-transform duration-200 group-hover:scale-[1.02] sm:p-5"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-[#9b89a8]">
                    <ImageIcon className="h-8 w-8" />
                    <span className="max-w-28 text-xs font-medium uppercase leading-5 tracking-[0.08em]">
                      Imagen próximamente
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h2 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#2e2b2b]">
                  {product.title}
                </h2>
                <p className="mt-3 text-sm font-semibold text-[#7f6d8a]">
                  {formatPrice(product)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-[#7f6d8a] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
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
