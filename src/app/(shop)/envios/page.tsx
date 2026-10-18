import type { Metadata } from "next";
import { LocalDeliveryNotice } from "@/components/checkout/LocalDeliveryNotice";
export const metadata: Metadata = {title: "Envíos y entregas", description: "Consulta las opciones de entrega de SICARÚ y coordina tu entrega local por WhatsApp."};
export default function EnviosPage() {
  return <main className="mx-auto max-w-3xl space-y-6 px-4 py-12">
    <h1 className="text-3xl font-bold text-sicaru-purple-900">Envíos y entregas</h1>
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-sicaru-purple-900">Envío por paquetería</h2>
      <p>Consulta las opciones para tu dirección al continuar tu compra. Antes de pagar verás el servicio, el costo, el plazo estimado y el importe final.</p>
      <p>Si el envío no está disponible para tu compra, no podrás continuar al pago. Tus productos permanecerán en el carrito.</p>
    </section>
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-sicaru-purple-900">Entrega local · $40 MXN</h2>
      <p>No necesitas completar el checkout para solicitar tu entrega local. Se coordina por WhatsApp y se paga por separado.</p>
      <LocalDeliveryNotice />
    </section>
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-sicaru-purple-900">Tu pedido</h2>
      <p>Al completar una compra, consulta su número, productos, importes, entrega y estado del pago en la confirmación.</p>
    </section>
  </main>;
}
