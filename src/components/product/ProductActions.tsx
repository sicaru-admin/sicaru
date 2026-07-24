"use client";

import { useMemo, useState } from "react";
import { HttpTypes } from "@medusajs/types";
import { MessageCircle, Search, ShieldCheck, BadgeCheck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import {
  getSelectableOptions,
  VariantSelector,
  VARIANT_TITLE_OPTION_ID,
  type ProductOptionSelection,
} from "./VariantSelector";
import { QuantitySelector } from "./QuantitySelector";

type ProductActionsProps = {
  product: HttpTypes.StoreProduct;
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

function getCalculatedAmount(variant: HttpTypes.StoreProductVariant) {
  return variant.calculated_price?.calculated_amount ?? null;
}

function normalizeOptionValue(value?: string | null) {
  return value?.trim().toLocaleLowerCase("es-MX") ?? "";
}

function optionMatches(
  variantOption: VariantOption,
  optionId: string,
  optionTitle: string,
  selectedValue: string
) {
  const variantOptionId =
    variantOption.option_id ?? variantOption.option?.id ?? "";
  const variantOptionTitle = variantOption.option?.title ?? "";

  const matchesOption =
    variantOptionId === optionId ||
    normalizeOptionValue(variantOptionTitle) ===
      normalizeOptionValue(optionTitle);

  return (
    matchesOption &&
    normalizeOptionValue(variantOption.value) ===
      normalizeOptionValue(selectedValue)
  );
}

const WHATSAPP_NUMBER = "528281111023";

const TRUST_ITEMS = [
  { icon: Search, text: "Consulta disponibilidad" },
  { icon: ShieldCheck, text: "Pago seguro" },
  { icon: BadgeCheck, text: "Productos profesionales" },
];

export function ProductActions({ product }: ProductActionsProps) {
  const variants = useMemo(() => product.variants ?? [], [product.variants]);
  const selectableOptions = useMemo(
    () => getSelectableOptions(product),
    [product]
  );
  const requiresVariantSelection =
    variants.length > 1 && selectableOptions.length > 0;
  const [selectedOptions, setSelectedOptions] =
    useState<ProductOptionSelection>({});
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addToCart, isLoading } = useCart();

  const selectedVariant = useMemo(() => {
    if (variants.length === 1 && !requiresVariantSelection) {
      return variants[0];
    }

    if (!requiresVariantSelection) {
      return variants[0] ?? null;
    }

    const allOptionsSelected = selectableOptions.every(
      (option) => selectedOptions[option.id]
    );

    if (!allOptionsSelected) {
      return null;
    }

    return (
      (variants as VariantWithOptions[]).find((variant) => {
        if (selectedOptions[VARIANT_TITLE_OPTION_ID]) {
          return variant.title === selectedOptions[VARIANT_TITLE_OPTION_ID];
        }

        return selectableOptions.every((option) =>
          (variant.options ?? []).some((variantOption) =>
            optionMatches(
              variantOption,
              option.id,
              option.title,
              selectedOptions[option.id]
            )
          )
        );
      }) ?? null
    );
  }, [requiresVariantSelection, selectableOptions, selectedOptions, variants]);

  const lowestPricedVariant = useMemo(
    () =>
      variants.reduce<HttpTypes.StoreProductVariant | null>((lowest, variant) => {
        if (!lowest) return variant;

        const lowestAmount = getCalculatedAmount(lowest);
        const variantAmount = getCalculatedAmount(variant);

        if (lowestAmount == null) return variant;
        if (variantAmount == null) return lowest;

        return variantAmount < lowestAmount ? variant : lowest;
      }, null),
    [variants]
  );

  const displayVariant =
    selectedVariant ??
    (requiresVariantSelection ? lowestPricedVariant : variants[0] ?? null);

  if (!displayVariant) return null;

  const price = displayVariant.calculated_price;
  const formattedPrice = price?.calculated_amount != null
    ? new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: price.currency_code || "MXN",
      }).format(price.calculated_amount)
    : "";

  const whatsappMsg = `Hola! Me interesa el ${product.title} (${formattedPrice}). ¿Tienen disponible?`;
  const selectionMessage = selectableOptions.some((option) =>
    option.title.toLocaleLowerCase("es-MX").includes("tono")
  )
    ? "Selecciona un tono"
    : "Selecciona una opción";
  const canAddToCart = !!selectedVariant && !isLoading;

  const handleAddToCart = async () => {
    setErrorMessage(null);

    if (!selectedVariant?.id) {
      setErrorMessage(selectionMessage);
      return;
    }

    try {
      await addToCart(selectedVariant.id, quantity);
    } catch (error) {
      console.error("Error adding selected variant to cart:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No pudimos agregar el producto al carrito. Intenta de nuevo."
      );
    }
  };

  const handleSelectOption = (optionId: string, value: string) => {
    setErrorMessage(null);
    setSelectedOptions((current) => ({
      ...current,
      [optionId]: value,
    }));
  };

  const hasDiscount =
    price?.original_amount != null &&
    price?.calculated_amount != null &&
    price.original_amount > price.calculated_amount;

  return (
    <div className="space-y-4 md:space-y-5 [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-[#9b89a8]">
      {/* Price */}
      <div>
        <div className="flex items-baseline gap-3">
          <PriceDisplay
            variant={displayVariant}
            className="text-2xl font-semibold text-[#7f6d8a] md:text-3xl"
          />
          {hasDiscount && price?.original_amount != null && (
            <PriceDisplay
              amount={price.original_amount}
              className="text-lg text-[#7f6d8a]/55 line-through"
            />
          )}
        </div>
        <p className="mt-1 text-xs text-[#9b89a8]">IVA incluido</p>
      </div>

      {/* Variant selector */}
      <VariantSelector
        options={selectableOptions}
        selectedOptions={selectedOptions}
        onSelect={handleSelectOption}
      />
      {requiresVariantSelection && !selectedVariant && (
        <p className="text-sm font-medium text-[#7f6d8a]">
          {selectionMessage}
        </p>
      )}
      {errorMessage && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}

      {/* Quantity */}
      <QuantitySelector quantity={quantity} onChange={setQuantity} />

      {/* Action buttons */}
      <div className="space-y-2.5 md:space-y-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className="btn-ripple tap-feedback w-full bg-[#7f6d8a] px-8 py-3.5 text-base font-semibold text-[#faf8f5] transition-colors duration-200 hover:bg-[#8e7a9e] disabled:cursor-not-allowed disabled:opacity-50 md:text-lg"
        >
          {isLoading ? "Agregando..." : "Agregar al Carrito"}
        </button>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 w-full items-center justify-center gap-2 border border-[#7f6d8a] px-8 py-3 text-base font-semibold text-[#7f6d8a] transition-colors duration-200 hover:bg-[#f5f1eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8]"
        >
          <MessageCircle className="h-5 w-5" />
          Preguntar por WhatsApp
        </a>
      </div>

      {/* Trust row */}
      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-[#efe7dd] pt-3 md:justify-start md:gap-4 md:pt-4">
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-1.5 text-xs text-[#9b89a8]"
          >
            <item.icon className="h-4 w-4 text-[#8e7a9e]" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
