"use client";

import { HttpTypes } from "@medusajs/types";

type VariantSelectorProps = {
  variants: HttpTypes.StoreProductVariant[];
  selected: HttpTypes.StoreProductVariant;
  onSelect: (variant: HttpTypes.StoreProductVariant) => void;
};

export function VariantSelector({
  variants,
  selected,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length <= 1) return null;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">
        Presentación
      </p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              v.id === selected.id
                ? "border-sicaru-pink bg-sicaru-pink/10 text-sicaru-pink"
                : "border-gray-200 text-gray-700 hover:border-sicaru-purple-300"
            }`}
          >
            {v.title}
          </button>
        ))}
      </div>
    </div>
  );
}
