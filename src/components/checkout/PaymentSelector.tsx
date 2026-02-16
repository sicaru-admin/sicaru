"use client";

import { CreditCard, Store } from "lucide-react";
import {
  MercadoPagoCardForm,
  type CardTokenData,
} from "@/components/checkout/MercadoPagoCardForm";

export type PaymentMethod = "card" | "oxxo";

type PaymentSelectorProps = {
  selectedMethod: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
  onCardTokenized: (data: CardTokenData) => void;
  onOxxoSubmit: () => void;
  cartTotal: number;
  isLoading: boolean;
  error?: string | null;
};

const METHODS: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "card",
    label: "Tarjeta de crédito / débito",
    description: "Pago seguro con Mercado Pago",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: "oxxo",
    label: "OXXO Pay",
    description:
      "Paga en efectivo en cualquier OXXO. Recibirás un voucher con las instrucciones.",
    icon: <Store className="h-5 w-5" />,
  },
];

export function PaymentSelector({
  selectedMethod,
  onMethodChange,
  onCardTokenized,
  onOxxoSubmit,
  cartTotal,
  isLoading,
  error,
}: PaymentSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;

          return (
            <div key={method.id}>
              <label
                className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${
                  isSelected
                    ? "border-sicaru-purple-500 bg-sicaru-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => onMethodChange(method.id)}
                  className="mt-0.5 h-4 w-4 text-sicaru-purple-600 focus:ring-sicaru-purple-500"
                />
                <span className="mt-0.5 flex-shrink-0 text-gray-400">
                  {method.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {method.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {method.description}
                  </p>
                </div>
              </label>

              {/* Card: MP CardPayment brick renders inside selected option */}
              {isSelected && method.id === "card" && (
                <MercadoPagoCardForm
                  amount={cartTotal}
                  onTokenized={onCardTokenized}
                  onError={(err) => console.error(err)}
                />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* OXXO: standard continue button (card uses the brick's built-in button) */}
      {selectedMethod === "oxxo" && (
        <button
          type="button"
          onClick={onOxxoSubmit}
          disabled={isLoading}
          className="w-full rounded-full bg-sicaru-pink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:opacity-50"
        >
          {isLoading ? "Procesando..." : "Continuar"}
        </button>
      )}
    </div>
  );
}
