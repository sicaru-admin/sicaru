"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  InstantSearch,
  useSearchBox,
  useHits,
} from "react-instantsearch";
import { searchClient, PRODUCTS_INDEX } from "@/lib/meilisearch";
import { Search, X, Clock, ArrowRight } from "lucide-react";

type SearchHit = {
  objectID: string;
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  collection_title: string | null;
  price: number | null;
  currency_code: string | null;
};

function SearchInput({
  onClose,
  onQueryChange,
}: {
  onClose: () => void;
  onQueryChange: (q: string) => void;
}) {
  const { query, refine } = useSearchBox();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center gap-3 border-b px-4 py-3">
      <Search className="h-5 w-5 shrink-0 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          refine(e.target.value);
          onQueryChange(e.target.value);
        }}
        placeholder="Buscar productos..."
        className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
      />
      {query && (
        <button
          onClick={() => {
            refine("");
            onQueryChange("");
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <button
        onClick={onClose}
        className="ml-1 rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
      >
        Esc
      </button>
    </div>
  );
}

function formatPrice(amount: number | null, currency: string | null) {
  if (amount == null) return "Precio no disponible";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency || "MXN",
  }).format(amount);
}

function SearchResults({
  onSelect,
  recentSearches,
  query,
}: {
  onSelect: (handle: string, title: string) => void;
  recentSearches: string[];
  query: string;
}) {
  const { hits } = useHits<SearchHit>();

  if (!query && recentSearches.length > 0) {
    return (
      <div className="p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
          Búsquedas recientes
        </p>
        <ul className="space-y-1">
          {recentSearches.map((search, i) => (
            <li key={i}>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-sicaru-purple-50">
                <Clock className="h-4 w-4 text-gray-400" />
                {search}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Search className="mb-3 h-10 w-10" />
        <p className="text-sm">Escribe para buscar productos</p>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-sm">
          No se encontraron resultados para &ldquo;{query}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <ul className="space-y-1">
        {hits.slice(0, 8).map((hit) => (
          <li key={hit.objectID}>
            <button
              onClick={() => onSelect(hit.handle, hit.title)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-sicaru-purple-50"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                {hit.thumbnail ? (
                  <Image
                    src={hit.thumbnail}
                    alt={hit.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <Search className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {hit.title}
                </p>
                <div className="flex items-center gap-2">
                  {hit.collection_title && (
                    <span className="text-xs text-sicaru-purple-600">
                      {hit.collection_title}
                    </span>
                  )}
                  <span className="text-xs font-medium text-gray-700">
                    {formatPrice(hit.price, hit.currency_code)}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [currentQuery, setCurrentQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSelect = useCallback(
    (handle: string, title: string) => {
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== title);
        return [title, ...filtered].slice(0, 5);
      });
      onClose();
      router.push(`/productos/${handle}`);
    },
    [onClose, router]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh] md:pt-[15vh]">
        <div
          className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <InstantSearch
            searchClient={searchClient}
            indexName={PRODUCTS_INDEX}
          >
            <SearchInput
              onClose={onClose}
              onQueryChange={setCurrentQuery}
            />
            <div className="max-h-[60vh] overflow-y-auto md:max-h-[50vh]">
              <SearchResults
                onSelect={handleSelect}
                recentSearches={recentSearches}
                query={currentQuery}
              />
            </div>
          </InstantSearch>
        </div>
      </div>
    </>
  );
}
