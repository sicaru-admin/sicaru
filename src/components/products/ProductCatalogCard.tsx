import Image from "next/image";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { ArrowRight, ImageIcon } from "lucide-react";

type ProductCatalogCardProps = {
  product: HttpTypes.StoreProduct;
};

function formatPrice(product: HttpTypes.StoreProduct) {
  const price = product.variants?.[0]?.calculated_price;

  if (price?.calculated_amount == null) return "Precio no disponible";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: price.currency_code || "MXN",
  }).format(price.calculated_amount);
}

export function ProductCatalogCard({ product }: ProductCatalogCardProps) {
  const thumbnail =
    typeof product.thumbnail === "string" && product.thumbnail.trim().length > 0
      ? product.thumbnail
      : null;

  return (
    <Link
      href={`/productos/${product.handle}`}
      className="group flex h-full flex-col overflow-hidden border border-[#efe7dd] bg-[#faf8f5] transition-colors duration-[200ms] hover:border-[#9b89a8] focus:outline-none focus-visible:border-[#7f6d8a] focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.16)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[#efe7dd] bg-[#f5f1eb]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.title || "Producto Sicarú"}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
            className="object-contain p-5 transition-transform duration-[220ms] group-hover:scale-[1.015]"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-5">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-[#efe7dd] bg-[#faf8f5]/55 px-4 text-center text-[#9b89a8]">
              <ImageIcon className="h-5 w-5" strokeWidth={1.35} />
              <span className="max-w-[8.5rem] text-[0.62rem] font-semibold uppercase leading-4 tracking-[0.08em]">
                Imagen próximamente
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h2 className="line-clamp-3 min-h-[3.75rem] text-sm font-medium leading-5 text-[#2e2b2b]">
          {product.title}
        </h2>
        <p className="mt-3 text-sm font-semibold text-[#7f6d8a]">
          {formatPrice(product)}
        </p>
        <span className="mt-4 inline-flex min-h-10 items-center gap-1.5 self-start text-xs font-semibold uppercase text-[#7f6d8a] transition-colors group-hover:text-[#8e7a9e]">
          Ver detalle
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
