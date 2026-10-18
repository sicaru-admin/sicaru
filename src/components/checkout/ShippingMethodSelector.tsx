"use client";

import { Truck } from "lucide-react";
import { getShippingOptionPrice } from "@/lib/shipping";
import type { DhlQuote, LocalDeliveryItem } from "@/lib/shipping";

type ShippingOption = {
  id: string;
  name: string;
  amount?: number | null;
  metadata?: Record<string, unknown> | null;
  calculated_price?: {
    calculated_amount?: number | null;
    currency_code?: string | null;
  } | null;
};

type ShippingMethodSelectorProps = {
  items?: LocalDeliveryItem[];
  options: ShippingOption[];
  quote?: DhlQuote;
  selectedId: string | null;
  onSelect: (optionId: string) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
};

function formatPrice(amount: number, currency = "MXN") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount);
}

export function ShippingMethodSelector({
  options,
  selectedId,
  onSelect,
  onSubmit,
  isLoading,
}: ShippingMethodSelectorProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selected = options.find((option) => option.id === selectedId);
    if (!selected || getShippingOptionPrice(selected) === null) return;
    await onSubmit();
  };

  if (options.length === 0) {
    return (
      <div className="space-y-3 py-4 text-sm text-gray-600" role="status">
        <p>El envío no está disponible para esta compra.</p>
        <p>Revisa tu dirección o vuelve a intentarlo más tarde. No se realizará ningún cobro.</p>

      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {options.map((option) => {
          const price = getShippingOptionPrice(option);
          if (price === null) return null;
          const currency =
            option.calculated_price?.currency_code?.toUpperCase() || "MXN";
          const isSelected = selectedId === option.id;

          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                isSelected
                  ? "border-sicaru-purple-500 bg-sicaru-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="shipping-method"
                value={option.id}
                checked={isSelected}
                onChange={() => onSelect(option.id)}
                className="h-4 w-4 text-sicaru-purple-600 focus:ring-sicaru-purple-500"
              />
              <Truck className="h-5 w-5 flex-shrink-0 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {option.name}
                </p>
                {typeof option.metadata?.delivery_estimate === "string" && <p className="mt-1 text-xs text-gray-600">Entrega estimada: {option.metadata.delivery_estimate}</p>}
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatPrice(price, currency)}
              </span>
            </label>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={
          isLoading ||
          !options.some(
            (option) => option.id === selectedId && getShippingOptionPrice(option) !== null
          )
        }
        className="w-full rounded-full bg-sicaru-pink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:opacity-50"
      >
        {isLoading ? "Guardando..." : "Continuar compra"}
      </button>
    </form>
  );
}

