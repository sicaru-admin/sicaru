import Link from "next/link";
import { CartButton } from "./CartButton";
import { MobileNav } from "./MobileNav";
import { SearchButton } from "@/components/search/SearchButton";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-sicaru-purple-900 md:text-2xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Sicar&uacute;
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

        {/* Right side: Search + Account + Cart + Mobile menu */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <SearchButton />

          {/* Account */}
          <Link
            href="/cuenta"
            className="hidden text-gray-700 hover:text-sicaru-purple-600 md:block"
            aria-label="Mi cuenta"
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
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>

          {/* Cart */}
          <CartButton />

          {/* Mobile hamburger */}
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
