import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type MercadoPagoMode =
  | "TEST"
  | "APP_USR"
  | "NO_CONFIGURADA"
  | "FORMATO_DESCONOCIDO";

function getMercadoPagoMode(): MercadoPagoMode {
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

  if (!publicKey) return "NO_CONFIGURADA";
  if (publicKey.startsWith("TEST-")) return "TEST";
  if (publicKey.startsWith("APP_USR-")) return "APP_USR";

  return "FORMATO_DESCONOCIDO";
}

export default function MercadoPagoDiagnosticPage() {
  if (process.env.VERCEL_ENV !== "preview") {
    notFound();
  }

  const mode = getMercadoPagoMode();

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center px-4 py-16">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-sicaru-purple-900">
          Diagnóstico temporal de Mercado Pago
        </h1>

        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">
              Entorno Vercel:
            </span>{" "}
            Preview
          </p>
          <p>
            <span className="font-semibold text-gray-900">
              Clave pública del frontend:
            </span>{" "}
            {mode}
          </p>
        </div>

        <p className="mt-6 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          Esta página no muestra ni almacena credenciales.
        </p>
      </div>
    </main>
  );
}
