"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { ShoppingBag, User, MapPin, Gift } from "lucide-react";

const quickLinks = [
  {
    href: "/cuenta/pedidos",
    label: "Mis Pedidos",
    description: "Consulta el historial y estado de tus pedidos.",
    icon: ShoppingBag,
  },
  {
    href: "/cuenta/recompensas",
    label: "Mis Recompensas",
    description: "Consulta tus puntos y canjea recompensas.",
    icon: Gift,
  },
  {
    href: "/cuenta/perfil",
    label: "Perfil",
    description: "Administra tu informacion personal.",
    icon: User,
  },
  {
    href: "/cuenta/direcciones",
    label: "Direcciones",
    description: "Gestiona tus direcciones de envio.",
    icon: MapPin,
  },
];

export default function CuentaPage() {
  const { customer } = useAuth();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-sicaru-purple-900 lg:text-3xl">
        Hola, {customer?.first_name || "Usuario"}
      </h1>
      <p className="mb-8 text-gray-600">
        Bienvenido a tu cuenta. Aqui puedes gestionar tus pedidos, perfil y
        direcciones.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-sicaru-purple-50 text-sicaru-purple-600 transition-colors group-hover:bg-sicaru-purple-100">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-sicaru-purple-900 transition-colors group-hover:text-sicaru-pink">
                {link.label}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{link.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
