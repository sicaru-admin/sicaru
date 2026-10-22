import { catalogRequest } from "@/lib/catalog-request";
import { sdk } from "@/lib/medusa";
import { getMexicoRegion } from "@/lib/data/regions";
import { HttpTypes } from "@medusajs/types";

export async function getProducts(
  queryParams?: HttpTypes.StoreProductListParams
) {
  const region = await getMexicoRegion();
  const { products, count, offset, limit } = await catalogRequest(() => sdk.store.product.list({
    limit: 20,
    region_id: region?.id,
    ...queryParams,
  }));

  if (!Array.isArray(products)) throw new Error("Invalid product response");
  return { products, count, offset, limit };
}

export async function getProductByHandle(handle: string) {
  const region = await getMexicoRegion();
  const { products } = await catalogRequest(() => sdk.store.product.list({
    handle,
    limit: 1,
    region_id: region?.id,
  }));

  if (!Array.isArray(products)) throw new Error("Invalid product response");
  return products[0] || null;
}

export async function getProductsByCollection(collectionId: string) {
  const region = await getMexicoRegion();
  const { products, count, offset, limit } = await catalogRequest(() => sdk.store.product.list({
    collection_id: [collectionId],
    limit: 50,
    region_id: region?.id,
  }));

  if (!Array.isArray(products)) throw new Error("Invalid product response");
  return { products, count, offset, limit };
}
