"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, isAuthenticated, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const returnTo = searchParams.get("returnTo") || "/cuenta";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(returnTo);
    }
  }, [isLoading, isAuthenticated, router, returnTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(loginEmail, loginPassword);
      router.push(returnTo);
    } catch {
      setError(
        "Correo o contraseña incorrectos. Por favor intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (regPassword !== regConfirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (regPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        email: regEmail,
        password: regPassword,
        first_name: firstName,
        last_name: lastName,
      });
      router.push(returnTo);
    } catch {
      setError(
        "No se pudo crear la cuenta. Es posible que ya exista una cuenta con ese correo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-sicaru-purple-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mx-auto max-w-md">
        {/* Tabs */}
        <div className="mb-8 flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setError(null);
            }}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "login"
                ? "bg-white text-sicaru-purple-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Iniciar Sesion
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setError(null);
            }}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "register"
                ? "bg-white text-sicaru-purple-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electronico
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="tu@email.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <Link
                  href="/cuenta/restablecer"
                  className="text-xs font-medium text-sicaru-pink hover:text-sicaru-pink/80"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Tu contraseña"
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
                  Iniciando sesion...
                </span>
              ) : (
                "Iniciar Sesion"
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="reg-first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  id="reg-first-name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
                />
              </div>
              <div>
                <label
                  htmlFor="reg-last-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apellido
                </label>
                <input
                  id="reg-last-name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tu apellido"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electronico
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="tu@email.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={8}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Minimo 8 caracteres"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="reg-confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar contraseña
              </label>
              <input
                id="reg-confirm-password"
                type="password"
                required
                minLength={8}
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
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
                  Creando cuenta...
                </span>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
