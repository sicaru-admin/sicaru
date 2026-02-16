"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";

const SearchModal = dynamic(
  () => import("./SearchModal").then((mod) => mod.SearchModal),
  { ssr: false }
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
