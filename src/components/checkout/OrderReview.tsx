"use client";

import type { HttpTypes } from "@medusajs/types";
import { MEXICAN_STATES } from "@/lib/constants/mexican-states";

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
  error: string | null;
};

function formatPrice(amount: number | undefined | null, currency = "MXN") {
  if (amount == null) return "$0.00";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount);
}

export function OrderReview({
  cart,
  email,
  shippingAddress,
  shippingMethodName,
  paymentMethodName,
  onConfirm,
  isSubmitting,
  error,
}: OrderReviewProps) {
  const stateName =
    MEXICAN_STATES.find((s) => s.value === shippingAddress.province)?.label ??
    shippingAddress.province;

  const currency = cart.currency_code?.toUpperCase() || "MXN";

  return (
    <div className="space-y-5">
      {/* Contact */}
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Contacto
        </p>
        <p className="mt-1 text-sm text-gray-900">{email}</p>
      </div>

      {/* Address */}
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Dirección de envío
        </p>
        <p className="mt-1 text-sm text-gray-900">
          {shippingAddress.first_name} {shippingAddress.last_name}
        </p>
        <p className="text-sm text-gray-600">
          {shippingAddress.address_1}
          {shippingAddress.address_2 && `, ${shippingAddress.address_2}`}
        </p>
        <p className="text-sm text-gray-600">
          {shippingAddress.city}, {stateName} {shippingAddress.postal_code}
        </p>
        <p className="text-sm text-gray-600">
          Tel: +52 {shippingAddress.phone}
        </p>
      </div>

      {/* Shipping + Payment */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Envío
          </p>
          <p className="mt-1 text-sm text-gray-900">{shippingMethodName}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Pago
          </p>
          <p className="mt-1 text-sm text-gray-900">{paymentMethodName}</p>
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(cart.item_subtotal, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Envío</span>
          <span>{formatPrice(cart.shipping_total, currency)}</span>
        </div>
        {(cart.tax_total ?? 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Impuestos</span>
            <span>{formatPrice(cart.tax_total, currency)}</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-2 text-base font-bold">
          <span>Total</span>
          <span className="text-sicaru-purple-900">
            {formatPrice(cart.total, currency)}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onConfirm}
        disabled={isSubmitting}
        className="w-full rounded-full bg-sicaru-purple-700 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-sicaru-purple-600 disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Procesando...
          </span>
        ) : (
          "Confirmar y Pagar"
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Al confirmar tu pedido aceptas nuestros términos y condiciones.
      </p>
    </div>
  );
}
