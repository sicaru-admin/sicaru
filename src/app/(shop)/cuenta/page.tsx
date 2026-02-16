import Link from "next/link";

export default function CuentaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Mi Cuenta
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/cuenta/pedidos"
          className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
        >
          <h2 className="text-lg font-semibold text-sicaru-purple-900 group-hover:text-sicaru-pink transition-colors">
            Mis Pedidos
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Consulta el historial y estado de tus pedidos.
          </p>
        </Link>

        <Link
          href="/cuenta/login"
          className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
        >
          <h2 className="text-lg font-semibold text-sicaru-purple-900 group-hover:text-sicaru-pink transition-colors">
            Datos Personales
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Administra tu informacion personal y direcciones.
          </p>
        </Link>
      </div>
    </div>
  );
}
