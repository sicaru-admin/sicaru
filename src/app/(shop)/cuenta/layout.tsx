"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  ShoppingBag,
  User,
  MapPin,
  LayoutDashboard,
  LogOut,
  Gift,
} from "lucide-react";

const navItems = [
  { href: "/cuenta", label: "Mi Cuenta", icon: LayoutDashboard },
  { href: "/cuenta/pedidos", label: "Mis Pedidos", icon: ShoppingBag },
  { href: "/cuenta/recompensas", label: "Recompensas", icon: Gift },
  { href: "/cuenta/perfil", label: "Perfil", icon: User },
  { href: "/cuenta/direcciones", label: "Direcciones", icon: MapPin },
];

// These routes don't require authentication
const PUBLIC_ROUTES = ["/cuenta/login", "/cuenta/restablecer"];

function AccountNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <nav className="sticky top-24 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/cuenta"
                ? pathname === "/cuenta"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sicaru-purple-50 text-sicaru-purple-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesion
          </button>
        </nav>
      </aside>

      {/* Mobile horizontal tabs */}
      <div className="mb-6 overflow-x-auto lg:hidden">
        <div className="flex gap-2 pb-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/cuenta"
                ? pathname === "/cuenta"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sicaru-purple-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </div>
    </>
  );
}

export default function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="flex gap-8">
          <AccountNav />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
