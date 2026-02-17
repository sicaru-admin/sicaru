"use client";

import { useState, useEffect } from "react";
import { HttpTypes } from "@medusajs/types";
import { useCart } from "@/components/cart/CartProvider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

type StickyAddToCartProps = {
  product: HttpTypes.StoreProduct;
};

export function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const { addToCart, isLoading } = useCart();

  const firstVariant = product.variants?.[0];

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!firstVariant || !visible) return null;

  const handleAdd = () => {
    addToCart(firstVariant.id, 1);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur-sm px-4 py-3 md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-sicaru-purple-900">
            {product.title}
          </p>
          <PriceDisplay
            variant={firstVariant}
            className="text-sm font-bold text-sicaru-purple-900"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={isLoading}
          className="btn-ripple tap-feedback shrink-0 rounded-full bg-sicaru-pink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:opacity-50"
        >
          {isLoading ? "..." : "Agregar"}
        </button>
      </div>
    </div>
  );
}
