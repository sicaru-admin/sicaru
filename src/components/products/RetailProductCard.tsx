"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { getApprovedPrice, getProductPhoto, hasKnownAvailability } from "@/lib/product-retail";
import { ProductPhoto } from "./ProductPhoto";

export function RetailProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  const variants = product.variants ?? [];
  const [variantId, setVariantId] = useState(variants.length === 1 ? variants[0].id : "");
  const [error, setError] = useState<string | null>(null);
  const selectId = useId();
  const { addToCart, isLoading } = useCart();
  const variant = variants.find((item) => item.id === variantId);
  const price = getApprovedPrice(product, variant);
  const available = hasKnownAvailability(variant);
  const brand = product.collection?.title || (typeof product.metadata?.brand === "string" ? product.metadata.brand : null);
  const presentation = product.subtitle || (typeof product.metadata?.presentation === "string" ? product.metadata.presentation : null);
  const image = getProductPhoto(product, variant);

  async function add() {
    if (!variant || !available) return;
    setError(null);
    try { await addToCart(variant.id); }
    catch { setError("No pudimos agregarlo. Intenta de nuevo."); }
  }

  return (
    <article data-testid="retail-product-card" className="group flex min-w-0 flex-col rounded-xl border border-[#efe7dd] bg-[#faf8f5] p-2.5 transition-colors hover:border-[#9b89a8] sm:p-4">
      <Link href={`/productos/${product.handle}`} className="relative block aspect-square overflow-hidden rounded-lg bg-[#faf8f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f6d8a]" aria-label={`Ver ${product.title}`}>
        <ProductPhoto src={image} alt={product.title || "Producto SICARÚ"} />
      </Link>
      <div className="flex flex-1 flex-col pt-2.5">
        {brand && <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-[#7f6d8a] sm:text-xs">{brand}</p>}
        <h3 className="line-clamp-2 text-xs font-medium leading-5 text-[#2e2b2b] sm:text-sm"><Link href={`/productos/${product.handle}`}>{product.title}</Link></h3>
        {presentation && <p className="mt-1 text-[0.65rem] leading-4 text-[#2e2b2b]/65 sm:text-xs">{presentation}</p>}
        <p className="mt-2 text-sm font-semibold text-[#7f6d8a] sm:text-base" data-testid="retail-price">{price ? new Intl.NumberFormat("es-MX", { style: "currency", currency: price.currency_code || "MXN" }).format(price.calculated_amount) : "Consultar precio"}</p>
        <div className="mt-auto pt-3">
          {variants.length > 1 && <div className="mb-2">
            <label htmlFor={selectId} className="sr-only">Variante de {product.title}</label>
            <select id={selectId} value={variantId} onChange={(event) => { setVariantId(event.target.value); setError(null); }} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-[#9b89a8]/40 bg-[#faf8f5] px-2 text-[0.7rem] text-[#2e2b2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7f6d8a] sm:text-sm">
              <option value="">Elegir variante</option>
              {variants.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
          </div>}
          <button type="button" onClick={() => void add()} disabled={!available || isLoading} aria-label={`Agregar ${product.title}`} className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-[#7f6d8a] px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#6c5c76] disabled:cursor-not-allowed disabled:bg-[#efe7dd] disabled:text-[#2e2b2b]/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f6d8a] sm:text-sm">
            {available && <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}{isLoading ? "Agregando…" : !variant && variants.length > 1 ? "Elige una variante" : !available ? "Consultar disponibilidad" : "Agregar"}
          </button>
          {error && <p role="alert" className="mt-2 text-xs leading-4 text-[#7f6d8a]">{error}</p>}
        </div>
      </div>
    </article>
  );
}
