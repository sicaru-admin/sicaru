"use client";

import { CreditCard, Store } from "lucide-react";

type PaymentProvider = {
  id: string;
};

type PaymentSelectorProps = {
  providers: PaymentProvider[];
  selectedProviderId: string | null;
  onSelect: (providerId: string) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  stripeClientSecret: string | null;
  stripeFormSlot?: React.ReactNode;
};

const PROVIDER_META: Record<
  string,
  { label: string; description: string; icon: React.ReactNode }
> = {
  pp_stripe_stripe: {
    label: "Tarjeta de crédito / débito",
    description: "Pago seguro con Stripe",
    icon: <CreditCard className="h-5 w-5" />,
  },
  pp_system_default: {
    label: "OXXO Pay / Transferencia bancaria",
    description:
      "Recibirás instrucciones de pago después de confirmar tu pedido",
    icon: <Store className="h-5 w-5" />,
  },
};

export function PaymentSelector({
  providers,
  selectedProviderId,
  onSelect,
  onSubmit,
  isLoading,
  stripeClientSecret,
  stripeFormSlot,
}: PaymentSelectorProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProviderId) return;
    await onSubmit();
  };

  if (providers.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-gray-500">
        No hay métodos de pago disponibles.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {providers.map((provider) => {
          const meta = PROVIDER_META[provider.id] ?? {
            label: provider.id,
            description: "",
            icon: <CreditCard className="h-5 w-5" />,
          };
          const isSelected = selectedProviderId === provider.id;

          return (
            <div key={provider.id}>
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
                  value={provider.id}
                  checked={isSelected}
                  onChange={() => onSelect(provider.id)}
                  className="mt-0.5 h-4 w-4 text-sicaru-purple-600 focus:ring-sicaru-purple-500"
                />
                <span className="mt-0.5 flex-shrink-0 text-gray-400">
                  {meta.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {meta.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {meta.description}
                  </p>
                </div>
              </label>

              {/* Stripe Elements form renders inside the selected card */}
              {isSelected &&
                provider.id === "pp_stripe_stripe" &&
                stripeClientSecret &&
                stripeFormSlot}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isLoading || !selectedProviderId}
        className="w-full rounded-full bg-sicaru-pink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:opacity-50"
      >
        {isLoading ? "Procesando..." : "Continuar"}
      </button>
    </form>
  );
}
