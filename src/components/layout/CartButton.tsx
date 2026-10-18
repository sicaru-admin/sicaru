"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
export function CartButton() {
  const { totalItems } = useCart();
  return <Link href="/carrito" aria-label={`Ver carrito${totalItems ? `, ${totalItems} productos` : ""}`} className="sicaru-nav-icon-button relative">
    <ShoppingBag aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
    {totalItems > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-sicaru-purple-700 px-1.5 text-xs text-white">{totalItems}</span>}
  </Link>;
}

