"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export default function CarritoPage() {
  const { cart, isLoading, updateQuantity, removeFromCart, totalItems } =
    useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Tu Carrito
      </h1>

      {isLoading && !cart ? (
        <p className="text-center text-gray-500">Cargando carrito...</p>
      ) : !cart?.items?.length ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500 mb-6">Tu carrito esta vacio.</p>
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
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-6">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
                    />
                  )}
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-sm font-medium text-sicaru-purple-900 sm:text-base">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      ${item.unit_price.toFixed(2)} MXN c/u
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={isLoading || item.quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50"
                      >
                        &minus;
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={isLoading}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-sicaru-purple-900">
                        ${(item.unit_price * item.quantity).toFixed(2)} MXN
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
              ))}
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
                  <dt>Articulos ({totalItems})</dt>
                  <dd>${cart.subtotal.toFixed(2)} MXN</dd>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <dt className="text-base font-semibold text-sicaru-purple-900">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-sicaru-purple-900">
                    ${cart.total.toFixed(2)} MXN
                  </dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-full bg-sicaru-pink py-3 text-center text-lg font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
              >
                Proceder al Pago
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
