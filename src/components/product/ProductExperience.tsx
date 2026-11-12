"use client";

import type { ReactNode } from "react";
import type { HttpTypes } from "@medusajs/types";
import { getProductMedia } from "@/lib/product-media";
import { ImageGallery } from "./ImageGallery";
import { ProductActions } from "./ProductActions";
import { ShippingInquiryHint } from "@/components/checkout/ShippingInquiryHint";

/** Actions owns selection; its canonical variant also drives the gallery. */
export function ProductExperience({ product, children }: {
  product: HttpTypes.StoreProduct;
  children: ReactNode;
}) {
  return (
    <ProductActions
      key={product.id}
      product={product}
      renderExperience={({ selectedVariant, actions }) => {
        const media = getProductMedia(product, selectedVariant?.id);
        const title = media.variantTitle
          ? `${product.title || ""} · ${media.variantTitle}` : product.title || "";
        return (
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.28fr)_minmax(360px,1fr)] lg:items-center lg:gap-10 xl:gap-12">
            <div className="min-w-0">
              <ImageGallery
                key={JSON.stringify([selectedVariant?.id, media.images])}
                images={media.images}
                title={title}
                reserveImageSpace={media.reserveImageSpace}
                reserveThumbnails={media.reserveThumbnails}
              />
            </div>
            <div className="min-w-0 border-t border-[#efe7dd] pt-6 lg:max-w-[520px] lg:border-t-0 lg:pt-0">
              {children}
              <div className="mt-6 md:mt-8">{actions}</div>
              <ShippingInquiryHint className="mt-3" />
            </div>
          </div>
        );
      }}
    />
  );
}
