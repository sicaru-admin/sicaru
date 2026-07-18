"use client";

import { useState } from "react";
import { HttpTypes } from "@medusajs/types";
import { MessageCircle, Search, ShieldCheck, BadgeCheck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { VariantSelector } from "./VariantSelector";
import { QuantitySelector } from "./QuantitySelector";

type ProductActionsProps = {
  product: HttpTypes.StoreProduct;
};

const WHATSAPP_NUMBER = "528281111023";

const TRUST_ITEMS = [
  { icon: Search, text: "Consulta disponibilidad" },
  { icon: ShieldCheck, text: "Pago seguro" },
  { icon: BadgeCheck, text: "Productos profesionales" },
];

export function ProductActions({ product }: ProductActionsProps) {
  const variants = product.variants ?? [];
  const [selectedVariant, setSelectedVariant] = useState(
    variants[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isLoading } = useCart();

  if (!selectedVariant) return null;

  const price = selectedVariant.calculated_price;
  const formattedPrice = price?.calculated_amount != null
    ? new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: price.currency_code || "MXN",
      }).format(price.calculated_amount)
    : "";

  const whatsappMsg = `Hola! Me interesa el ${product.title} (${formattedPrice}). ¿Tienen disponible?`;

  const handleAddToCart = async () => {
    await addToCart(selectedVariant.id, quantity);
  };

  const hasDiscount =
    price?.original_amount != null &&
    price?.calculated_amount != null &&
    price.original_amount > price.calculated_amount;

  return (
    <div className="space-y-4 md:space-y-5 [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-[#9b89a8]">
      {/* Price */}
      <div>
        <div className="flex items-baseline gap-3">
          <PriceDisplay
            variant={selectedVariant}
            className="text-2xl font-semibold text-[#2e2b2b] md:text-3xl"
          />
          {hasDiscount && price?.original_amount != null && (
            <PriceDisplay
              amount={price.original_amount}
              className="text-lg text-[#7f6d8a]/55 line-through"
            />
          )}
        </div>
        <p className="mt-1 text-xs text-[#2e2b2b]/55">IVA incluido</p>
      </div>

      {/* Variant selector */}
      <VariantSelector
        variants={variants}
        selected={selectedVariant}
        onSelect={setSelectedVariant}
      />

      {/* Quantity */}
      <QuantitySelector quantity={quantity} onChange={setQuantity} />

      {/* Action buttons */}
      <div className="space-y-2.5 md:space-y-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isLoading}
          className="btn-ripple tap-feedback w-full bg-[#7f6d8a] px-8 py-3.5 text-base font-semibold text-[#faf8f5] transition-colors duration-200 hover:bg-[#8e7a9e] disabled:cursor-not-allowed disabled:opacity-50 md:text-lg"
        >
          {isLoading ? "Agregando..." : "Agregar al Carrito"}
        </button>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 w-full items-center justify-center gap-2 border border-[#7f6d8a] px-8 py-3 text-base font-semibold text-[#7f6d8a] transition-colors duration-200 hover:bg-[#f5f1eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8]"
        >
          <MessageCircle className="h-5 w-5" />
          Preguntar por WhatsApp
        </a>
      </div>

      {/* Trust row */}
      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-[#efe7dd] pt-3 md:justify-start md:gap-4 md:pt-4">
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-1.5 text-xs text-[#2e2b2b]/60"
          >
            <item.icon className="h-4 w-4 text-[#8e7a9e]" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
