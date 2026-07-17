"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartButton } from "./CartButton";
import { AccountButton } from "./AccountButton";
import { SearchButton } from "@/components/search/SearchButton";
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
      <div className="bg-[#7f6d8a] text-[#faf8f5]">
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
          <SearchButton />
          <AccountButton />
          <CartButton />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
