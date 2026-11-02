import type { HttpTypes } from "@medusajs/types";

export const CATALOG_CART_STORAGE_KEY = "sicaru_catalog_cart_v1";
export const CATALOG_CART_VERSION = 1;

export type CatalogCartAddInput = {
  variantId: string;
  productTitle: string;
  variantTitle?: string | null;
  variantSku?: string | null;
  variantOptionValues?: Record<string, string> | null;
  thumbnail?: string | null;
};

export type CatalogCartItem = {
  id: string;
  title: string;
  product_title: string;
  variant_id: string;
  variant_title?: string | null;
  variant_sku?: string | null;
  variant_option_values?: Record<string, string> | null;
  quantity: number;
  unit_price: 0;
  thumbnail?: string | null;
};

export type CatalogCart = {
  id: "local_catalog_cart";
  items: CatalogCartItem[];
  total: 0;
  subtotal: 0;
  item_total: 0;
  item_subtotal: 0;
  shipping_subtotal: 0;
  shipping_total: 0;
  tax_total: 0;
  item_tax_total: 0;
  shipping_tax_total: 0;
  discount_total: 0;
  shipping_methods: [];
};

type PersistedCatalogCart = {
  version: 1;
  items: CatalogCartItem[];
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function positiveQuantity(value: unknown) {
  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
}

function sanitizeOptionValues(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value as Record<string, unknown>)
    .map(([key, raw]) => [clean(key), clean(raw)] as const)
    .filter(([key, option]) => key && option);
  return entries.length ? Object.fromEntries(entries) : null;
}

function sanitizeItem(value: unknown): CatalogCartItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  const variantId = clean(raw.variant_id);
  const productTitle = clean(raw.product_title ?? raw.title);
  if (!variantId || !productTitle) return null;

  return {
    id: `local:${variantId}`,
    title: productTitle,
    product_title: productTitle,
    variant_id: variantId,
    variant_title: clean(raw.variant_title) || null,
    variant_sku: clean(raw.variant_sku) || null,
    variant_option_values: sanitizeOptionValues(raw.variant_option_values),
    quantity: positiveQuantity(raw.quantity),
    unit_price: 0,
    thumbnail: clean(raw.thumbnail) || null,
  };
}

export function createEmptyCatalogCart(): CatalogCart {
  return {
    id: "local_catalog_cart",
    items: [],
    total: 0,
    subtotal: 0,
    item_total: 0,
    item_subtotal: 0,
    shipping_subtotal: 0,
    shipping_total: 0,
    tax_total: 0,
    item_tax_total: 0,
    shipping_tax_total: 0,
    discount_total: 0,
    shipping_methods: [],
  };
}

export function loadCatalogCart(storage: Storage): CatalogCart {
  try {
    const raw = storage.getItem(CATALOG_CART_STORAGE_KEY);
    if (!raw) return createEmptyCatalogCart();
    const parsed = JSON.parse(raw) as Partial<PersistedCatalogCart>;
    if (parsed.version !== CATALOG_CART_VERSION || !Array.isArray(parsed.items)) {
      storage.removeItem(CATALOG_CART_STORAGE_KEY);
      return createEmptyCatalogCart();
    }

    const byVariant = new Map<string, CatalogCartItem>();
    for (const candidate of parsed.items) {
      const item = sanitizeItem(candidate);
      if (!item) continue;
      const existing = byVariant.get(item.variant_id);
      if (existing) existing.quantity += item.quantity;
      else byVariant.set(item.variant_id, item);
    }

    return { ...createEmptyCatalogCart(), items: [...byVariant.values()] };
  } catch {
    storage.removeItem(CATALOG_CART_STORAGE_KEY);
    return createEmptyCatalogCart();
  }
}

export function saveCatalogCart(storage: Storage, cart: CatalogCart) {
  const payload: PersistedCatalogCart = {
    version: CATALOG_CART_VERSION,
    items: cart.items.map((item) => ({ ...item, unit_price: 0 })),
  };
  storage.setItem(CATALOG_CART_STORAGE_KEY, JSON.stringify(payload));
}

export function addCatalogItem(
  cart: CatalogCart,
  input: CatalogCartAddInput,
  quantity = 1
): CatalogCart {
  const variantId = clean(input.variantId);
  const productTitle = clean(input.productTitle);
  if (!variantId || !productTitle) throw new Error("Datos incompletos del producto.");

  const items = cart.items.map((item) => ({ ...item }));
  const existing = items.find((item) => item.variant_id === variantId);
  if (existing) {
    existing.quantity += positiveQuantity(quantity);
  } else {
    items.push({
      id: `local:${variantId}`,
      title: productTitle,
      product_title: productTitle,
      variant_id: variantId,
      variant_title: clean(input.variantTitle) || null,
      variant_sku: clean(input.variantSku) || null,
      variant_option_values: sanitizeOptionValues(input.variantOptionValues),
      quantity: positiveQuantity(quantity),
      unit_price: 0,
      thumbnail: clean(input.thumbnail) || null,
    });
  }
  return { ...createEmptyCatalogCart(), items };
}

export function updateCatalogItem(
  cart: CatalogCart,
  lineItemId: string,
  quantity: number
): CatalogCart {
  const nextQuantity = Number(quantity);
  if (!Number.isInteger(nextQuantity) || nextQuantity < 1) return cart;
  return {
    ...createEmptyCatalogCart(),
    items: cart.items.map((item) =>
      item.id === lineItemId ? { ...item, quantity: nextQuantity } : item
    ),
  };
}

export function removeCatalogItem(cart: CatalogCart, lineItemId: string): CatalogCart {
  return {
    ...createEmptyCatalogCart(),
    items: cart.items.filter((item) => item.id !== lineItemId),
  };
}

export function clearStoredCatalogCart(storage: Storage) {
  storage.removeItem(CATALOG_CART_STORAGE_KEY);
}

export function getCatalogCartAddInput(
  product: Pick<HttpTypes.StoreProduct, "title" | "thumbnail" | "images">,
  variant: Pick<HttpTypes.StoreProductVariant, "id" | "title" | "sku" | "options">
): CatalogCartAddInput {
  const optionValues: Record<string, string> = {};
  for (const option of variant.options ?? []) {
    const title = clean(option.option?.title);
    const value = clean(option.value);
    if (title && value) optionValues[title] = value;
  }

  return {
    variantId: variant.id,
    productTitle: product.title,
    variantTitle: variant.title,
    variantSku: variant.sku,
    variantOptionValues: Object.keys(optionValues).length ? optionValues : null,
    thumbnail: product.thumbnail || product.images?.[0]?.url || null,
  };
}
