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
      className={`navbar-glass sticky top-0 z-30 border-b transition-all duration-300 ${
        scrolled ? "scrolled border-[#efe7dd]" : "border-[#efe7dd]/70"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
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
          <Link
            href="/productos"
            className="text-sm font-medium text-[#2e2b2b] transition-colors hover:text-[#7f6d8a]"
          >
            Productos
          </Link>
          <Link
            href="/marcas"
            className="text-sm font-medium text-[#2e2b2b] transition-colors hover:text-[#7f6d8a]"
          >
            Marcas
          </Link>
          <Link
            href="/salon-pro"
            className="text-sm font-medium text-[#2e2b2b] transition-colors hover:text-[#7f6d8a]"
          >
            Sal&oacute;n Pro
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-[#2e2b2b] transition-colors hover:text-[#7f6d8a]"
          >
            Blog
          </Link>
          <Link
            href="/contacto"
            className="text-sm font-medium text-[#2e2b2b] transition-colors hover:text-[#7f6d8a]"
          >
            Contacto
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 text-[#2e2b2b]">
          <SearchButton />
          <AccountButton />
          <CartButton />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
