import { catalogRequest } from "@/lib/catalog-request";
import { sdk } from "@/lib/medusa";
import { HttpTypes } from "@medusajs/types";

export async function getCategories(
  queryParams?: HttpTypes.StoreProductCategoryListParams
) {
  const { product_categories, count, offset, limit } =
    await catalogRequest(() => sdk.store.category.list({
      limit: 50,
      ...queryParams,
    }));

  if (!Array.isArray(product_categories)) throw new Error("Invalid category response");
  return { categories: product_categories, count, offset, limit };
}

export async function getCategoryByHandle(handle: string) {
  const { product_categories } = await catalogRequest(() => sdk.store.category.list({
    handle: [handle],
    limit: 1,
  }));

  if (!Array.isArray(product_categories)) throw new Error("Invalid category response");
  return product_categories[0] || null;
}
