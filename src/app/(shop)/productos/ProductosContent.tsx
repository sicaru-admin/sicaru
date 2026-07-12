"use client";

import { useMemo, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

export function ProductosContent({
  products,
  initialQuery = "",
}: {
  products: HttpTypes.StoreProduct[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
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
          <p className="sicaru-eyebrow">
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
            className="sicaru-input h-12 w-full pl-12 pr-4 text-sm outline-none transition-colors placeholder:text-[#2e2b2b]/40 focus:border-[#7f6d8a]"
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
