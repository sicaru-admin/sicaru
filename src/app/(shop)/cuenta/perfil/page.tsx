"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { updateCustomer } from "@/lib/data/customer";
import { Check } from "lucide-react";

export default function PerfilPage() {
  const { customer, refreshCustomer } = useAuth();

  const [firstName, setFirstName] = useState(customer?.first_name || "");
  const [lastName, setLastName] = useState(customer?.last_name || "");
  const [phone, setPhone] = useState(customer?.phone || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await updateCustomer({
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
      });
      await refreshCustomer();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("No se pudo actualizar tu perfil. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-sicaru-purple-900 lg:text-3xl">
        Perfil
      </h1>

      <div className="max-w-lg rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="profile-first-name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                id="profile-first-name"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
              />
            </div>
            <div>
              <label
                htmlFor="profile-last-name"
                className="block text-sm font-medium text-gray-700"
              >
                Apellido
              </label>
              <input
                id="profile-last-name"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electronico
            </label>
            <input
              id="profile-email"
              type="email"
              value={customer?.email || ""}
              disabled
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              El correo no se puede cambiar.
            </p>
          </div>

          <div>
            <label
              htmlFor="profile-phone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefono
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10 digitos"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              <Check className="h-4 w-4" />
              Perfil actualizado correctamente.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-sicaru-purple-700 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-sicaru-purple-600 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Guardando...
              </span>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
