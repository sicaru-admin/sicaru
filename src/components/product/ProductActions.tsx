"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { HttpTypes } from "@medusajs/types";
import { useRouter } from "next/navigation";
import { useProductContact } from "@/components/contact/ContactContext";
import { getCartLineVariantLabel } from "@/components/cart/cart-line-variant";
import { getProductPriceRange } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartProvider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import {
  getSelectableOptions,
  VariantSelector,
  VARIANT_TITLE_OPTION_ID,
  type ProductOptionSelection,
} from "./VariantSelector";
import { QuantitySelector } from "./QuantitySelector";
import { getProductAvailability } from "@/lib/product-availability";

type ProductActionsProps = {
  product: HttpTypes.StoreProduct;
  onVariantChange?: (variant: HttpTypes.StoreProductVariant | null) => void;
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



export function ProductActions({ product, onVariantChange }: ProductActionsProps) {
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
  const { addToCart, buyNow, isLoading } = useCart();
  const router = useRouter();
  const actionLock = useRef(false);
  const [added, setAdded] = useState(false);
  const {setProduct}=useProductContact();

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

  useEffect(() => {
    onVariantChange?.(selectedVariant);
    setProduct({title:product.title??"Producto",variant:getCartLineVariantLabel({variant_title:selectedVariant?.title,variant:selectedVariant}),quantity,
      subtotal:selectedVariant?.calculated_price?.is_calculated_price_tax_inclusive ? (selectedVariant.calculated_price.calculated_amount??0)*quantity : undefined});
    return ()=>setProduct(null);
  },[selectedVariant,quantity,product.title,onVariantChange,setProduct]);
  useEffect(()=>{if(!added)return;const timer=setTimeout(()=>setAdded(false),2500);return()=>clearTimeout(timer);},[added]);
  if (!displayVariant) return <p>Producto no disponible.</p>;
  const price = displayVariant.calculated_price;
  const range=getProductPriceRange(product);
  const selectionMessage = selectableOptions.some((option) =>
    option.title.toLocaleLowerCase("es-MX").includes("tono")
  )
    ? "Selecciona un tono"
    : "Selecciona una opción";
  const hasPrice = selectedVariant?.calculated_price?.calculated_amount != null;
  const availability = getProductAvailability(selectedVariant, quantity);
  const isSoldOut = availability === "out_of_stock";
  const exceedsStock = availability === "insufficient";
  const canAddToCart = !!selectedVariant && hasPrice && !isSoldOut && !exceedsStock && !isLoading;

  const handleAddToCart = async (checkout = false) => {
    if(actionLock.current)return;
    setErrorMessage(null);

    if (!selectedVariant?.id) {
      setErrorMessage(selectionMessage);
      return;
    }

    if (!canAddToCart) return;
    actionLock.current=true;
    try {
      if(checkout){await buyNow(selectedVariant.id, quantity);router.push("/checkout");}
      else {await addToCart(selectedVariant.id, quantity);setAdded(true);}
    } catch (error) {
      console.error("Error adding selected variant to cart:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No pudimos agregar el producto al carrito. Intenta de nuevo."
      );
    } finally { actionLock.current=false; }
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
          {!selectedVariant && range?.varies && <span className="text-sm text-gray-600">Desde</span>}
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
        <p className="mt-1 text-xs text-[#9b89a8]">{price?.is_calculated_price_tax_inclusive ? "IVA incluido" : "IVA se calcula en el carrito"}</p>
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

      {isSoldOut && <p role="status" className="text-sm text-red-700">Agotado</p>}
      {exceedsStock && <p role="status" className="text-sm text-red-700">Reduce la cantidad: solo hay {selectedVariant?.inventory_quantity} disponibles.</p>}
      {/* Quantity */}
      <QuantitySelector quantity={quantity} onChange={setQuantity} />

      {/* Action buttons */}
      <div className="space-y-2.5 md:space-y-3">
        <button
          type="button"
          onClick={() => void handleAddToCart()}
          disabled={!canAddToCart}
          className="btn-ripple tap-feedback w-full bg-[#7f6d8a] px-8 py-3.5 text-base font-semibold text-[#faf8f5] transition-colors duration-200 hover:bg-[#8e7a9e] disabled:cursor-not-allowed disabled:opacity-50 md:text-lg"
        >
          {isLoading ? "Agregando..." : isSoldOut ? "Agotado" : "Agregar al carrito"}
        </button>

        <button type="button" onClick={()=>void handleAddToCart(true)} disabled={!canAddToCart}
          className="w-full min-h-11 rounded-md border border-sicaru-purple-700 px-5 py-3 text-sm font-medium text-sicaru-purple-700 disabled:opacity-50">Comprar ahora</button>
        <p role="status" aria-live="polite" className="text-sm text-green-800">{added ? "Añadido al carrito" : ""}</p>
      </div>

    </div>
  );
}
