/**
 * SICARÚ · Presentación del catálogo.
 *
 * No consulta inventario, no altera datos de Medusa ni asigna fotos a SKUs.
 * Una URL de fotografía es una candidata, no certifica que su contenido sea correcto.
 */
export type ProductPhotoCandidate = {
  thumbnail?: string | null;
  images?: Array<{ url?: string | null }> | null;
};

const isValidPhotoUrl = (value: unknown): value is string =>
  typeof value === "string" && /^(https?:\/\/|\/(?!\/))/.test(value.trim());

/** Mismo orden de origen usado por RetailProductCard: thumbnail o primera imagen. */
export function hasCatalogPhoto(product: ProductPhotoCandidate): boolean {
  return isValidPhotoUrl(product.thumbnail || product.images?.[0]?.url);
}

/** Prioriza únicamente la presentación; nunca elimina fichas o cambia su identidad. */
export function prioritizeProductsWithPhoto<T extends ProductPhotoCandidate>(products: T[]): T[] {
  return products
    .map((product, index) => ({ product, index, hasPhoto: hasCatalogPhoto(product) }))
    .sort((a, b) => Number(b.hasPhoto) - Number(a.hasPhoto) || a.index - b.index)
    .map(({ product }) => product);
}
