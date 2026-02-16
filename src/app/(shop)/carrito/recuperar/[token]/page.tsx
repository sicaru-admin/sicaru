"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createCart } from "@/lib/data/cart"
import { getMexicoRegion } from "@/lib/data/regions"
import { applyPromoCode } from "@/lib/data/checkout"
import { sdk } from "@/lib/medusa"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const CART_ID_KEY = "sicaru_cart_id"

type SnapshotItem = {
  variant_id: string
  title: string
  quantity: number
  unit_price: number
  thumbnail: string | null
}

type RecoveryData = {
  items: SnapshotItem[]
  recovery_code: string | null
  cart_total: number
}

export default function CartRecoveryPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [status, setStatus] = useState<
    "loading" | "restoring" | "error" | "expired"
  >("loading")
  const [items, setItems] = useState<SnapshotItem[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) return

    async function recover() {
      try {
        // Fetch cart snapshot from backend
        const res = await fetch(
          `${MEDUSA_BACKEND_URL}/store/cart-recovery/${token}`
        )

        if (res.status === 410) {
          setStatus("expired")
          return
        }

        if (!res.ok) {
          setStatus("error")
          setError("No pudimos encontrar tu carrito.")
          return
        }

        const data: RecoveryData = await res.json()
        setItems(data.items)
        setStatus("restoring")

        // Create a new cart
        const region = await getMexicoRegion()
        if (!region) {
          setStatus("error")
          setError("Error al crear carrito.")
          return
        }

        const newCart = await createCart(region.id)
        localStorage.setItem(CART_ID_KEY, newCart.id)

        // Add each item to the new cart
        for (const item of data.items) {
          try {
            await sdk.store.cart.createLineItem(newCart.id, {
              variant_id: item.variant_id,
              quantity: item.quantity,
            })
          } catch {
            // Skip items that may no longer be available
          }
        }

        // Apply recovery discount code if present
        if (data.recovery_code) {
          try {
            await applyPromoCode(newCart.id, data.recovery_code)
          } catch {
            // Non-critical — continue without discount
          }
        }

        // Redirect to checkout
        router.push("/checkout")
      } catch {
        setStatus("error")
        setError("Ocurrio un error al recuperar tu carrito.")
      }
    }

    recover()
  }, [token, router])

  if (status === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-6xl">⏰</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Enlace expirado
          </h1>
          <p className="text-gray-600">
            Este enlace de recuperacion ya no esta disponible. Pero no te
            preocupes, puedes armar tu carrito de nuevo.
          </p>
          <a
            href="/productos"
            className="inline-block bg-sicaru-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sicaru-purple-700 transition-colors"
          >
            Ver productos
          </a>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Algo salio mal
          </h1>
          <p className="text-gray-600">{error}</p>
          <a
            href="/productos"
            className="inline-block bg-sicaru-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sicaru-purple-700 transition-colors"
          >
            Ir a la tienda
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="animate-spin h-10 w-10 border-4 border-sicaru-purple-600 border-t-transparent rounded-full mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">
          {status === "loading"
            ? "Recuperando tu carrito..."
            : "Agregando productos..."}
        </h1>
        {items.length > 0 && (
          <ul className="text-left space-y-2 bg-gray-50 rounded-lg p-4">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Cantidad: {item.quantity}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-gray-500">
          Te redirigiremos al checkout en un momento...
        </p>
      </div>
    </div>
  )
}
