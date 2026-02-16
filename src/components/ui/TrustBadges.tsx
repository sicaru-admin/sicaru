export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      {/* Payment methods */}
      <div className="flex items-center gap-2">
        <span className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600">
          VISA
        </span>
        <span className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600">
          MC
        </span>
        <span className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600">
          OXXO
        </span>
        <span className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600">
          MercadoPago
        </span>
      </div>

      {/* Divider */}
      <div className="hidden h-6 w-px bg-gray-300 sm:block" />

      {/* Trust indicators */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>SSL Seguro</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-sicaru-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>Distribuidor Autorizado</span>
        </div>
      </div>
    </div>
  );
}
