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
    {
      id: "como-usar",
      label: "Cómo Usar",
      content:
        "Consulta las instrucciones de uso en el empaque del producto. Para mejores resultados, sigue las recomendaciones del fabricante.",
    },
    {
      id: "resenas",
      label: "Reseñas",
      content:
        "Las reseñas de clientes estarán disponibles próximamente. ¡Sé el primero en dejar tu opinión!",
    },
  ];

  const [active, setActive] = useState(tabs[0].id);
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
              tab.id === active
                ? "border-b-2 border-sicaru-pink text-sicaru-pink"
                : "text-gray-500 hover:text-sicaru-purple-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="py-6 text-sm leading-relaxed text-gray-600">
        {activeTab.content || "Información no disponible para este producto."}
      </div>
    </div>
  );
}
