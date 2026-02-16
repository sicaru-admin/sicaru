"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/data/customer";

export default function RestablecerPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
    } catch {
      // Don't reveal if the email exists or not
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-center text-2xl font-bold text-sicaru-purple-900">
          Restablecer Contraseña
        </h1>
        <p className="mb-8 text-center text-sm text-gray-600">
          Ingresa tu correo electronico y te enviaremos un enlace para
          restablecer tu contraseña.
        </p>

        {isSubmitted ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm text-green-700">
              Si existe una cuenta con ese correo, recibiras un enlace para
              restablecer tu contraseña.
            </div>
            <Link
              href="/cuenta/login"
              className="block text-center text-sm font-medium text-sicaru-pink hover:text-sicaru-pink/80"
            >
              Volver a iniciar sesion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electronico
              </label>
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-sicaru-pink px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Enviando...
                </span>
              ) : (
                "Enviar Enlace"
              )}
            </button>

            <Link
              href="/cuenta/login"
              className="block text-center text-sm font-medium text-sicaru-pink hover:text-sicaru-pink/80"
            >
              Volver a iniciar sesion
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
