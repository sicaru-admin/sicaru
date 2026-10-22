import type { Metadata } from "next";
import { ParcelQuoteNotice } from "@/components/checkout/ParcelQuoteNotice";
export const metadata: Metadata = {title: "Envíos y entregas", description: "Paquetería con cobertura y costo confirmados antes de pagar."};
export default function EnviosPage() {
  return <div className="mx-auto max-w-2xl space-y-6 px-4 py-7"><h1 className="text-3xl">Envíos y entregas</h1>
    <section><h2 className="text-xl">Paquetería</h2><p className="mt-2 text-sm leading-6 text-gray-600">En la tienda online ofrecemos únicamente paquetería con cobertura y cotización verificadas. El costo incluye IVA y se confirma antes de iniciar cualquier pago.</p>
      <p className="mt-2 text-sm leading-6 text-gray-600">Si aún no existe una cotización válida, conservamos tu carrito. No se iniciará ningún pago hasta confirmar el envío.</p><ParcelQuoteNotice/></section>
  </div>;
}
