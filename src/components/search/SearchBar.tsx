"use client";

import { useSearchBox, useCurrentRefinements } from "react-instantsearch";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const { query, refine } = useSearchBox();
  const { items, refine: removeRefinement } = useCurrentRefinements();

  const allRefinements = items.flatMap((item) =>
    item.refinements.map((refinement) => ({
      ...refinement,
      indexName: item.indexName,
      indexId: item.indexId,
      attribute: item.attribute,
      refine: () => removeRefinement(refinement),
    }))
  );

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow focus-within:border-sicaru-purple-300 focus-within:shadow-md">
        <Search className="h-5 w-5 shrink-0 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => refine(e.target.value)}
          placeholder="Buscar productos..."
          className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={() => refine("")}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {allRefinements.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allRefinements.map((refinement, i) => (
            <button
              key={`${refinement.attribute}-${refinement.label}-${i}`}
              onClick={refinement.refine}
              className="inline-flex items-center gap-1 rounded-full bg-sicaru-purple-100 px-3 py-1 text-xs font-medium text-sicaru-purple-700 transition-colors hover:bg-sicaru-purple-200"
            >
              {refinement.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={() => {
              items.forEach((item) => {
                item.refinements.forEach((ref) => removeRefinement(ref));
              });
              refine("");
            }}
            className="text-xs text-gray-500 underline hover:text-gray-700"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
}
