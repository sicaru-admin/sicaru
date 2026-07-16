"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { ArrowRight, ImageIcon, Search } from "lucide-react";
import { ProductsAdviceBlock } from "@/components/products/ProductsAdviceBlock";
import { ProductsCatalogToolbar } from "@/components/products/ProductsCatalogToolbar";
import { ProductsNeedExplorer } from "@/components/products/ProductsNeedExplorer";

function formatPrice(product: HttpTypes.StoreProduct) {
  const price = product.variants?.[0]?.calculated_price;

  if (price?.calculated_amount == null) return "Precio no disponible";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: price.currency_code || "MXN",
  }).format(price.calculated_amount);
}

function getPresentation(product: HttpTypes.StoreProduct) {
  const variantTitle = product.variants?.[0]?.title;

  if (!variantTitle || variantTitle.toLowerCase() === "default variant") {
    return null;
  }

  return variantTitle;
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
      <ProductsNeedExplorer />

      <section id="catalogo" className="scroll-mt-24 space-y-6">
        <div className="grid gap-5 border-b border-[#efe7dd] pb-6 md:grid-cols-[minmax(0,0.62fr)_minmax(320px,0.88fr)] md:items-end md:gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7f6d8a]">
              Catálogo
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold leading-tight text-[#2e2b2b] md:text-4xl">
              Busca por producto, marca o necesidad
            </h2>
          </div>
          <label className="relative block w-full">
            <span className="sr-only">Buscar productos</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#7f6d8a]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej. matizador, keratina, protector térmico…"
              className="sicaru-input h-14 w-full border-[#d8cedc] bg-[#faf8f5] pl-12 pr-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#2e2b2b]/42 focus:border-[#7f6d8a] focus:shadow-[0_0_0_3px_rgba(127,109,138,0.16)]"
            />
          </label>
        </div>

        <ProductsCatalogToolbar count={filteredProducts.length} />

        {filteredProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#d8cedc] bg-[#faf8f5] px-6 py-14 text-center">
            <ImageIcon className="mx-auto h-7 w-7 text-[#9b89a8]" />
            <p className="mt-4 text-sm font-medium text-[#2e2b2b]">
              No se encontraron productos
            </p>
            <p className="mt-2 text-sm leading-6 text-[#2e2b2b]/60">
              Intenta buscar con otro producto, marca o necesidad capilar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-7 min-[420px]:grid-cols-2 sm:gap-x-5 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const brand = product.collection?.title;
              const presentation = getPresentation(product);

              return (
                <Link
                  key={product.id}
                  href={`/productos/${product.handle}`}
                  className="sicaru-card group block overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-[#9b89a8] hover:shadow-[0_10px_24px_rgba(46,43,43,0.06)] focus:outline-none focus-visible:border-[#7f6d8a] focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.16)]"
                >
                  <div className="relative aspect-square overflow-hidden border-b border-[#efe7dd] bg-[#faf8f5] p-5">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain object-center p-5 transition-transform duration-200 group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[#9b89a8]">
                        <ImageIcon className="h-6 w-6" />
                        <span className="max-w-24 text-[0.65rem] font-medium uppercase leading-4 tracking-[0.08em] text-[#7f6d8a]/72">
                          Imagen próximamente
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {brand ? (
                      <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#7f6d8a]">
                        {brand}
                      </p>
                    ) : null}
                    <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#2e2b2b]">
                      {product.title}
                    </h3>
                    {presentation ? (
                      <p className="mt-2 line-clamp-1 text-xs text-[#2e2b2b]/54">
                        {presentation}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm font-semibold text-[#7f6d8a]">
                      {formatPrice(product)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-[#7f6d8a] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                      Ver producto
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <ProductsAdviceBlock />
    </div>
  );
}
