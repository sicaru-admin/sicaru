import Link from "next/link";
import Image from "next/image";
import { HttpTypes } from "@medusajs/types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { BrandBadge } from "@/components/ui/BrandBadge";

type ProductCardProps = {
  product: HttpTypes.StoreProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants?.[0];
  const hasDiscount =
    firstVariant?.calculated_price?.original_amount != null &&
    firstVariant?.calculated_price?.calculated_amount != null &&
    firstVariant.calculated_price.original_amount >
      firstVariant.calculated_price.calculated_amount;

  return (
    <Link
      href={`/productos/${product.handle}`}
      className="group block overflow-hidden border border-[#efe7dd] bg-[#faf8f5] transition-colors duration-300 hover:border-[#9b89a8]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#efe7dd]">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title || "Producto"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-[#9b89a8]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-medium uppercase">Próximamente</span>
          </div>
        )}

        {product.collection?.title && (
          <div className="absolute left-2 top-2">
            <BrandBadge name={product.collection.title} />
          </div>
        )}

        {hasDiscount && (
          <div className="absolute right-2 top-2 bg-[#7f6d8a] px-2 py-1 text-xs font-bold text-white">
            Oferta
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#2e2b2b]">
          {product.title}
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <PriceDisplay
            variant={firstVariant}
            className="text-sm font-semibold text-[#7f6d8a]"
          />
          {hasDiscount &&
            firstVariant?.calculated_price?.original_amount != null && (
              <PriceDisplay
                amount={firstVariant.calculated_price.original_amount}
                className="text-xs text-[#2e2b2b]/40 line-through"
              />
            )}
        </div>
      </div>
    </Link>
  );
}
