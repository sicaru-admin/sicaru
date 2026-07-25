"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export function AddToCartButton({ variantId }: { variantId: string }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addToCart, isLoading } = useCart();

  const handleAdd = async () => {
    setErrorMessage(null);

    try {
      await addToCart(variantId);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No pudimos agregar el producto al carrito. Intenta de nuevo."
      );
    }
  };

  return (
    <div>
      <button
        onClick={handleAdd}
        disabled={isLoading || !variantId}
        className="w-full rounded-full bg-sicaru-pink px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Agregando..." : "Agregar al Carrito"}
      </button>
      {errorMessage && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
