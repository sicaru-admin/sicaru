"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ShoppingBag, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

type OrderData = {
  id: string;
  display_id?: number;
  email?: string;
  items?: Array<{
    id: string;
    product_title?: string;
    variant_title?: string;
    quantity: number;
    unit_price: number;
    thumbnail?: string | null;
  }>;
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    phone?: string;
  };
  total?: number;
  subtotal?: number;
  shipping_total?: number;
  tax_total?: number;
  currency_code?: string;
  payment_collections?: Array<{
    payment_sessions?: Array<{
      provider_id?: string;
    }>;
  }>;
};

function formatPrice(amount: number | undefined | null, currency = "MXN") {
  if (amount == null) return "$0.00";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount);
}

export default function ConfirmacionPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("sicaru_last_order");
    if (stored) {
      try {
        setOrder(JSON.parse(stored));
      } catch {
        router.replace("/");
      }
    } else {
      router.replace("/");
    }
  }, [router]);

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-sicaru-purple-600" />
      </div>
    );
  }

  const currency = order.currency_code?.toUpperCase() || "MXN";
  const items = order.items ?? [];
  const isManualPayment = order.payment_collections?.some((pc) =>
    pc.payment_sessions?.some(
      (s) => s.provider_id === "pp_system_default"
    )
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:py-16">
      {/* Success header */}
      <div className="mb-10 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-sicaru-purple-900 lg:text-3xl">
          ¡Pedido Confirmado!
        </h1>
        <p className="mt-2 text-gray-600">
          Pedido #{order.display_id ?? order.id.slice(-8).toUpperCase()}
        </p>
        {order.email && (
          <p className="mt-1 text-sm text-gray-500">
            Hemos enviado la confirmación a{" "}
            <span className="font-medium">{order.email}</span>
          </p>
        )}
      </div>

      {/* Manual payment instructions */}
      {isManualPayment && (
        <div className="mb-8 rounded-lg border-2 border-amber-300 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-amber-800">
            Tu pedido está pendiente de pago
          </h2>
          <p className="mt-2 text-sm text-amber-700">
            Para completar tu pedido, realiza el pago por uno de estos métodos:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-700">
            <li className="flex gap-2">
              <span className="font-bold">OXXO Pay:</span> Acude a cualquier
              OXXO y proporciona tu número de pedido como referencia.
            </li>
            <li className="flex gap-2">
              <span className="font-bold">Transferencia bancaria:</span>{" "}
              Contáctanos por WhatsApp para recibir los datos bancarios.
            </li>
          </ul>
          <p className="mt-3 text-xs text-amber-600">
            Referencia de pedido: #
            {order.display_id ?? order.id.slice(-8).toUpperCase()}
          </p>
        </div>
      )}

      {/* Card payment success */}
      {!isManualPayment && (
        <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm text-green-700">
          Tu pago ha sido procesado exitosamente.
        </div>
      )}

      {/* Order items */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Resumen del pedido
        </h2>
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
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.product_title}
                  </p>
                  {item.variant_title && (
                    <p className="text-xs text-gray-500">
                      {item.variant_title}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
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
            <span>{formatPrice(order.subtotal, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Envío</span>
            <span>
              {order.shipping_total === 0
                ? "Gratis"
                : formatPrice(order.shipping_total, currency)}
            </span>
          </div>
          {(order.tax_total ?? 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Impuestos</span>
              <span>{formatPrice(order.tax_total, currency)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 text-base font-bold">
            <span>Total</span>
            <span className="text-sicaru-purple-900">
              {formatPrice(order.total, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {order.shipping_address && (
        <div className="mt-6 rounded-lg border bg-white p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Dirección de envío
          </h2>
          <p className="text-sm text-gray-900">
            {order.shipping_address.first_name}{" "}
            {order.shipping_address.last_name}
          </p>
          <p className="text-sm text-gray-600">
            {order.shipping_address.address_1}
            {order.shipping_address.address_2 &&
              `, ${order.shipping_address.address_2}`}
          </p>
          <p className="text-sm text-gray-600">
            {order.shipping_address.city}, {order.shipping_address.province}{" "}
            {order.shipping_address.postal_code}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/productos"
          className="rounded-full bg-sicaru-pink px-8 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
        >
          Seguir Comprando
        </Link>
        <a
          href="https://wa.me/528281111023"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <MessageCircle className="h-4 w-4" />
          ¿Necesitas ayuda?
        </a>
      </div>
    </div>
  );
}
