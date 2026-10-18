"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2X2, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  if (pathname.startsWith("/checkout")) return null;
  const links = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/productos", label: "Catálogo", icon: Grid2X2 },
    { href: "/carrito", label: "Carrito", icon: ShoppingBag },
    { href: "/cuenta", label: "Mi cuenta", icon: UserRound },
  ];
  return <nav aria-label="Navegación principal móvil" className="mobile-bottom-nav md:hidden">
    {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href}
      aria-current={(href === "/" ? pathname === href : pathname.startsWith(href)) ? "page" : undefined}
      className="relative flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] text-sicaru-purple-700 aria-[current=page]:bg-sicaru-purple-100">
      <Icon aria-hidden="true" className="h-5 w-5" />
      {label === "Carrito" && totalItems > 0 && <span className="absolute right-[24%] top-1 rounded-full bg-sicaru-purple-700 px-1 text-[10px] text-white">{totalItems}</span>}
      {label}
    </Link>)}
  </nav>;
}
