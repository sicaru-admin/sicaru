"use client";

import { Search } from "lucide-react";

export function SearchButton() {
  return (
    <button type="button" onClick={() => document.getElementById("storefront-search")?.focus()} className="sicaru-nav-icon-button" aria-label="Buscar">
      <Search className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
    </button>
  );
}
