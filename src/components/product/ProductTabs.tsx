"use client";

import { useState } from "react";

type Tab = {
  id: string;
  label: string;
  content: string | null;
};

type ProductTabsProps = {
  description: string | null;
  material: string | null;
};

export function ProductTabs({ description, material }: ProductTabsProps) {
  const tabs: Tab[] = [
    {
      id: "descripcion",
      label: "Descripción",
      content: description,
    },
    {
      id: "ingredientes",
      label: "Ingredientes",
      content: material,
    },
  ].filter((tab) => tab.content && tab.content.trim().length > 0);

  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  if (!activeTab) return null;

  return (
    <section aria-label="Información del producto">
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Secciones de información del producto"
        className="flex gap-1 overflow-x-auto border-b border-[#efe7dd]"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === active}
            aria-controls={`product-panel-${tab.id}`}
            id={`product-tab-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={`min-h-11 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8] ${
              tab.id === active
                ? "border-b-2 border-[#7f6d8a] text-[#7f6d8a]"
                : "text-[#9b89a8] hover:text-[#7f6d8a]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        role="tabpanel"
        id={`product-panel-${activeTab.id}`}
        aria-labelledby={`product-tab-${activeTab.id}`}
        className="py-6 text-sm leading-7 text-[#7F6D8A] md:text-base"
      >
        {activeTab.content}
      </div>
    </section>
  );
}
