"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { listOrders } from "@/lib/data/customer";
import { ShoppingBag, ChevronDown, Package } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";

function formatPrice(amount: number | undefined | null, currency = "MXN") {
  if (amount == null) return "$0.00";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pendiente",
    className: "bg-amber-100 text-amber-800",
  },
  completed: {
    label: "Completado",
    className: "bg-green-100 text-green-800",
  },
  canceled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800",
  },
  requires_action: {
    label: "Requiere accion",
    className: "bg-blue-100 text-blue-800",
  },
};

function OrderStatusBadge({ status }: { status: string }) {
  const config = STATUS_LABELS[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function OrderCard({ order }: { order: HttpTypes.StoreOrder }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currency = order.currency_code?.toUpperCase() || "MXN";
  const items = order.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="rounded-lg border bg-white">
      {/* Order header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-sicaru-purple-900">
              Pedido #{order.display_id}
            </span>
            <OrderStatusBadge status={order.status || "pending"} />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {order.created_at && formatDate(order.created_at as string)} &middot;{" "}
            {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </p>
        </div>
        <div className="ml-4 flex items-center gap-3">
          <span className="text-sm font-bold text-sicaru-purple-900">
            {formatPrice(order.total, currency)}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t px-5 py-4">
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
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
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
                  <p className="ml-2 text-sm font-medium">
                    {formatPrice(item.unit_price * item.quantity, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping address */}
          {order.shipping_address && (
            <div className="mt-4 border-t pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Direccion de envio
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {order.shipping_address.first_name}{" "}
                {order.shipping_address.last_name}
              </p>
              <p className="text-sm text-gray-600">
                {order.shipping_address.address_1}
                {order.shipping_address.address_2 &&
                  `, ${order.shipping_address.address_2}`}
              </p>
              <p className="text-sm text-gray-600">
                {order.shipping_address.city},{" "}
                {order.shipping_address.province}{" "}
                {order.shipping_address.postal_code}
              </p>
            </div>
          )}

          {/* Totals */}
          <div className="mt-4 space-y-1 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(order.subtotal, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Envio</span>
              <span>
                {order.shipping_total === 0
                  ? "Gratis"
                  : formatPrice(order.shipping_total, currency)}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total, currency)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<HttpTypes.StoreOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listOrders()
      .then((data) => setOrders(data ?? []))
      .catch(() => setError("No se pudieron cargar los pedidos."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-sicaru-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-sicaru-purple-900 lg:text-3xl">
        Mis Pedidos
      </h1>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg text-gray-600">No tienes pedidos aun.</p>
          <Link
            href="/productos"
            className="mt-6 inline-block rounded-full bg-sicaru-pink px-8 py-3 font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
          >
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
