import { getProducts, getProductsByCollection } from "@/lib/data/products";
import { ProductRelatedCard } from "./ProductRelatedCard";

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

  const filtered = products
    .filter((p) => p.id !== excludeProductId)
    .slice(0, limit);

  if (filtered.length === 0) return null;

  return (
    <section className="min-w-0 overflow-hidden">
      <h2 className="mb-5 font-heading text-2xl font-bold text-[#2E2B2B] md:mb-6">
        {title}
      </h2>
      <div className="-mx-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
        <div className="flex snap-x snap-mandatory gap-4 md:contents">
          {filtered.map((product) => (
            <ProductRelatedCard
              key={product.id}
              product={product}
              className="w-[78vw] max-w-[320px] flex-none snap-start md:w-auto md:max-w-none md:flex-auto"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
