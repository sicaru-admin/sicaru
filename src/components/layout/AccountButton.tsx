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
        className="hidden text-gray-700 hover:text-sicaru-purple-600 md:block"
        aria-label="Iniciar sesion"
      >
        <User className="h-6 w-6" strokeWidth={1.5} />
      </Link>
    );
  }

  const initial = customer?.first_name?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative hidden md:block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-gray-700 hover:text-sicaru-purple-600"
        aria-label="Mi cuenta"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sicaru-purple-100 text-xs font-bold text-sicaru-purple-900">
          {initial}
        </span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border bg-white py-1 shadow-lg">
          <div className="border-b px-4 py-2">
            <p className="text-sm font-medium text-gray-900">
              {customer?.first_name} {customer?.last_name}
            </p>
            <p className="truncate text-xs text-gray-500">
              {customer?.email}
            </p>
          </div>
          <Link
            href="/cuenta"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <User className="h-4 w-4" />
            Mi Cuenta
          </Link>
          <Link
            href="/cuenta/pedidos"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <ShoppingBag className="h-4 w-4" />
            Mis Pedidos
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 border-t px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesion
          </button>
        </div>
      )}
    </div>
  );
}
