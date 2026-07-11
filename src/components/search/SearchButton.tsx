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
        className="flex h-10 w-10 items-center justify-center rounded-[6px] text-[#2e2b2b] transition-colors hover:bg-[#efe7dd] hover:text-[#7f6d8a]"
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
