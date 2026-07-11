"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { User, LogOut, ShoppingBag, ChevronDown } from "lucide-react";

export function AccountButton() {
  const { customer, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    window.location.href = "/";
  };

  if (!isAuthenticated) {
    return (
      <Link
        href="/cuenta/login"
        className="hidden h-10 w-10 items-center justify-center rounded-[6px] text-[#2e2b2b] transition-colors hover:bg-[#efe7dd] hover:text-[#7f6d8a] md:flex"
        aria-label="Iniciar sesión"
      >
        <User className="h-5 w-5" strokeWidth={1.5} />
      </Link>
    );
  }

  const initial = customer?.first_name?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative hidden md:block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-[6px] text-[#2e2b2b] transition-colors hover:bg-[#efe7dd] hover:text-[#7f6d8a]"
        aria-label="Mi cuenta"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#efe7dd] text-xs font-semibold text-[#2e2b2b]">
          {initial}
        </span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-[8px] border border-[#efe7dd] bg-[#faf8f5] py-1">
          <div className="border-b border-[#efe7dd] px-4 py-3">
            <p className="text-sm font-medium text-[#2e2b2b]">
              {customer?.first_name} {customer?.last_name}
            </p>
            <p className="truncate text-xs text-[#2e2b2b]/55">
              {customer?.email}
            </p>
          </div>
          <Link
            href="/cuenta"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2e2b2b] hover:bg-[#efe7dd]"
          >
            <User className="h-4 w-4" />
            Mi cuenta
          </Link>
          <Link
            href="/cuenta/pedidos"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2e2b2b] hover:bg-[#efe7dd]"
          >
            <ShoppingBag className="h-4 w-4" />
            Mis pedidos
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 border-t border-[#efe7dd] px-4 py-2.5 text-sm text-[#2e2b2b] hover:bg-[#efe7dd]"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
