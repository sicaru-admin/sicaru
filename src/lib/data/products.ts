import { sdk } from "@/lib/medusa";
import { HttpTypes } from "@medusajs/types";

export async function getProducts(
  queryParams?: HttpTypes.StoreProductListParams
) {
  const { products, count, offset, limit } = await sdk.store.product.list({
    limit: 20,
    ...queryParams,
  });

  return { products, count, offset, limit };
}

export async function getProductByHandle(handle: string) {
  const { products } = await sdk.store.product.list({
    handle,
    limit: 1,
  });

  return products[0] || null;
}

export async function getProductsByCollection(collectionId: string) {
  const { products, count, offset, limit } = await sdk.store.product.list({
    collection_id: [collectionId],
    limit: 50,
  });

  return { products, count, offset, limit };
}
