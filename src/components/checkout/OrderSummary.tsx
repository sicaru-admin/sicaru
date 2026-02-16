"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ShoppingBag } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";

type OrderSummaryProps = {
  cart: HttpTypes.StoreCart | null;
};

function formatPrice(amount: number | undefined | null, currency = "MXN") {
  if (amount == null) return "$0.00";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount);
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!cart) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-sicaru-purple-600" />
        </div>
      </div>
    );
  }

  const items = cart.items ?? [];
  const currency = cart.currency_code?.toUpperCase() || "MXN";
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const content = (
    <>
      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.product_title ?? ""}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-gray-300" />
                </div>
              )}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-[10px] font-bold text-white">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.product_title}
                </p>
                {item.variant_title && (
                  <p className="text-xs text-gray-500">{item.variant_title}</p>
                )}
              </div>
              <p className="ml-2 text-sm font-medium text-gray-900">
                {formatPrice(item.unit_price * item.quantity, currency)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-4 space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(cart.item_subtotal, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Envío</span>
          <span>
            {cart.shipping_total != null && cart.shipping_total > 0
              ? formatPrice(cart.shipping_total, currency)
              : cart.shipping_methods?.length
                ? "Gratis"
                : "Por calcular"}
          </span>
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
    </>
  );

  return (
    <>
      {/* Mobile: collapsible */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between rounded-lg border bg-white px-5 py-4"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-sicaru-purple-900">
            <ShoppingBag className="h-5 w-5" />
            Resumen del pedido ({itemCount})
          </span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sicaru-purple-900">
              {formatPrice(cart.total, currency)}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
        {isExpanded && (
          <div className="rounded-b-lg border border-t-0 bg-white px-5 py-4">
            {content}
          </div>
        )}
      </div>

      {/* Desktop: always visible */}
      <div className="hidden rounded-lg border bg-white p-6 lg:block">
        <h2 className="mb-4 text-sm font-semibold text-sicaru-purple-900">
          Resumen del pedido
        </h2>
        {content}
      </div>
    </>
  );
}
