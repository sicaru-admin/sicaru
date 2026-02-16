"use client";

import { useState } from "react";

type ContactFormProps = {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
};

export function ContactForm({
  email,
  onEmailChange,
  onSubmit,
  isLoading,
}: ContactFormProps) {
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("El correo electrónico es obligatorio");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="checkout-email"
          className="block text-sm font-medium text-gray-700"
        >
          Correo electrónico
        </label>
        <input
          id="checkout-email"
          type="email"
          value={email}
          onChange={(e) => {
            onEmailChange(e.target.value);
            if (error) setError("");
          }}
          placeholder="tu@correo.com"
          autoComplete="email"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
        />
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
      <p className="text-xs text-gray-500">
        Enviaremos la confirmación de tu pedido a este correo.
      </p>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-sicaru-pink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:opacity-50"
      >
        {isLoading ? "Guardando..." : "Continuar"}
      </button>
    </form>
  );
}
