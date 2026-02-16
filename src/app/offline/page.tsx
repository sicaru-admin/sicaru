"use client"

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sicaru-purple-100">
        <svg
          className="h-10 w-10 text-sicaru-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h1
        className="mb-3 text-2xl font-bold text-sicaru-purple-900"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Sin Conexión
      </h1>
      <p className="mb-8 max-w-md text-gray-600">
        Parece que no tienes conexión a internet. Verifica tu conexión e intenta
        de nuevo.
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-sicaru-pink px-8 py-3 font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
        >
          Intentar de Nuevo
        </button>
        <a
          href="https://wa.me/528281111023"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  )
}
