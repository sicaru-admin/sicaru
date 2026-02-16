"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ShoppingBag, MessageCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export const dynamic = "force-dynamic";

type PaymentSessionData = {
  payment_method_id?: string;
  voucher_url?: string;
  barcode?: string;
  reference?: string;
  expiration_date?: string;
};

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
      data?: PaymentSessionData;
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
  const { isAuthenticated, register } = useAuth();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [createAccountPassword, setCreateAccountPassword] = useState("");
  const [accountCreating, setAccountCreating] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

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

  // Find OXXO payment session data (if any)
  const oxxoSession = order.payment_collections
    ?.flatMap((pc) => pc.payment_sessions ?? [])
    .find((s) => s.data?.payment_method_id === "oxxo");
  const isOxxoPayment = !!oxxoSession;
  const oxxoData = oxxoSession?.data;

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

      {/* OXXO payment: show voucher instructions */}
      {isOxxoPayment && (
        <div className="mb-8 rounded-lg border-2 border-amber-300 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-amber-800">
            Tu pedido está pendiente de pago
          </h2>
          <p className="mt-2 text-sm text-amber-700">
            Acude a cualquier tienda OXXO y realiza el pago con los siguientes
            datos:
          </p>

          <div className="mt-4 space-y-3">
            {oxxoData?.reference && (
              <div className="rounded-md bg-white p-3">
                <p className="text-xs font-medium uppercase text-gray-500">
                  Referencia de pago
                </p>
                <p className="mt-1 font-mono text-lg font-bold text-amber-900">
                  {oxxoData.reference}
                </p>
              </div>
            )}

            <div className="rounded-md bg-white p-3">
              <p className="text-xs font-medium uppercase text-gray-500">
                Monto a pagar
              </p>
              <p className="mt-1 text-lg font-bold text-amber-900">
                {formatPrice(order.total, currency)}
              </p>
            </div>

            {oxxoData?.expiration_date && (
              <div className="rounded-md bg-white p-3">
                <p className="text-xs font-medium uppercase text-gray-500">
                  Fecha límite de pago
                </p>
                <p className="mt-1 font-medium text-amber-900">
                  {new Intl.DateTimeFormat("es-MX", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(new Date(oxxoData.expiration_date))}
                </p>
              </div>
            )}
          </div>

          {oxxoData?.voucher_url && (
            <a
              href={oxxoData.voucher_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full bg-amber-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
            >
              Descargar voucher de pago
            </a>
          )}

          <p className="mt-4 text-xs text-amber-600">
            Pedido #{order.display_id ?? order.id.slice(-8).toUpperCase()}
          </p>
        </div>
      )}

      {/* Card payment success */}
      {!isOxxoPayment && (
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

      {/* Guest account creation */}
      {!isAuthenticated && order.email && !accountCreated && (
        <div className="mt-6 rounded-lg border bg-white p-6">
          <h2 className="mb-2 text-sm font-semibold text-sicaru-purple-900">
            ¿Quieres crear una cuenta?
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Crea una cuenta para ver tu historial de pedidos y agilizar futuras
            compras.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (createAccountPassword.length < 8) {
                setAccountError(
                  "La contraseña debe tener al menos 8 caracteres."
                );
                return;
              }
              setAccountCreating(true);
              setAccountError(null);
              try {
                await register({
                  email: order.email!,
                  password: createAccountPassword,
                  first_name:
                    order.shipping_address?.first_name || "",
                  last_name:
                    order.shipping_address?.last_name || "",
                });
                setAccountCreated(true);
              } catch {
                setAccountError(
                  "No se pudo crear la cuenta. Es posible que ya exista una cuenta con ese correo."
                );
              } finally {
                setAccountCreating(false);
              }
            }}
            className="flex gap-3"
          >
            <input
              type="password"
              required
              minLength={8}
              value={createAccountPassword}
              onChange={(e) => setCreateAccountPassword(e.target.value)}
              placeholder="Elige una contraseña (min. 8 caracteres)"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
            />
            <button
              type="submit"
              disabled={accountCreating}
              className="shrink-0 rounded-full bg-sicaru-purple-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sicaru-purple-800 disabled:opacity-50"
            >
              {accountCreating ? "Creando..." : "Crear Cuenta"}
            </button>
          </form>
          {accountError && (
            <p className="mt-2 text-sm text-red-600">{accountError}</p>
          )}
        </div>
      )}

      {accountCreated && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm text-green-700">
          ¡Cuenta creada exitosamente! Ya puedes acceder a tu{" "}
          <Link href="/cuenta" className="font-medium underline">
            panel de cuenta
          </Link>
          .
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
