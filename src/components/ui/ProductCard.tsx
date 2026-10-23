import type { HttpTypes } from "@medusajs/types";
import { RetailProductCard } from "@/components/products/RetailProductCard";

export function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  return <RetailProductCard product={product} />;
}
