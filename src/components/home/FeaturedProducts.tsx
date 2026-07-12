import Link from "next/link";
import { HttpTypes } from "@medusajs/types";
import { getProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { ArrowRight } from "lucide-react";

const GROUPS = [
  {
    title: "Favoritos de Sicarú",
    query: "",
    href: "/productos",
  },
  {
    title: "Para reparar tu cabello",
    query: "keratina reparacion tratamiento",
    href: "/productos?buscar=reparacion",
  },
  {
    title: "Protección y acabado",
    query: "protector gel styling frizz",
    href: "/productos?buscar=protector",
  },
  {
    title: "Coloración profesional",
    query: "tinte color",
    href: "/productos?buscar=tinte",
  },
];

function matchesQuery(product: HttpTypes.StoreProduct, query: string) {
  if (!query) return true;
  const haystack = [product.title, product.description, product.handle]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("es-MX");

  return query
    .split(" ")
    .some((word) => haystack.includes(word.toLocaleLowerCase("es-MX")));
}

export async function FeaturedProducts() {
  let products: HttpTypes.StoreProduct[] = [];
  try {
    const result = await getProducts({ limit: 12 });
    products = result.products;
  } catch {
    // API unavailable — render nothing
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#faf8f5] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="sicaru-eyebrow">03 · Productos destacados</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-[#2e2b2b] md:text-4xl">
              Selecciones para comprar con intención
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

        <div className="space-y-12">
          {GROUPS.map((group) => {
            const matched = products.filter((product) =>
              matchesQuery(product, group.query)
            );
            const groupProducts = (matched.length ? matched : products).slice(0, 4);

            return (
              <div key={group.title}>
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#efe7dd] pb-3">
                  <h3 className="font-heading text-2xl font-semibold text-[#2e2b2b]">
                    {group.title}
                  </h3>
                  <Link
                    href={group.href}
                    className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7f6d8a] hover:text-[#2e2b2b]"
                  >
                    Ver más
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                  {groupProducts.map((product) => (
                    <ProductCard key={`${group.title}-${product.id}`} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
