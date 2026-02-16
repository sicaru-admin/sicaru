import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

const MEILISEARCH_HOST =
  process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://localhost:7700";
const MEILISEARCH_SEARCH_KEY =
  process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || "";

export const { searchClient } = instantMeiliSearch(
  MEILISEARCH_HOST,
  MEILISEARCH_SEARCH_KEY
);

export const PRODUCTS_INDEX = "products";
