"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, ShoppingBag, Gift } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";
import {
  getLoyaltyAccount,
  redeemPoints,
  type LoyaltyAccount,
} from "@/lib/data/loyalty";
import { applyPromoCode, removePromoCode } from "@/lib/data/checkout";

type OrderSummaryProps = {
  cart: HttpTypes.StoreCart | null;
  isAuthenticated?: boolean;
  onCartRefresh?: () => void;
};

function formatPrice(amount: number | undefined | null, currency = "MXN") {
  if (amount == null) return "$0.00";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount);
}

function LoyaltySection({
  cart,
  onCartRefresh,
}: {
  cart: HttpTypes.StoreCart;
  onCartRefresh?: () => void;
}) {
  const [loyalty, setLoyalty] = useState<LoyaltyAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLoyaltyAccount()
      .then((data) => setLoyalty(data.loyalty_account))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !loyalty || loyalty.points_balance < 100) return null;

  const maxPoints =
    Math.floor(loyalty.points_balance / 100) * 100;
  const discountMXN = Math.floor(maxPoints / 100) * 10;

  // Estimate points earned for this order
  const cartTotalMXN = (cart.total ?? 0);
  const tenMXNunits = Math.floor(cartTotalMXN / 10);
  const pointsToEarn = Math.floor(tenMXNunits * loyalty.tier_multiplier);

  async function handleApply() {
    setIsApplying(true);
    setError(null);
    try {
      const result = await redeemPoints(maxPoints);
      await applyPromoCode(cart.id, result.promo_code);
      setAppliedCode(result.promo_code);
      // Refresh loyalty data
      const updated = await getLoyaltyAccount();
      setLoyalty(updated.loyalty_account);
      onCartRefresh?.();
    } catch (err: any) {
      setError(err.message || "Error al aplicar puntos");
    } finally {
      setIsApplying(false);
    }
  }

  async function handleRemove() {
    if (!appliedCode) return;
    setIsApplying(true);
    try {
      await removePromoCode(cart.id, appliedCode);
      setAppliedCode(null);
      onCartRefresh?.();
    } catch {
      // Ignore removal errors
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center gap-2 text-sm font-medium text-sicaru-purple-900">
        <Gift className="h-4 w-4" />
        Puntos Sicaru
      </div>

      {appliedCode ? (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-green-50 p-3 text-sm">
          <span className="text-green-700">
            -{formatPrice(discountMXN)} aplicado
          </span>
          <button
            onClick={handleRemove}
            disabled={isApplying}
            className="text-xs font-medium text-gray-500 underline hover:text-gray-700"
          >
            Quitar
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            Tienes {loyalty.points_balance.toLocaleString("es-MX")} puntos
            (${loyalty.points_value_mxn} MXN)
          </p>
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="mt-2 w-full rounded-lg border border-sicaru-purple-600 px-4 py-2 text-sm font-medium text-sicaru-purple-600 transition-colors hover:bg-sicaru-purple-50 disabled:opacity-50"
          >
            {isApplying
              ? "Aplicando..."
              : `Usar ${maxPoints} puntos (-$${discountMXN} MXN)`}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      {/* Points earned preview */}
      {pointsToEarn > 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-sicaru-purple-600">
          <Gift className="h-3 w-3" />
          Vas a ganar {pointsToEarn} puntos con este pedido
        </p>
      )}
    </div>
  );
}

export function OrderSummary({
  cart,
  isAuthenticated,
  onCartRefresh,
}: OrderSummaryProps) {
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

      {/* Loyalty Points Section */}
      {isAuthenticated && (
        <LoyaltySection cart={cart} onCartRefresh={onCartRefresh} />
      )}

      {/* Totals */}
      <div className="mt-4 space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(cart.item_subtotal, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Envio</span>
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
        {(cart.discount_total ?? 0) > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Descuento</span>
            <span>-{formatPrice(cart.discount_total, currency)}</span>
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
