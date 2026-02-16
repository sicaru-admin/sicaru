"use client";

import { useCart } from "./CartProvider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

export function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    isLoading,
    totalItems,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-4">
            <h2 className="text-lg font-semibold text-sicaru-purple-900">
              Tu Carrito ({totalItems})
            </h2>
            <button
              onClick={closeCart}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Cerrar carrito"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {!cart?.items?.length ? (
              <p className="py-8 text-center text-gray-500">
                Tu carrito est&aacute; vac&iacute;o
              </p>
            ) : (
              <ul className="space-y-4">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <PriceDisplay amount={item.unit_price} className="text-sm text-gray-600" />
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={isLoading || item.quantity <= 1}
                          className="flex h-8 w-8 items-center justify-center rounded-full border text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                          &minus;
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={isLoading}
                          className="flex h-8 w-8 items-center justify-center rounded-full border text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={isLoading}
                          className="ml-auto text-sm text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {cart?.items?.length ? (
            <div className="border-t px-4 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <PriceDisplay
                  amount={cart.total}
                  className="text-lg font-bold text-sicaru-purple-900"
                />
              </div>
              <a
                href="/carrito"
                className="mb-2 block w-full rounded-full border border-sicaru-purple-900 py-3 text-center font-semibold text-sicaru-purple-900 transition-colors hover:bg-sicaru-purple-50"
              >
                Ver Carrito
              </a>
              <a
                href="/checkout"
                className="block w-full rounded-full bg-sicaru-pink py-3 text-center font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
              >
                Proceder al Pago
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
