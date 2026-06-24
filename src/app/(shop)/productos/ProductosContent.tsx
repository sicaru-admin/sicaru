"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { Search } from "lucide-react";

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
      <label className="relative mb-8 block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sicaru-purple-500" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar productos..."
          className="h-12 w-full rounded-lg border border-sicaru-purple-100 bg-white pl-12 pr-4 text-sm text-sicaru-purple-900 outline-none transition-colors placeholder:text-gray-400 focus:border-sicaru-purple-400"
        />
      </label>

      <p className="mb-5 text-sm text-gray-500">
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
              className="group block overflow-hidden rounded-lg border border-sicaru-purple-100 bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f5f1eb]">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Imagen próximamente
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="line-clamp-2 text-sm font-medium text-sicaru-purple-900">
                  {product.title}
                </h2>
                <p className="mt-2 text-sm font-semibold text-sicaru-purple-800">
                  {formatPrice(product)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
