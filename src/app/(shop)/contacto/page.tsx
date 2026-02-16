import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contáctanos",
  description:
    "Comunícate con Distribuidora Sicarú por WhatsApp o correo electrónico. Atención de lunes a sábado de 9:00 a 19:00.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Contactanos
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-sicaru-purple-900 mb-4">
            WhatsApp
          </h2>
          <p className="text-gray-600 mb-4">
            Escribenos por WhatsApp para atencion inmediata. Estamos disponibles
            de lunes a sabado.
          </p>
          <a
            href="https://wa.me/528281111023"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-green-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-600"
          >
            Escribir por WhatsApp
          </a>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-sicaru-purple-900 mb-4">
            Correo Electronico
          </h2>
          <p className="text-gray-600 mb-4">
            Envianos un correo y te responderemos a la brevedad.
          </p>
          <a
            href="mailto:contacto@sicaru.com"
            className="inline-block rounded-full border border-sicaru-purple-900 px-8 py-3 font-semibold text-sicaru-purple-900 transition-colors hover:bg-sicaru-purple-50"
          >
            contacto@sicaru.com
          </a>
        </div>
      </div>
    </div>
  );
}
