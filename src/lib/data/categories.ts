import { sdk } from "@/lib/medusa";
import { HttpTypes } from "@medusajs/types";

export async function getCategories(
  queryParams?: HttpTypes.StoreProductCategoryListParams
) {
  const { product_categories, count, offset, limit } =
    await sdk.store.category.list({
      limit: 50,
      ...queryParams,
    });

  return { categories: product_categories, count, offset, limit };
}

export async function getCategoryByHandle(handle: string) {
  const { product_categories } = await sdk.store.category.list({
    handle: [handle],
    limit: 1,
  });

  return product_categories[0] || null;
}
