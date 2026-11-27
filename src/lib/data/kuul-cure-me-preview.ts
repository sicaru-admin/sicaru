import type { HttpTypes } from "@medusajs/types";
import { CURE_ME } from "@/lib/kuul-cure-me";
import { getProductByHandle } from "@/lib/data/products";

export function isCureMePreview() {
  return process.env.VERCEL_ENV === "preview" &&
    process.env.VERCEL_GIT_COMMIT_REF === "codex/kuul-cure-me-1kg-photo-preview-20261125";
}

export function projectCureMePreview(product: HttpTypes.StoreProduct): HttpTypes.StoreProduct {
  if (
    !isCureMePreview() ||
    product.id !== CURE_ME.productId ||
    product.handle !== CURE_ME.legacyHandle ||
    product.variants?.length !== 1
  ) return product;

  const [variant] = product.variants;
  if (variant.id !== CURE_ME.variantId || variant.sku !== CURE_ME.sku) return product;

  const describeSize = <T extends { id: string; value: string }>(value: T): T =>
    value.id === CURE_ME.sizeId ? { ...value, value: CURE_ME.presentation } : value;

  const photo = {
    id: "kuul-cure-me-1kg-preview-photo",
    url: CURE_ME.photo,
    rank: 0,
    variants: [],
  };

  return {
    ...product,
    handle: CURE_ME.handle,
    title: CURE_ME.title,
    description: CURE_ME.description,
    thumbnail: CURE_ME.photo,
    images: [photo, ...(product.images ?? []).filter((image) => image.url !== CURE_ME.photo)],
    options: product.options?.map((option) => ({
      ...option,
      values: option.values?.map(describeSize) ?? [],
    })) ?? null,
    variants: [{
      ...variant,
      title: CURE_ME.presentation,
      options: variant.options?.map(describeSize) ?? null,
    }],
  };
}

export async function getProductForDisplay(handle: string) {
  const product = await getProductByHandle(handle);
  if (!isCureMePreview()) return product;

  if (handle === CURE_ME.handle) {
    const source = product ?? await getProductByHandle(CURE_ME.legacyHandle);
    if (!source || source.id !== CURE_ME.productId) return null;
    const projection = projectCureMePreview(source);
    return projection.handle === handle ? projection : null;
  }
  return product ? projectCureMePreview(product) : null;
}
