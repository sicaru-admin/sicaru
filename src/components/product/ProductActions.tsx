"use client";

import { useState } from "react";
import { HttpTypes } from "@medusajs/types";
import { MessageCircle, Truck, ShieldCheck, BadgeCheck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { VariantSelector } from "./VariantSelector";
import { QuantitySelector } from "./QuantitySelector";

type ProductActionsProps = {
  product: HttpTypes.StoreProduct;
};

const WHATSAPP_NUMBER = "528281111023";

const TRUST_ITEMS = [
  { icon: Truck, text: "Envío mismo día" },
  { icon: ShieldCheck, text: "Pago seguro" },
  { icon: BadgeCheck, text: "Distribuidor autorizado" },
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
    <div className="space-y-6">
      {/* Price */}
      <div>
        <div className="flex items-baseline gap-3">
          <PriceDisplay
            variant={selectedVariant}
            className="text-2xl font-bold text-sicaru-purple-900 md:text-3xl"
          />
          {hasDiscount && price?.original_amount != null && (
            <PriceDisplay
              amount={price.original_amount}
              className="text-lg text-gray-400 line-through"
            />
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">IVA incluido</p>
      </div>

      {/* Variant selector */}
      <VariantSelector
        variants={variants}
        selected={selectedVariant}
        onSelect={setSelectedVariant}
      />

      {/* Quantity */}
      <QuantitySelector quantity={quantity} onChange={setQuantity} />

      {/* Action buttons — sticky on mobile */}
      <div className="sticky bottom-0 z-20 -mx-4 bg-white px-4 py-4 md:static md:mx-0 md:p-0">
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full rounded-full bg-sicaru-pink px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:cursor-not-allowed disabled:opacity-50 md:text-lg"
        >
          {isLoading ? "Agregando..." : "Agregar al Carrito"}
        </button>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#25D366] px-8 py-3 text-base font-semibold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
        >
          <MessageCircle className="h-5 w-5" />
          Preguntar por WhatsApp
        </a>
      </div>

      {/* Trust row */}
      <div className="flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-4 md:justify-start">
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-1.5 text-xs text-gray-500"
          >
            <item.icon className="h-4 w-4 text-sicaru-purple-400" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
