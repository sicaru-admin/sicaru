import { cache } from "react";
import { getProducts } from "./products";
import { getBrandOptions } from "@/lib/brand-navigation";

// Mirrors the current /productos result set. Catalog pagination is a separate pending phase.
// Only a non-empty search in that same result set is advertised as published assortment.
export const getPublishedBrandOptions = cache(async () => {
  try {
    const { products } = await getProducts({ limit: 100, fields: "id,title,handle,+metadata,*collection" });
    return { brands: getBrandOptions(products), unavailable: false };
  } catch {
    return { brands: [], unavailable: true };
  }
});
