"use client";

import Link from "next/link";
import Image from "next/image";
import { useHits, useStats } from "react-instantsearch";
import { Search } from "lucide-react";

type ProductHit = {
  objectID: string;
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  collection_title: string | null;
  price: number | null;
  currency_code: string | null;
};

function formatPrice(amount: number | null, currency: string | null) {
  if (amount == null) return "Precio no disponible";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency || "MXN",
  }).format(amount);
}

export function SearchResultsGrid() {
  const { hits } = useHits<ProductHit>();
  const { nbHits } = useStats();

  if (hits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Search className="mb-3 h-10 w-10" />
        <p className="text-sm">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">
        {nbHits} producto{nbHits !== 1 ? "s" : ""} encontrado
        {nbHits !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 md:gap-6">
        {hits.map((hit) => (
          <Link
            key={hit.objectID}
            href={`/productos/${hit.handle}`}
            className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              {hit.thumbnail ? (
                <Image
                  src={hit.thumbnail}
                  alt={hit.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              {hit.collection_title && (
                <div className="absolute left-2 top-2">
                  <span className="inline-block rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-sicaru-purple-700 shadow-sm backdrop-blur-sm">
                    {hit.collection_title}
                  </span>
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-sicaru-purple-900 line-clamp-2">
                {hit.title}
              </h3>
              <p className="mt-2 text-sm font-bold text-sicaru-purple-900">
                {formatPrice(hit.price, hit.currency_code)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
