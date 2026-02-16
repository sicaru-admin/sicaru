"use client";

import { Truck } from "lucide-react";

type ShippingOption = {
  id: string;
  name: string;
  amount: number;
  calculated_price?: {
    calculated_amount?: number | null;
    currency_code?: string | null;
  };
};

type ShippingMethodSelectorProps = {
  options: ShippingOption[];
  selectedId: string | null;
  onSelect: (optionId: string) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
};

function formatPrice(amount: number, currency = "MXN") {
  if (amount === 0) return "Gratis";
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
    if (!selectedId) return;
    await onSubmit();
  };

  if (options.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-gray-500">
        No hay opciones de envío disponibles para esta dirección.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {options.map((option) => {
          const price =
            option.calculated_price?.calculated_amount ?? option.amount ?? 0;
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
        disabled={isLoading || !selectedId}
        className="w-full rounded-full bg-sicaru-pink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:opacity-50"
      >
        {isLoading ? "Guardando..." : "Continuar"}
      </button>
    </form>
  );
}
