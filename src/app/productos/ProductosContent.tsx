"use client";

import { useState } from "react";
import { InstantSearch, Configure } from "react-instantsearch";
import { searchClient, PRODUCTS_INDEX } from "@/lib/meilisearch";
import { SearchBar } from "@/components/search/SearchBar";
import {
  MobileFilterButton,
  MobileFilterSheet,
  DesktopFilterSidebar,
} from "@/components/search/ProductFilters";
import { SearchResultsGrid } from "@/components/search/SearchResults";

export function ProductosContent() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <InstantSearch searchClient={searchClient} indexName={PRODUCTS_INDEX}>
      <Configure hitsPerPage={40} />

      {/* Search bar + mobile filter button */}
      <div className="mb-6 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <SearchBar />
        </div>
        <MobileFilterButton onClick={() => setMobileFiltersOpen(true)} />
      </div>

      {/* Mobile filter bottom sheet */}
      <MobileFilterSheet
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      />

      {/* Main layout: desktop sidebar + results */}
      <div className="flex gap-8">
        <DesktopFilterSidebar />
        <div className="min-w-0 flex-1">
          <SearchResultsGrid />
        </div>
      </div>
    </InstantSearch>
  );
}
