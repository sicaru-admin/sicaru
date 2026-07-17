import Link from "next/link";
import { HttpTypes } from "@medusajs/types";
import { getProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { ArrowRight } from "lucide-react";

export async function FeaturedProducts() {
  let products: HttpTypes.StoreProduct[] = [];
  try {
    const result = await getProducts({ limit: 8 });
    products = result.products;
  } catch {
    // API unavailable — render nothing
  }

  if (products.length === 0) {
    return null;
  }

  const productsWithImages = products
    .filter((product) => product.thumbnail?.trim())
    .slice(0, 4);

  if (productsWithImages.length < 3) {
    return null;
  }

  const gridColumns =
    productsWithImages.length === 3
      ? "grid-cols-1 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="bg-[#f5f1eb] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[#8e7a9e]">
              Selección de tienda
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-[#2e2b2b] md:text-4xl">
              Productos que vale la pena tener a la mano
            </h2>
          </div>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7f6d8a] transition-colors hover:text-[#2e2b2b]"
          >
            Ver catálogo completo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className={`grid ${gridColumns} gap-3 md:gap-5`}>
          {productsWithImages.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
