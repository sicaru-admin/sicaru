"use client";

import type { HttpTypes } from "@medusajs/types";
import { formatCurrency } from "@/lib/order-totals";

type OrderReviewProps = {
  cart: HttpTypes.StoreCart;
  email: string;
  shippingAddress: {
    first_name: string;
    last_name: string;
    phone: string;
    address_1: string;
    address_2: string;
    city: string;
    province: string;
    postal_code: string;
  };
  shippingMethodName: string;
  paymentMethodName: string;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
  isPaymentReady: boolean;
  isValidatingPayment: boolean;
  error: string | null;
};

export function OrderReview({
  cart,
  paymentMethodName,
  onConfirm,
  isSubmitting,
  isPaymentReady,
  isValidatingPayment,
  error,
}: OrderReviewProps) {
  const currency=cart.currency_code?.toUpperCase()||"MXN";
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">{paymentMethodName}. Revisa el resumen antes de pagar.</p>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onConfirm}
        disabled={isSubmitting || isValidatingPayment || !isPaymentReady}
        className="w-full rounded-full bg-sicaru-purple-700 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-sicaru-purple-600 disabled:opacity-50"
      >
        {isSubmitting || isValidatingPayment ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            {isValidatingPayment ? "Validando pago..." : "Procesando..."}
          </span>
        ) : (
          "Pagar " + formatCurrency(cart.total, currency)
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Al confirmar tu pedido aceptas nuestros términos y condiciones.
      </p>
    </div>
  );
}

