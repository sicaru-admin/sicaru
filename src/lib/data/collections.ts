import { catalogRequest } from "@/lib/catalog-request";
import { sdk } from "@/lib/medusa";
import { HttpTypes } from "@medusajs/types";

export async function getCollections(
  queryParams?: HttpTypes.StoreCollectionListParams
) {
  const { collections, count, offset, limit } =
    await catalogRequest(() => sdk.store.collection.list({
      limit: 50,
      ...queryParams,
    }));

  if (!Array.isArray(collections)) throw new Error("Invalid collection response");
  return { collections, count, offset, limit };
}

export async function getCollectionByHandle(handle: string) {
  const { collections } = await catalogRequest(() => sdk.store.collection.list({
    handle: [handle],
    limit: 1,
  }));

  if (!Array.isArray(collections)) throw new Error("Invalid collection response");
  return collections[0] || null;
}
