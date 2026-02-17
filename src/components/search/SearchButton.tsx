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
        className="text-gray-700 hover:text-sicaru-purple-600"
        aria-label="Buscar"
      >
        <Search className="h-6 w-6" />
      </button>
      {isOpen && (
        <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
