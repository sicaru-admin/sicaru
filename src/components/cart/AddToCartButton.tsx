"use client";

import { useCart } from "./CartProvider";

export function AddToCartButton({ variantId }: { variantId: string }) {
  const { addToCart, isLoading } = useCart();

  return (
    <button
      onClick={() => addToCart(variantId)}
      disabled={isLoading || !variantId}
      className="w-full rounded-full bg-sicaru-pink px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? "Agregando..." : "Agregar al Carrito"}
    </button>
  );
}
