"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartButton } from "./CartButton";
import { AccountButton } from "./AccountButton";
import { SearchButton } from "@/components/search/SearchButton";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-all duration-300 navbar-glass ${
        scrolled ? "scrolled border-gray-200/60" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="relative block h-12 w-[120px] shrink-0 md:h-14 md:w-[140px]"
          aria-label="Sicarú, inicio"
        >
          <Image
            src="/brand/logo-violet.png"
            alt="Sicarú Productos de Belleza"
            fill
            priority
            sizes="140px"
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/productos"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-sicaru-purple-600"
          >
            Productos
          </Link>
          <Link
            href="/marcas"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-sicaru-purple-600"
          >
            Marcas
          </Link>
          <Link
            href="/salon-pro"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-sicaru-purple-600"
          >
            Sal&oacute;n Pro
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-sicaru-purple-600"
          >
            Blog
          </Link>
          <Link
            href="/contacto"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-sicaru-purple-600"
          >
            Contacto
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <SearchButton />
          <AccountButton />
          <CartButton />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
