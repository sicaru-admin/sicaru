import type { HttpTypes } from "@medusajs/types";

export type ProductGalleryImage = { id: string; url: string };

type ImageInput = { id?: string | null; url?: string | null; rank?: number | null };

const hasUrl = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

function orderedImages(images?: ImageInput[] | null): ProductGalleryImage[] {
  const seen = new Set<string>();
  return (images ?? [])
    .flatMap((image, index) => hasUrl(image.url) ? [{
      id: image.id || image.url,
      url: image.url,
      rank: typeof image.rank === "number" && Number.isFinite(image.rank)
        ? image.rank : Number.POSITIVE_INFINITY,
      index,
    }] : [])
    .sort((a, b) => a.rank === b.rank ? a.index - b.index : a.rank < b.rank ? -1 : 1)
    .filter((image) => {
      if (seen.has(image.url)) return false;
      seen.add(image.url);
      return true;
    })
    .map(({ id, url }) => ({ id, url }));
}

function variantImages(variant: HttpTypes.StoreProductVariant): ProductGalleryImage[] {
  const images = orderedImages(variant.images);
  if (!hasUrl(variant.thumbnail)) return images;
  const thumbnail = images.find((image) => image.url === variant.thumbnail) ?? {
    id: `variant-thumbnail:${variant.id}`, url: variant.thumbnail,
  };
  return [thumbnail, ...images.filter((image) => image.url !== thumbnail.url)];
}

/** Native Medusa associations are specific; only unassociated images are general. */
export function getProductMedia(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string | null,
) {
  const variants = product.variants ?? [];
  const media = variants.map((variant) => ({ variant, images: variantImages(variant) }));
  const reservedIds = new Set(variants.flatMap((variant) =>
    (variant.images ?? []).flatMap((image) => image.id ? [image.id] : []),
  ));
  const reservedUrls = new Set(media.flatMap((item) => item.images.map((image) => image.url)));
  (product.images ?? []).forEach((image) => {
    if (reservedIds.has(image.id) && hasUrl(image.url)) reservedUrls.add(image.url);
  });
  const general = orderedImages(product.images).filter((image) =>
    !reservedIds.has(image.id) && !reservedUrls.has(image.url),
  );
  if (general.length === 0 && hasUrl(product.thumbnail) && !reservedUrls.has(product.thumbnail)) {
    general.push({ id: "general-thumbnail", url: product.thumbnail });
  }

  const selected = media.find((item) => item.variant.id === selectedVariantId);
  const hasOwnImages = !!selected?.images.length;
  return {
    images: hasOwnImages ? selected.images : general,
    variantTitle: hasOwnImages ? selected.variant.title : null,
    reserveImageSpace: media.some((item) => item.images.length > 0),
    reserveThumbnails: general.length > 1 || media.some((item) => item.images.length > 1),
  };
}
