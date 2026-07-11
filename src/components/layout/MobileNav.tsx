"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Menu, X } from "lucide-react";

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
        className="flex h-10 w-10 items-center justify-center rounded-[6px] text-[#2e2b2b] transition-colors hover:bg-[#efe7dd] hover:text-[#7f6d8a]"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" strokeWidth={1.7} />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-[#2e2b2b]/45"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-[min(20rem,86vw)] border-r border-[#efe7dd] bg-[#faf8f5]">
            <div className="flex items-center justify-between border-b border-[#efe7dd] px-5 py-4">
              <div className="relative h-12 w-28">
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
                className="flex h-10 w-10 items-center justify-center rounded-[6px] text-[#7f6d8a] hover:bg-[#efe7dd]"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" strokeWidth={1.7} />
              </button>
            </div>

            {/* Auth section */}
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

            <nav className="px-5 py-5">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-[6px] px-3 py-3 text-base font-medium text-[#2e2b2b] transition-colors hover:bg-[#efe7dd] hover:text-[#7f6d8a]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {/* Auth links */}
                <li className="mt-3 border-t border-[#efe7dd] pt-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/cuenta"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-[6px] px-3 py-3 text-base font-medium text-[#2e2b2b] transition-colors hover:bg-[#efe7dd] hover:text-[#7f6d8a]"
                      >
                        Mi cuenta
                      </Link>
                      <Link
                        href="/cuenta/pedidos"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-[6px] px-3 py-3 text-base font-medium text-[#2e2b2b] transition-colors hover:bg-[#efe7dd] hover:text-[#7f6d8a]"
                      >
                        Mis pedidos
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full rounded-[6px] px-3 py-3 text-left text-base font-medium text-[#2e2b2b] transition-colors hover:bg-[#efe7dd] hover:text-[#7f6d8a]"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/cuenta/login"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-[6px] border border-[#7f6d8a] px-3 py-3 text-base font-semibold text-[#7f6d8a] transition-colors hover:bg-[#efe7dd]"
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
