"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/marcas", label: "Marcas" },
  { href: "/categorias", label: "Categor\u00edas" },
  { href: "/salon-pro", label: "Sal\u00f3n Pro" },
  { href: "/blog", label: "Blog" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { customer, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-700 hover:text-sicaru-purple-600"
        aria-label="Abrir men\u00fa"
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[#faf8f5] shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <div className="relative h-16 w-28">
                <Image
                  src="/brand/logo-violet.png"
                  alt="Sicarú Productos de Belleza"
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Cerrar men\u00fa"
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

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="border-b px-4 py-3">
                <p className="text-sm font-semibold text-sicaru-purple-900">
                  Hola, {customer?.first_name || "Usuario"}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {customer?.email}
                </p>
              </div>
            ) : null}

            <nav className="px-4 py-4">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-sicaru-purple-50 hover:text-sicaru-purple-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {/* Auth links */}
                <li className="border-t pt-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/cuenta"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-sicaru-purple-50 hover:text-sicaru-purple-900"
                      >
                        Mi Cuenta
                      </Link>
                      <Link
                        href="/cuenta/pedidos"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-sicaru-purple-50 hover:text-sicaru-purple-900"
                      >
                        Mis Pedidos
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full rounded-lg px-4 py-3 text-left text-base font-medium text-gray-700 transition-colors hover:bg-sicaru-purple-50 hover:text-sicaru-purple-900"
                      >
                        Cerrar Sesion
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/cuenta/login"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-sicaru-pink transition-colors hover:bg-sicaru-purple-50"
                    >
                      Iniciar Sesion
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
