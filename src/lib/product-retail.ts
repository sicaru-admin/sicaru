import type { HttpTypes } from "@medusajs/types";

/** Supplied originals. These records are asset bindings, never catalog products. */
export const VOGLIA_COMBO_ASSETS = [
  { identifier: "KIT-VOGLIA-8601-1036", tone: "1 Negro", src: "/productos/voglia/KIT-VOGLIA-8601-1036.webp" },
  { identifier: "KIT-VOGLIA-8603-1036", tone: "3 Castaño Oscuro", src: "/productos/voglia/KIT-VOGLIA-8603-1036.webp" },
  { identifier: "KIT-VOGLIA-8604-1036", tone: "4 Castaño Medio", src: "/productos/voglia/KIT-VOGLIA-8604-1036.webp" },
] as const;

export const VOGLIA_COMBO_APPROVED_PRICE = { amount: 97, currency: "mxn" } as const;

export function getVogliaComboAsset(identifier?: string | null) {
  return VOGLIA_COMBO_ASSETS.find((asset) => asset.identifier === identifier);
}

/** Match the exact backend SKU only; a matching title, tone or tube is insufficient. */
export function getProductPhoto(product: HttpTypes.StoreProduct, variant?: HttpTypes.StoreProductVariant | null) {
  const selected = variant ?? (product.variants?.length === 1 ? product.variants[0] : null);
  return getVogliaComboAsset(selected?.sku)?.src || product.thumbnail || product.images?.[0]?.url;
}

export function getProductGallery(product: HttpTypes.StoreProduct) {
  const originals = (product.variants ?? []).flatMap((variant) => {
    const asset = getVogliaComboAsset(variant.sku);
    return asset ? [{ id: asset.identifier, url: asset.src, alt: `Combo Voglia tono ${asset.tone}: tinte 90 ml y peróxido 20V 140 ml` }] : [];
  });
  const backendImages = (product.images ?? []).filter((image) => !!image.url).map((image) => ({ id: image.id, url: image.url, alt: product.title || "Producto SICARÚ" }));
  if (!backendImages.length && product.thumbnail) backendImages.push({ id: "thumb", url: product.thumbnail, alt: product.title || "Producto SICARÚ" });
  return [...originals, ...backendImages].filter((image, index, all) => all.findIndex((item) => item.url === image.url) === index);
}

/** Approval is explicit and tied to a SKU; unreviewed calculated prices stay hidden. */
export function getApprovedPrice(product: HttpTypes.StoreProduct, variant?: HttpTypes.StoreProductVariant | null) {
  if (!variant) return null;
  const price = variant.calculated_price;
  const combo = getVogliaComboAsset(variant.sku);
  if (combo) {
    // Do not synthesize a price or replace the amount charged by Medusa.
    if (price?.calculated_amount !== VOGLIA_COMBO_APPROVED_PRICE.amount || price.currency_code?.toLowerCase() !== VOGLIA_COMBO_APPROVED_PRICE.currency) return null;
    return { ...price, calculated_amount: price.calculated_amount };
  }
  const approved = variant.metadata?.storefront_price_approved === true ||
    ((product.variants?.length ?? 0) === 1 && product.metadata?.storefront_price_approved === true);
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
