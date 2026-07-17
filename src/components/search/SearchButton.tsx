"use client";

import { useState, lazy } from "react";
import { Search } from "lucide-react";

const SearchModal = lazy(() =>
  import("./SearchModal").then((mod) => ({ default: mod.SearchModal }))
);

export function SearchButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="sicaru-nav-icon-button"
        aria-label="Buscar"
      >
        <Search className="h-5 w-5" strokeWidth={1.7} />
      </button>
      {isOpen && (
        <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
