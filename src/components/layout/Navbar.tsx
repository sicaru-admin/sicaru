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

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`navbar-glass sticky top-0 z-30 border-b transition-all duration-300 ${
        scrolled ? "scrolled border-[#efe7dd]" : "border-[#efe7dd]/70"
      }`}
    >
      <div className="bg-[#7f6d8a] text-[#faf8f5]">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-1.5 text-center text-[11px] font-medium leading-5 sm:px-6 md:justify-between md:text-xs">
          <span>Asesoría personalizada en productos profesionales de belleza</span>
          <span className="hidden md:block">Cadereyta Jiménez, Nuevo León</span>
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-6">
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
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition-colors hover:text-[#7f6d8a] ${
                  isActive ? "text-[#7f6d8a]" : "text-[#2e2b2b]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-center bg-[#7f6d8a] transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 text-[#2e2b2b]">
          <a
            href="https://wa.me/528281111023?text=Hola%2C%20quiero%20asesor%C3%ADa%20para%20elegir%20productos%20Sicar%C3%BA."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-[6px] px-2.5 py-2 text-sm font-medium text-[#7f6d8a] transition-colors hover:bg-[#efe7dd] lg:inline-flex"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
            WhatsApp
          </a>
          <SearchButton />
          <AccountButton />
          <CartButton />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
