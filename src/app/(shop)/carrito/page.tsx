"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { CATALOG_MODE } from "@/lib/catalog-mode";
import { useCart } from "@/components/cart/CartProvider";
import { getCartLineVariantLabel } from "@/components/cart/cart-line-variant";
import { formatCurrency, normalizeOrderTotals } from "@/lib/order-totals";

export default function CarritoPage() {
  const { cart, isLoading, updateQuantity, removeFromCart, totalItems, cartError, retryInitializeCart } =
    useCart();
  const totals = normalizeOrderTotals(cart);


  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Tu Carrito
      </h1>

      {cartError && <div role="alert" className="mb-6 rounded-[6px] border border-[#efe7dd] bg-[#f5f1eb] p-4 text-sm text-[#2e2b2b]">
        <p>{cartError}</p>
        {!cart && <button type="button" onClick={() => void retryInitializeCart().catch(() => {})} disabled={isLoading} className="mt-2 min-h-11 text-[#7f6d8a] underline">Intentar de nuevo</button>}
      </div>}
      {isLoading && !cart ? (
        <p className="text-center text-gray-500">Cargando carrito...</p>
      ) : !cart?.items?.length ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500 mb-6">Tu carrito está vacío.</p>
          <Link
            href="/productos"
            className="inline-block rounded-full bg-sicaru-pink px-8 py-3 font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
          >
            Ver Productos
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-8">
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item) => {
                const variantLabel = getCartLineVariantLabel(item);

                return (
                  <li key={item.id} className="flex gap-4 py-6">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
                      />
                    )}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 className="text-sm font-medium text-sicaru-purple-900 sm:text-base">
                        {item.title}
                      </h3>
                      {variantLabel && (
                        <p className="mt-1 text-sm text-gray-500">
                          {variantLabel}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-gray-600">
                        {formatCurrency(item.unit_price)} c/u
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          aria-label={`Reducir cantidad de ${item.title}`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={isLoading || item.quantity <= 1}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                          &minus;
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          aria-label={`Aumentar cantidad de ${item.title}`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={isLoading}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-sicaru-purple-900">
                          {formatCurrency(item.unit_price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={isLoading}
                          className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resumen del carrito */}
          <div className="mt-8 lg:col-span-4 lg:mt-0">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-sicaru-purple-900">
                Resumen del Pedido
              </h2>
              <dl className="mt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <dt>Productos ({totalItems})</dt>
                  <dd>{formatCurrency(totals.products)}</dd>
                </div>
                {(CATALOG_MODE ? totals.itemTaxes : totals.taxes) > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <dt>Impuestos</dt>
                    <dd>{formatCurrency(CATALOG_MODE ? totals.itemTaxes : totals.taxes)}</dd>
                  </div>
                )}
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <dt>Descuento</dt>
                    <dd>-{formatCurrency(totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <dt>Envío</dt><dd>Consultar al continuar</dd>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <dt className="text-base font-semibold text-sicaru-purple-900">
                    {CATALOG_MODE ? "Subtotal de productos" : "Total"}
                  </dt>
                  <dd className="text-base font-bold text-sicaru-purple-900">
                    {formatCurrency(CATALOG_MODE ? Math.max(0, totals.products + totals.itemTaxes - totals.discount) : totals.total)}
                  </dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-full bg-sicaru-pink py-3 text-center text-lg font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
              >
                Continuar al envío
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
