import Image from "next/image";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { ImageIcon } from "lucide-react";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

type ProductRelatedCardProps = {
  product: HttpTypes.StoreProduct;
  className?: string;
};

export function ProductRelatedCard({
  product,
  className = "",
}: ProductRelatedCardProps) {
  const firstVariant = product.variants?.[0];
  const thumbnail =
    typeof product.thumbnail === "string" && product.thumbnail.trim().length > 0
      ? product.thumbnail
      : null;

  return (
    <Link
      href={`/productos/${product.handle}`}
      className={`group flex h-full flex-col overflow-hidden border border-[#efe7dd] bg-[#faf8f5] transition-colors duration-200 hover:border-[#9b89a8] focus:outline-none focus-visible:border-[#7f6d8a] focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.16)] ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[#efe7dd] bg-[#f5f1eb]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.title || "Producto Sicarú"}
            fill
            sizes="(max-width: 767px) 82vw, (max-width: 1023px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-200 group-hover:scale-[1.015]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-[#9b89a8]">
            <ImageIcon className="h-5 w-5" strokeWidth={1.35} />
            <span className="max-w-[9rem] text-[0.62rem] font-semibold uppercase leading-4 tracking-[0.08em]">
              Imagen próximamente
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <h3 className="text-sm font-medium leading-5 text-[#2E2B2B]">
          {product.title}
        </h3>
        <PriceDisplay
          variant={firstVariant}
          className="mt-2 text-sm font-semibold text-[#7F6D8A]"
        />
      </div>
    </Link>
  );
}
