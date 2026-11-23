/**
 * SICARÚ · sustituciones fotográficas verificadas para Vista Preview.
 *
 * No modifica Medusa ni inventario, precios, contenido, variantes o checkout.
 * Requiere ID y handle exactos; para XIOMARA confirma EAN Store API + Base Maestra.
 * Montis queda excluido: su variante Medusa es 500ml, mientras la foto es 650ml.
 */
const catalogPhotoMatches = [
  {
    id: "prod_01M79C6MFY2YPX504ZMDW9HJ0A",
    handle: "xiomara-shampoo-platinum-250ml",
    barcode: "7501846500905",
    variantTitle: "250 ml",
    image: "/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp",
  },
  {
    id: "prod_01M79C7BHA8D7GCZG4DTBM1Q68",
    handle: "xiomara-shampoo-platinum-libre-sulfatos-250ml",
    barcode: "7501846505863",
    variantTitle: "250 ml",
    image: "/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal-r3.webp",
  },
  {
    id: "prod_01M79C817D78WYM8K6D9W32NH1",
    handle: "nekane-morazul-shampoo-matizador-300g",
    variantTitle: "300 g",
    image: "/images/products/nekane-morazul-shampoo-matizador-300g/01-principal-r3.webp",
  },
] as const;

type CatalogProductIdentity = {
  id?: string | null;
  handle?: string | null;
  variants?: Array<{ title?: string | null; barcode?: string | null }> | null;
};

/** Return the original image if any identity field disagrees. */
export function getVerifiedCatalogCardPhoto(
  product: CatalogProductIdentity,
  fallback: string | null | undefined,
): string | null | undefined {
  const candidate = catalogPhotoMatches.find(
    (item) => item.id === product.id && item.handle === product.handle,
  );
  if (!candidate) return fallback;
  const variants = product.variants ?? [];
  if (variants.length !== 1) return fallback;
  const variant = variants[0];
  if (variant.title !== candidate.variantTitle) return fallback;
  if ("barcode" in candidate && variant.barcode !== candidate.barcode) return fallback;
  return candidate.image;
}

/**
 * Map known original gallery filenames to their R3 photographs without changing
 * their image IDs or variant associations. Any unrecognized image is preserved.
 */
export function getVerifiedCatalogGalleryPhoto(
  product: CatalogProductIdentity,
  originalUrl: string,
): string {
  const candidate = catalogPhotoMatches.find(
    (item) => item.id === product.id && item.handle === product.handle,
  );
  if (!candidate || getVerifiedCatalogCardPhoto(product, null) !== candidate.image) return originalUrl;
  let current: URL;
  try { current = new URL(originalUrl, "https://www.sicarubeauty.com"); }
  catch { return originalUrl; }
  if (current.origin !== "https://www.sicarubeauty.com" || current.search || current.hash) return originalUrl;
  const originalFront = candidate.image.replace("-r3.webp", ".webp");
  if (current.pathname === originalFront) return candidate.image;
  const back = candidate.image.replace("/01-principal-r3.webp", "/02-reverso-r3.webp");
  if (current.pathname === back.replace("-r3.webp", ".webp") && candidate.handle !== "xiomara-shampoo-platinum-250ml") return back;
  return originalUrl;
}
