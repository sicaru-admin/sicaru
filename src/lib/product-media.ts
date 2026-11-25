import type { HttpTypes } from "@medusajs/types";

export type ProductGalleryImage = { id: string; url: string };

// Store's base image type omits this expandable native relation. Validate it
// locally rather than treating an absent relation as an empty association list.
type ImageInput = { id?: unknown; url?: unknown; rank?: unknown; variants?: unknown };
type ClassifiedImage = ProductGalleryImage & { variantIds: string[]; rank: number; index: number };

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

function isVariantLink(value: unknown): value is { id: string } {
  return typeof value === "object" && value !== null && "id" in value && hasText(value.id);
}

function classifiedImages(images: ImageInput[]): ClassifiedImage[] {
  const byId = new Map<string, ClassifiedImage | null>();
  images.forEach((image, index) => {
    if (!hasText(image.id)) return;
    if (!hasText(image.url) || !Array.isArray(image.variants) || !image.variants.every(isVariantLink)) {
      byId.set(image.id, null);
      return;
    }
    const variantIds = [...new Set(image.variants.map((variant) => variant.id))].sort();
    const candidate = {
      id: image.id, url: image.url, variantIds, index,
      rank: typeof image.rank === "number" && Number.isFinite(image.rank)
        ? image.rank : Number.POSITIVE_INFINITY,
    };
    if (!byId.has(image.id)) byId.set(image.id, candidate);
    else {
      const previous = byId.get(image.id);
      if (!previous || previous.url !== candidate.url ||
        JSON.stringify(previous.variantIds) !== JSON.stringify(variantIds)) {
        byId.set(image.id, null);
      }
    }
  });
  return [...byId.values()]
    .filter((image): image is ClassifiedImage => image !== null)
    .sort((a, b) => a.rank === b.rank ? a.index - b.index : a.rank < b.rank ? -1 : 1);
}

/** General images first, then native explicit links for the canonical variant. */
export function getProductMedia(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string | null,
) {
  const variants = product.variants ?? [];
  const candidates = classifiedImages(product.images ?? []);
  const general = candidates.filter((image) => image.variantIds.length === 0);
  const selected = variants.find((variant) => variant.id === selectedVariantId);
  const specific = selected
    ? candidates.filter((image) => image.variantIds.includes(selected.id)) : [];
  return {
    images: [...general, ...specific].map(({ id, url }) => ({ id, url })),
    variantTitle: specific.length ? selected?.title ?? null : null,
    reserveImageSpace: candidates.some((image) => image.variantIds.length > 0),
    reserveThumbnails: general.length > 1 || variants.some((variant) =>
      general.length + candidates.filter((image) => image.variantIds.includes(variant.id)).length > 1,
    ),
  };
}
