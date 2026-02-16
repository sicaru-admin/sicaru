import Link from "next/link";
import { HttpTypes } from "@medusajs/types";
import { getProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

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

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
          Productos Destacados
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/productos"
            className="inline-block text-base font-semibold text-sicaru-pink transition-colors hover:text-sicaru-purple-600"
          >
            Ver Todos los Productos &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
