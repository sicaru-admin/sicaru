"use client";

import { useEffect, useRef, lazy } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { ShoppingBag } from "lucide-react";

const CartDrawer = lazy(() =>
  import("@/components/cart/CartDrawer").then((mod) => ({ default: mod.CartDrawer }))
);

export function CartButton() {
  const { openCart, isOpen, totalItems } = useCart();
  const prevItems = useRef(totalItems);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (totalItems > prevItems.current && buttonRef.current) {
      buttonRef.current.classList.add("animate-bounce");
      const timer = setTimeout(() => {
        buttonRef.current?.classList.remove("animate-bounce");
      }, 600);
      return () => clearTimeout(timer);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={openCart}
        className="tap-feedback sicaru-nav-icon-button relative"
        aria-label="Abrir carrito"
      >
        <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-[4px] bg-[#7f6d8a] px-1 text-xs font-semibold text-[#faf8f5] transition-transform">
            {totalItems}
          </span>
        )}
      </button>
      {isOpen && <CartDrawer />}
    </>
  );
}
