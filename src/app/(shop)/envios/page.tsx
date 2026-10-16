import type { Metadata } from "next"
import Image from "next/image"
import { LocalDeliveryNotice } from "@/components/checkout/LocalDeliveryNotice"

export const metadata: Metadata = {
  title: "Política de Envíos",
  description:
    "Consulta las tarifas provisionales de DHL y coordina el envío local de $40 MXN en Cadereyta por WhatsApp.",
}

export default function EnviosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sicaru-purple-700 to-sicaru-purple-500 py-14 text-white text-center">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">
          Política de Envíos
        </h1>
        <p className="mt-3 text-white/80 max-w-xl mx-auto text-sm md:text-base">
          Envíos por DHL con tarifa confirmada y entregas locales en Cadereyta por WhatsApp.
        </p>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4">
          Envíos por DHL
        </h2>
        <p className="text-gray-600 leading-relaxed">
          El checkout admite únicamente envíos DHL con peso, cobertura y costo
          verificados. Estamos confirmando el alta de la cuenta y la vigencia de
          las tarifas antes de la primera venta foránea. Si tu paquete o destino
          requiere revisión, cotiza por WhatsApp antes de pagar.
        </p>

        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Tarifas provisionales de referencia
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Estas referencias están sujetas a confirmación con DHL; todavía no
          representan una cotización automática para cualquier producto o destino.
        </p>
        <div className="mt-5 overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Tarifas provisionales de DHL en pesos mexicanos</caption>
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="p-4">Peso facturable del paquete</th>
                <th scope="col" className="p-4">Referencia</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><th scope="row" className="p-4 font-medium">De 1 a 2 kg</th><td className="p-4">$214 MXN</td></tr>
              <tr><th scope="row" className="p-4 font-medium">Más de 2 y hasta 5 kg</th><td className="p-4">$270 MXN</td></tr>
              <tr><th scope="row" className="p-4 font-medium">Zona remota confirmada por DHL</th><td className="p-4">Adicional de $118 MXN</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 leading-relaxed mt-3">
          Los paquetes de menos de 1 kg, de más de 5 kg, con peso desconocido o
          con cobertura o zona remota sin validar requieren cotización por
          WhatsApp. Sin un costo confirmado no se habilita el pago del envío.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          Se consideran el peso de los productos con sus envases y el empaque de
          transporte. El peso volumétrico se tomará en cuenta si DHL confirma que
          aplica al servicio contratado. Los ml de contenido no sustituyen el
          peso del paquete.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          Confirmamos cobertura, costo final y plazo estimado antes del pago.
          El recargo de zona remota solo se agrega si DHL lo confirma para el
          destino. No hay envío gratuito por falta de una tarifa.
        </p>

        <LocalDeliveryNotice />

        {/* Métodos de pago */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Métodos de Pago
        </h2>
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-xl">
            <Image
              src="/images/metodos-pago-mercadopago.jpg"
              alt="Métodos de pago aceptados — Visa, Mastercard, OXXO Pay y Mercado Pago con confirmación de pago exitoso"
              fill
              className="object-contain"
              sizes="400px"
            />
          </div>
        </div>

        {/* OXXO */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Pagos en OXXO
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Si pagas con OXXO Pay, tu pedido se procesará una vez confirmado el
          pago. Los pagos en OXXO se confirman en un máximo de 72 horas hábiles.
          Tu pedido se enviará al día siguiente de la confirmación del pago.
        </p>

        {/* Rastreo */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Rastreo de Pedido
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Una vez enviado tu pedido, recibirás una notificación por WhatsApp con
          la información de seguimiento. También puedes consultar el estado de tu
          pedido en la sección Mi Cuenta &gt; Mis Pedidos.
        </p>

        {/* Dudas */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          ¿Tienes dudas?
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Contáctanos por WhatsApp y con gusto te ayudamos.
        </p>
        <a
          href="https://wa.me/528281111023"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          Escríbenos por WhatsApp
        </a>
      </section>
    </>
  )
}

