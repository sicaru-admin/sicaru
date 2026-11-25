/**
 * SICARÚ · Fotografías frontales XIOMARA aprobadas visualmente 25/11/2026.
 *
 * El PR se limita a una sustitución de PRESENTACIÓN en frontend; no modifica
 * Medusa, precio, stock, variante, pedido ni galería de imágenes en el backend.
 * No aplicar si la ficha o la fotografía original cambió desde la lectura.
 */
const ownerCrops = [
  {
    id: "prod_01M79C6MFY2YPX504ZMDW9HJ0A",
    handle: "xiomara-shampoo-platinum-250ml",
    barcode: "7501846500905",
    variantTitle: "250 ml",
    current: "/images/products/xiomara-shampoo-platinum-250ml/01-principal.webp",
    approved: "/images/products/xiomara-shampoo-platinum-250ml/01-principal-recorte-propietaria-candidato.webp",
  },
  {
    id: "prod_01M79C7BHA8D7GCZG4DTBM1Q68",
    handle: "xiomara-shampoo-platinum-libre-sulfatos-250ml",
    barcode: "7501846505863",
    variantTitle: "250 ml",
    current: "/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal.webp",
    approved: "/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal-recorte-propietaria-candidato.webp",
  },
] as const;

type CatalogProductIdentity = {
  id?: string | null;
  handle?: string | null;
  variants?: Array<{ title?: string | null; barcode?: string | null }> | null;
};

function matchingPhoto(product: CatalogProductIdentity) {
  const candidate = ownerCrops.find((entry) => entry.id === product.id && entry.handle === product.handle);
  if (!candidate || product.variants?.length !== 1) return null;
  const variant = product.variants[0];
  if (variant.title !== candidate.variantTitle || variant.barcode !== candidate.barcode) return null;
  return candidate;
}

function isExactCurrentFront(url: string, current: string): boolean {
  try {
    const parsed = new URL(url, "https://www.sicarubeauty.com");
    return parsed.origin === "https://www.sicarubeauty.com" &&
      parsed.pathname === current && parsed.search === "" && parsed.hash === "";
  } catch {
    return false;
  }
}

/** Unknown IDs, changed gallery URLs or variants retain their original photo. */
export function getVerifiedCatalogCardPhoto(
  product: CatalogProductIdentity,
  fallback: string | null | undefined,
): string | null | undefined {
  const candidate = matchingPhoto(product);
  if (!candidate || !fallback || !isExactCurrentFront(fallback, candidate.current)) return fallback;
  return candidate.approved;
}

/** Only the approved frontal image changes; existing reverse and IDs are untouched. */
export function getVerifiedCatalogGalleryPhoto(
  product: CatalogProductIdentity,
  originalUrl: string,
): string {
  const candidate = matchingPhoto(product);
  if (!candidate || !isExactCurrentFront(originalUrl, candidate.current)) return originalUrl;
  return candidate.approved;
}
