import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Política de Envíos",
  description:
    "Conoce nuestra cobertura de envíos a todo México, tiempos de entrega y costos. Envíos desde Cadereyta Jiménez, Nuevo León.",
}

export default function EnviosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sicaru-purple-900 to-sicaru-purple-700 py-14 text-white text-center">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">
          Política de Envíos
        </h1>
        <p className="mt-3 text-white/80 max-w-xl mx-auto text-sm md:text-base">
          Realizamos envíos a todo México desde Cadereyta Jiménez, Nuevo León.
        </p>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        {/* Cobertura */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4">
          Cobertura de Envío
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Realizamos envíos a todo México. Nuestros productos salen desde
          Cadereyta Jiménez, Nuevo León.
        </p>

        {/* Tiempos de Entrega */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Tiempos de Entrega
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-white p-5">
            <p className="font-bold text-gray-900">Cadereyta Jiménez</p>
            <p className="text-sm text-gray-600 mt-1">
              Mismo día (pedidos antes de 2pm)
            </p>
            <p className="text-sm text-sicaru-purple-700 font-medium mt-2">
              Gratis en pedidos mayores a $300 MXN
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="font-bold text-gray-900">
              Zona Metropolitana de Monterrey
            </p>
            <p className="text-sm text-gray-600 mt-1">1 día hábil</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="font-bold text-gray-900">Resto de Nuevo León</p>
            <p className="text-sm text-gray-600 mt-1">1-2 días hábiles</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="font-bold text-gray-900">Nacional</p>
            <p className="text-sm text-gray-600 mt-1">2-5 días hábiles</p>
          </div>
        </div>

        {/* Costos */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Costos de Envío
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Los costos de envío se calculan automáticamente al momento del checkout
          según tu ubicación y el peso del pedido.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          Envío gratis en pedidos locales (Cadereyta) mayores a $300 MXN.
        </p>

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
