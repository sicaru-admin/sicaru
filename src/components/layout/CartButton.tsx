"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useCart } from "@/components/cart/CartProvider";

const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => mod.CartDrawer),
  { ssr: false }
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
        className="relative text-gray-700 hover:text-sicaru-purple-600 tap-feedback"
        aria-label="Abrir carrito"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sicaru-pink text-xs font-bold text-white transition-transform">
            {totalItems}
          </span>
        )}
      </button>
      {isOpen && <CartDrawer />}
    </>
  );
}
