"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartButton } from "./CartButton";
import { AccountButton } from "./AccountButton";
import { Search } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { BrandWordmark } from "./BrandWordmark";

const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/marcas", label: "Marcas" },
  { href: "/salon-pro", label: "Salón Pro" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sicaru-navbar sticky top-0 z-30">
      <div className="hidden bg-[#7f6d8a] text-[#faf8f5] md:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-3 px-5 py-2 text-center text-[0.68rem] font-medium uppercase tracking-[0.1em] sm:px-8 lg:px-10 md:justify-between md:text-xs">
          <span>Tienda de productos profesionales de belleza</span>
          <span className="hidden md:inline">Cadereyta Jiménez, Nuevo León</span>
        </div>
      </div>

      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3 sm:px-8 lg:px-10 md:py-4">
        <BrandWordmark className="shrink-0" />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`sicaru-navbar-link ${active ? "sicaru-navbar-link-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 text-[#2e2b2b] sm:gap-2">
          <Link href="/productos" aria-label="Buscar productos" className="sicaru-nav-icon-button hidden md:flex"><Search aria-hidden="true" className="h-5 w-5"/></Link>
          <span className="hidden md:inline"><AccountButton /></span>
          <span className="hidden md:inline"><CartButton /></span>
          <MobileNav />
        </div>
      </nav>
      <form role="search" action="/productos" className="mx-4 flex min-h-11 items-center overflow-hidden rounded-md border border-sicaru-purple-200 bg-white md:hidden">
        <label htmlFor="header-search" className="sr-only">Buscar producto, marca o tono</label><input id="header-search" type="search" name="q" placeholder="Producto, marca o tono" className="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none"/>
        <button type="submit" aria-label="Buscar" className="flex h-11 w-11 items-center justify-center text-sicaru-purple-700"><Search aria-hidden="true" className="h-5 w-5"/></button>
      </form><div className="h-3 md:hidden"/>

    </header>
  );
}

