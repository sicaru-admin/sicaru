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
      <p className="mb-2 text-sm font-medium text-[#7f6d8a]">
        Presentación
      </p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSelected = v.id === selected.id;

          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v)}
              aria-pressed={isSelected}
              className={`min-h-11 border px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8] ${
                isSelected
                  ? "border-[#7f6d8a] bg-[#f5f1eb] text-[#7f6d8a] shadow-[inset_0_-3px_0_#7f6d8a]"
                  : "border-[#efe7dd] bg-[#faf8f5] text-[#9b89a8] hover:border-[#9b89a8] hover:text-[#7f6d8a]"
              }`}
            >
              {v.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
