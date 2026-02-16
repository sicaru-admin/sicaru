"use client";

import { useState } from "react";
import {
  useRefinementList,
  useRange,
  useSortBy,
} from "react-instantsearch";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { PRODUCTS_INDEX } from "@/lib/meilisearch";

function CollectionFilter() {
  const { items, refine } = useRefinementList({
    attribute: "collection_title",
    sortBy: ["name:asc"],
  });
  const [expanded, setExpanded] = useState(true);

  if (items.length === 0) return null;

  return (
    <FilterSection
      title="Marca"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.value}>
            <button
              onClick={() => refine(item.value)}
              className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                item.isRefined
                  ? "bg-sicaru-purple-100 font-medium text-sicaru-purple-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="truncate">{item.label}</span>
              <span className="ml-2 shrink-0 text-xs text-gray-400">
                {item.count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </FilterSection>
  );
}

function CategoryFilter() {
  const { items, refine } = useRefinementList({
    attribute: "categories",
    sortBy: ["name:asc"],
  });
  const [expanded, setExpanded] = useState(true);

  if (items.length === 0) return null;

  return (
    <FilterSection
      title="Categoría"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.value}>
            <button
              onClick={() => refine(item.value)}
              className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                item.isRefined
                  ? "bg-sicaru-purple-100 font-medium text-sicaru-purple-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="truncate">{item.label}</span>
              <span className="ml-2 shrink-0 text-xs text-gray-400">
                {item.count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </FilterSection>
  );
}

function PriceRangeFilter() {
  const { range, start, refine } = useRange({ attribute: "price" });
  const [expanded, setExpanded] = useState(true);

  const min = range.min ?? 0;
  const max = range.max ?? 10000;
  const currentMin =
    start[0] !== -Infinity && start[0] != null ? start[0] : min;
  const currentMax =
    start[1] !== Infinity && start[1] != null ? start[1] : max;

  return (
    <FilterSection
      title="Rango de precio"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <div className="space-y-3 px-1">
        <input
          type="range"
          min={min}
          max={max}
          value={currentMax}
          onChange={(e) => refine([currentMin, Number(e.target.value)])}
          className="w-full accent-sicaru-purple-600"
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              maximumFractionDigits: 0,
            }).format(currentMin)}
          </span>
          <span>
            {new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              maximumFractionDigits: 0,
            }).format(currentMax)}
          </span>
        </div>
      </div>
    </FilterSection>
  );
}

function SortBySelect() {
  const { currentRefinement, options, refine } = useSortBy({
    items: [
      { value: PRODUCTS_INDEX, label: "Relevancia" },
      { value: `${PRODUCTS_INDEX}:price:asc`, label: "Precio: menor a mayor" },
      {
        value: `${PRODUCTS_INDEX}:price:desc`,
        label: "Precio: mayor a menor",
      },
      {
        value: `${PRODUCTS_INDEX}:created_at:desc`,
        label: "Más recientes",
      },
    ],
  });

  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400">
        Ordenar por
      </label>
      <select
        value={currentRefinement}
        onChange={(e) => refine(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-sicaru-purple-300"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FilterSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        onClick={onToggle}
        className="mb-2 flex w-full items-center justify-between text-sm font-semibold text-gray-800"
      >
        {title}
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {expanded && children}
    </div>
  );
}

/** Shared filter content used in both mobile sheet and desktop sidebar */
function FilterContent() {
  return (
    <div className="space-y-4">
      <SortBySelect />
      <CollectionFilter />
      <CategoryFilter />
      <PriceRangeFilter />
    </div>
  );
}

/** Mobile filter trigger button — place inline next to SearchBar */
export function MobileFilterButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
    >
      <SlidersHorizontal className="h-4 w-4" />
      Filtros
    </button>
  );
}

/** Mobile bottom sheet overlay */
export function MobileFilterSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl lg:hidden">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <FilterContent />
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-sicaru-purple-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-sicaru-purple-700"
        >
          Ver resultados
        </button>
      </div>
    </>
  );
}

/** Desktop sidebar filters */
export function DesktopFilterSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24 space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <FilterContent />
      </div>
    </aside>
  );
}
