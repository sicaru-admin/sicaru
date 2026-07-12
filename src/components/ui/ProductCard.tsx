import Link from "next/link";
import Image from "next/image";
import { HttpTypes } from "@medusajs/types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { BrandBadge } from "@/components/ui/BrandBadge";
import { ArrowRight, ImageIcon } from "lucide-react";

type ProductCardProps = {
  product: HttpTypes.StoreProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const productWithCategories = product as HttpTypes.StoreProduct & {
    categories?: Array<{ name?: string }>;
  };
  const firstVariant = product.variants?.[0];
  const brand = product.collection?.title;
  const category = productWithCategories.categories?.[0]?.name;
  const hasDiscount =
    firstVariant?.calculated_price?.original_amount != null &&
    firstVariant?.calculated_price?.calculated_amount != null &&
    firstVariant.calculated_price.original_amount >
      firstVariant.calculated_price.calculated_amount;

  return (
    <Link
      href={`/productos/${product.handle}`}
      className="sicaru-card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9b89a8] hover:shadow-[0_18px_45px_rgba(46,43,43,0.08)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f5f1eb] p-4">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title || "Producto"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-contain object-center p-5 transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-[#9b89a8]">
            <ImageIcon className="h-9 w-9" strokeWidth={1.3} />
            <span className="text-xs font-semibold uppercase tracking-[0.08em]">
              Imagen próximamente
            </span>
          </div>
        )}

        {category && (
          <div className="absolute left-2 top-2">
            <BrandBadge name={category} />
          </div>
        )}

        {hasDiscount && (
          <div className="absolute right-2 top-2 rounded-[6px] bg-[#7f6d8a] px-2 py-1 text-xs font-semibold text-[#faf8f5]">
            Oferta
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {brand && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f6d8a]">
            {brand}
          </p>
        )}
        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#2e2b2b]">
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
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-xs font-semibold uppercase tracking-[0.08em] text-[#7f6d8a]">
          Ver producto
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
