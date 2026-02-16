import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programa Salón Pro",
  description:
    "Precios exclusivos de mayoreo para estilistas y salones de belleza. Envío prioritario y asesor dedicado para tu negocio.",
};

export default function SalonProPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Programa Salon Pro
      </h1>

      <div className="rounded-lg border border-gray-200 bg-white p-8 md:p-12">
        <h2 className="text-xl font-semibold text-sicaru-purple-900 mb-4">
          Precios exclusivos para profesionales
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Nuestro programa Salon Pro esta disenado para estilistas, salones de
          belleza y profesionales del cuidado del cabello. Accede a precios
          mayoreo, envio prioritario y atencion personalizada para tu negocio.
        </p>

        <ul className="space-y-3 text-gray-600 mb-8">
          <li className="flex items-start gap-2">
            <span className="mt-1 block h-2 w-2 rounded-full bg-sicaru-pink flex-shrink-0" />
            Precios especiales de mayoreo en todas las marcas
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 block h-2 w-2 rounded-full bg-sicaru-pink flex-shrink-0" />
            Envio prioritario y gratuito en pedidos mayores
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 block h-2 w-2 rounded-full bg-sicaru-pink flex-shrink-0" />
            Asesor dedicado para tu salon
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 block h-2 w-2 rounded-full bg-sicaru-pink flex-shrink-0" />
            Acceso anticipado a nuevos productos y promociones
          </li>
        </ul>

        <a
          href="/contacto"
          className="inline-block rounded-full bg-sicaru-pink px-8 py-3 font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
        >
          Contactanos para mas informacion
        </a>
      </div>
    </div>
  );
}
