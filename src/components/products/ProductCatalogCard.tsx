import type { HttpTypes } from "@medusajs/types";
import { RetailProductCard } from "./RetailProductCard";

export function ProductCatalogCard({ product }: { product: HttpTypes.StoreProduct }) {
  return <RetailProductCard product={product} />;
}
