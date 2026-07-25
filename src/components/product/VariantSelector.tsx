"use client";

import { HttpTypes } from "@medusajs/types";

type StoreOptionValue = {
  id?: string;
  value?: string | null;
};

type StoreOption = {
  id?: string;
  title?: string | null;
  values?: StoreOptionValue[] | null;
};

type VariantOption = {
  option_id?: string | null;
  value?: string | null;
  option?: {
    id?: string | null;
    title?: string | null;
  } | null;
};

type VariantWithOptions = HttpTypes.StoreProductVariant & {
  options?: VariantOption[] | null;
};

export type ProductOptionSelection = Record<string, string>;

export type SelectableProductOption = {
  id: string;
  title: string;
  values: string[];
};

export const VARIANT_TITLE_OPTION_ID = "__variant_title";

type VariantSelectorProps = {
  options: SelectableProductOption[];
  selectedOptions: ProductOptionSelection;
  onSelect: (optionId: string, value: string) => void;
};

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function getSelectableOptions(
  product: HttpTypes.StoreProduct
): SelectableProductOption[] {
  const productOptions = ((product as { options?: StoreOption[] | null })
    .options ?? []) as StoreOption[];

  const optionsFromProduct = productOptions
    .map((option) => {
      const values = uniqueValues(
        (option.values ?? [])
          .map((value) => value.value?.trim() ?? "")
          .filter(Boolean)
      );

      return {
        id: option.id ?? option.title ?? "",
        title: option.title ?? "Opción",
        values,
      };
    })
    .filter((option) => option.id && option.values.length > 1);

  if (optionsFromProduct.length > 0) {
    return optionsFromProduct;
  }

  const optionsById = new Map<
    string,
    { title: string; values: string[] }
  >();

  for (const variant of (product.variants ?? []) as VariantWithOptions[]) {
    for (const option of variant.options ?? []) {
      const optionId = option.option_id ?? option.option?.id ?? "";
      const value = option.value?.trim() ?? "";

      if (!optionId || !value) continue;

      const current = optionsById.get(optionId) ?? {
        title: option.option?.title ?? "Opción",
        values: [],
      };

      current.values.push(value);
      optionsById.set(optionId, current);
    }
  }

  const optionsFromVariants = Array.from(optionsById, ([id, option]) => ({
    id,
    title: option.title,
    values: uniqueValues(option.values),
  })).filter((option) => option.values.length > 1);

  if (optionsFromVariants.length > 0) {
    return optionsFromVariants;
  }

  if ((product.variants ?? []).length > 1) {
    return [
      {
        id: VARIANT_TITLE_OPTION_ID,
        title: "Presentación",
        values: uniqueValues(
          (product.variants ?? [])
            .map((variant) => variant.title?.trim() ?? "")
            .filter(Boolean)
        ),
      },
    ].filter((option) => option.values.length > 1);
  }

  return [];
}

export function VariantSelector({
  options,
  selectedOptions,
  onSelect,
}: VariantSelectorProps) {
  if (options.length === 0) return null;

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id}>
          <p className="mb-2 text-sm font-medium text-[#7f6d8a]">
            {option.title}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.id] === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSelect(option.id, value)}
                  aria-pressed={isSelected}
                  className={`min-h-11 border px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8] ${
                    isSelected
                      ? "border-[#7f6d8a] bg-[#f5f1eb] text-[#7f6d8a] shadow-[inset_0_-3px_0_#7f6d8a]"
                      : "border-[#efe7dd] bg-[#faf8f5] text-[#9b89a8] hover:border-[#9b89a8] hover:text-[#7f6d8a]"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
