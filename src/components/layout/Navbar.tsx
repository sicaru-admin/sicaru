"use client";
import { CATALOG_MODE } from "@/lib/catalog-mode";

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
  { href: "/nosotros", label: "SICARÚ" },
  { href: "/contacto", label: "Contacto" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sicaru-navbar sticky top-0 z-30">
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
          {!CATALOG_MODE && <AccountButton />}
          <CartButton />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
