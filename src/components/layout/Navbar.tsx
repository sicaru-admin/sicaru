"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { CartButton } from "./CartButton";
import { AccountButton } from "./AccountButton";
import { SearchButton } from "@/components/search/SearchButton";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/marcas", label: "Marcas" },
  { href: "/salon-pro", label: "Salón Pro" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

const productMenu = [
  { href: "/categorias/color-y-tintes", label: "Coloración profesional" },
  { href: "/categorias/tratamientos-y-mascarillas", label: "Tratamientos capilares" },
  { href: "/categorias/shampoo-y-acondicionador", label: "Hidratación y cuidado" },
  { href: "/categorias/herramientas-pro", label: "Herramientas y accesorios" },
  { href: "/productos?buscar=depilacion", label: "Depilación" },
  { href: "/salon-pro", label: "Productos para estilistas" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-30">
      <div className="bg-[#7f6d8a] px-4 py-2 text-center text-xs font-medium text-[#faf8f5] sm:text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 sm:justify-between">
          <span>Asesoría personalizada en productos profesionales de belleza</span>
          <span className="hidden sm:inline">
            Tienda física en Cadereyta Jiménez, Nuevo León
          </span>
        </div>
      </div>
      <nav
        className={`navbar-glass border-b transition-all duration-300 ${
          scrolled ? "scrolled border-[#efe7dd]" : "border-[#efe7dd]/80"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="relative block h-11 w-[116px] shrink-0 md:h-12 md:w-[128px]"
            aria-label="Sicarú, inicio"
          >
            <Image
              src="/brand/logo-violet.png"
              alt="Sicarú Productos de Belleza"
              fill
              priority
              sizes="128px"
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              if (link.href === "/productos") {
                return (
                  <div key={link.href} className="group relative py-2">
                    <Link
                      href={link.href}
                      className={`relative text-sm font-medium transition-colors ${
                        active
                          ? "text-[#7f6d8a]"
                          : "text-[#2e2b2b] hover:text-[#7f6d8a]"
                      }`}
                    >
                      {link.label}
                      <span
                        className={`absolute inset-x-0 -bottom-3 h-px bg-[#7f6d8a] transition-opacity ${
                          active ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </Link>
                    <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 border border-[#efe7dd] bg-[#faf8f5] p-2 opacity-0 shadow-[0_18px_45px_rgba(46,43,43,0.08)] transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                      {productMenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-[6px] px-3 py-2.5 text-sm text-[#2e2b2b] transition-colors hover:bg-[#efe7dd] hover:text-[#7f6d8a]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-[#7f6d8a]"
                      : "text-[#2e2b2b] hover:text-[#7f6d8a]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-px bg-[#7f6d8a] transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 text-[#2e2b2b]">
            <a
              href="https://wa.me/528281111023?text=Hola%2C%20quiero%20asesor%C3%ADa%20para%20comprar%20productos%20Sicar%C3%BA."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-2 rounded-[6px] border border-[#7f6d8a]/30 px-3 text-xs font-semibold text-[#7f6d8a] transition-colors hover:bg-[#efe7dd] lg:flex"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.7} />
              WhatsApp
            </a>
            <SearchButton />
            <AccountButton />
            <CartButton />
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
}
