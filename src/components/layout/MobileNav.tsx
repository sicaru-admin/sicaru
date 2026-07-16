"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Menu, X } from "lucide-react";
import { BrandWordmark } from "./BrandWordmark";

const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/marcas", label: "Marcas" },
  { href: "/categorias", label: "Categorías" },
  { href: "/salon-pro", label: "Salón Pro" },
  { href: "/blog", label: "Blog" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { customer, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="sicaru-nav-icon-button"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" strokeWidth={1.7} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-[#2e2b2b]/48"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 z-50 flex w-[min(21rem,88vw)] flex-col border-r border-[#efe7dd] bg-[#faf8f5]">
            <div className="h-1.5 bg-[#7f6d8a]" />
            <div className="flex items-center justify-between border-b border-[#efe7dd] px-5 py-4">
              <BrandWordmark className="text-[1.75rem]" />
              <button
                onClick={() => setIsOpen(false)}
                className="sicaru-nav-icon-button"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" strokeWidth={1.7} />
              </button>
            </div>

            {isAuthenticated ? (
              <div className="border-b border-[#efe7dd] px-5 py-4">
                <p className="text-sm font-semibold text-[#2e2b2b]">
                  Hola, {customer?.first_name || "Usuario"}
                </p>
                <p className="truncate text-xs text-[#2e2b2b]/55">
                  {customer?.email}
                </p>
              </div>
            ) : null}

            <nav className="flex-1 overflow-y-auto px-5 py-5">
              <ul className="space-y-1">
                {navLinks.map((link) => {
                  const active = isActivePath(pathname, link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`sicaru-mobile-nav-link ${active ? "sicaru-mobile-nav-link-active" : ""}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}

                <li className="mt-4 border-t border-[#efe7dd] pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/cuenta"
                        onClick={() => setIsOpen(false)}
                        className={`sicaru-mobile-nav-link ${isActivePath(pathname, "/cuenta") ? "sicaru-mobile-nav-link-active" : ""}`}
                      >
                        Mi cuenta
                      </Link>
                      <Link
                        href="/cuenta/pedidos"
                        onClick={() => setIsOpen(false)}
                        className={`sicaru-mobile-nav-link ${isActivePath(pathname, "/cuenta/pedidos") ? "sicaru-mobile-nav-link-active" : ""}`}
                      >
                        Mis pedidos
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="sicaru-mobile-nav-link w-full text-left"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/cuenta/login"
                      onClick={() => setIsOpen(false)}
                      className={`sicaru-mobile-nav-link ${isActivePath(pathname, "/cuenta/login") ? "sicaru-mobile-nav-link-active" : ""}`}
                    >
                      Iniciar sesión
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
