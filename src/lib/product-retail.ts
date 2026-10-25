import type { HttpTypes } from "@medusajs/types";

/** Approval is explicit and tied to a SKU; unreviewed calculated prices stay hidden. */
export function getApprovedPrice(product: HttpTypes.StoreProduct, variant?: HttpTypes.StoreProductVariant | null) {
  if (!variant?.id) return null;
  const exactVariant = product.variants?.find(item => item.id === variant.id);
  const approved = exactVariant?.metadata?.storefront_price_approved === true;
  const price = exactVariant?.calculated_price;
  if (!approved || typeof price?.calculated_amount !== "number" || !Number.isFinite(price.calculated_amount) || price.calculated_amount < 0) return null;
  return { ...price, calculated_amount: price.calculated_amount };
}

export function hasKnownAvailability(variant?: HttpTypes.StoreProductVariant | null) {
  return !!variant && (variant.manage_inventory === false || variant.allow_backorder === true ||
    (typeof variant.inventory_quantity === "number" && variant.inventory_quantity > 0));
}

const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es-MX");

export function matchesProductQuery(product: HttpTypes.StoreProduct, query: string) {
  const text = normalize([
    product.title, product.subtitle, product.description, product.handle, product.collection?.title,
    typeof product.metadata?.brand === "string" ? product.metadata.brand : "",
    ...(product.variants ?? []).flatMap((variant) => [variant.title, variant.sku, ...(variant.options ?? []).map((option) => option.value)]),
  ].filter(Boolean).join(" "));
  return normalize(query).trim().split(/\s+/).every((term) => text.includes(term));
}
