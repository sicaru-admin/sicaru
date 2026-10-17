import type { Metadata } from "next";
import { LocalDeliveryNotice } from "@/components/checkout/LocalDeliveryNotice";
export const metadata: Metadata = {
  title: "Envíos y entregas",
  description: "Entregas locales de $40 por WhatsApp y estado de los envíos DHL en SICARÚ.",
};
export default function EnviosPage() {
  return <main className="mx-auto max-w-3xl space-y-6 px-4 py-12">
    <h1 className="text-3xl font-bold text-sicaru-purple-900">Envíos y entregas</h1>
    <h2 className="text-xl font-semibold">Envíos DHL</h2>
    <p>DHL todavía no está disponible para compras en línea. Estamos confirmando la modalidad, el importe, la cobertura y las condiciones del servicio.</p>
    <p>Cuando esté disponible, podrás seleccionar DHL, ver su costo sumado al total y pagar directamente en la tienda. WhatsApp no será obligatorio para una compra normal por DHL.</p>
    <p>Por ahora puedes explorar productos y preparar tu carrito. El checkout no permite pagar sin una tarifa disponible para tu paquete y dirección.</p>
    <p>El costo dependerá de las condiciones confirmadas del servicio. No hay una tarifa general publicada ni envío gratuito por falta de cotización.</p>
    <LocalDeliveryNotice />
    <h2 className="text-xl font-semibold">Pagos y confirmación</h2>
    <p>El resumen separará productos, impuestos y envío antes de pagar. Un pago pendiente o rechazado no se considera pagado. La confirmación del pedido mostrará su estado.</p>
    <h2 className="text-xl font-semibold">Fotografías y disponibilidad</h2>
    <p>Si un producto todavía no tiene fotografía, lo indicaremos sin mostrar la imagen de otro producto. La disponibilidad se confirma al agregarlo al carrito.</p>
  </main>;
}
