"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { ArrowRight, ImageIcon, Search } from "lucide-react";

const categoryLinks = [
  { label: "Color y tintes", href: "/categorias/color-y-tintes" },
  { label: "Tratamientos", href: "/categorias/tratamientos-y-mascarillas" },
  { label: "Herramientas Pro", href: "/categorias/herramientas-pro" },
  { label: "Styling y acabado", href: "/categorias/styling-y-acabado" },
  { label: "Shampoo y acondicionador", href: "/categorias/shampoo-y-acondicionador" },
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
    <div className="space-y-7 md:space-y-8">
      <section className="border-b border-[#efe7dd] pb-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="font-heading text-2xl font-semibold leading-tight text-[#2e2b2b]">
            Explora por categoría
          </h2>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 md:justify-end">
            {categoryLinks.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="shrink-0 rounded-md border border-[#d8cedc] px-3.5 py-2 text-sm font-medium text-[#2e2b2b]/72 transition-[border-color,background-color,color] duration-200 hover:border-[#9b89a8] hover:bg-[#f5f1eb] hover:text-[#2e2b2b] focus:outline-none focus-visible:border-[#7f6d8a] focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.16)]"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="rounded-lg border border-[#efe7dd] bg-[#faf8f5] p-4 sm:p-5 md:flex md:items-end md:justify-between md:gap-8">
        <div className="max-w-xl">
          <h2 className="font-heading text-2xl font-semibold leading-tight text-[#2e2b2b] md:text-[1.65rem]">
            Encuentra lo que buscas
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-[#2e2b2b]/68">
            Busca por producto, marca o necesidad capilar.
          </p>
        </div>
        <label className="relative mt-4 block w-full md:mt-0 md:max-w-md">
          <span className="sr-only">Buscar productos</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#7f6d8a]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar productos..."
            className="sicaru-input h-12 w-full border-[#d8cedc] bg-[#faf8f5] pl-11 pr-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#2e2b2b]/42 focus:border-[#7f6d8a] focus:shadow-[0_0_0_3px_rgba(127,109,138,0.16)]"
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
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/productos/${product.handle}`}
              className="sicaru-card group block overflow-hidden transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#9b89a8] hover:shadow-[0_12px_28px_rgba(46,43,43,0.07)] focus:outline-none focus-visible:border-[#7f6d8a] focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.16)]"
            >
              <div className="relative aspect-square overflow-hidden border-b border-[#efe7dd] bg-[#f5f1eb] p-4 sm:p-5">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain object-center p-4 transition-transform duration-200 group-hover:scale-[1.02] sm:p-5"
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
