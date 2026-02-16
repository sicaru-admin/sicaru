import { sdk } from "@/lib/medusa";
import { HttpTypes } from "@medusajs/types";

export async function getCollections(
  queryParams?: HttpTypes.StoreCollectionListParams
) {
  const { collections, count, offset, limit } =
    await sdk.store.collection.list({
      limit: 50,
      ...queryParams,
    });

  return { collections, count, offset, limit };
}

export async function getCollectionByHandle(handle: string) {
  const { collections } = await sdk.store.collection.list({
    handle: [handle],
    limit: 1,
  });

  return collections[0] || null;
}
