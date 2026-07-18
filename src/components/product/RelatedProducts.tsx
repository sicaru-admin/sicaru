import { getProducts, getProductsByCollection } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

type RelatedProductsProps = {
  title: string;
  collectionId?: string | null;
  excludeProductId: string;
  limit?: number;
};

export async function RelatedProducts({
  title,
  collectionId,
  excludeProductId,
  limit = 4,
}: RelatedProductsProps) {
  let products;
  try {
    if (collectionId) {
      const result = await getProductsByCollection(collectionId);
      products = result.products;
    } else {
      const result = await getProducts({ limit: limit + 1 });
      products = result.products;
    }
  } catch {
    return null;
  }

  // Exclude current product
  const filtered = products
    .filter((p) => p.id !== excludeProductId)
    .slice(0, limit);

  if (filtered.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 font-heading text-2xl font-bold text-[#2E2B2B]">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
