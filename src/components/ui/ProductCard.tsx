import type { HttpTypes } from "@medusajs/types";
import { ProductCatalogCard } from "@/components/products/ProductCatalogCard";
export function ProductCard({product}:{product:HttpTypes.StoreProduct}) {
  return <ProductCatalogCard product={product} />;
}
