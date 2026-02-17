import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos y condiciones de uso del sitio web de Distribuidora Sicarú. Consulta las reglas de compra, pagos, envíos y más.",
}

export default function TerminosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sicaru-purple-900 to-sicaru-purple-700 py-14 text-white text-center">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">
          Términos y Condiciones
        </h1>
        <p className="mt-3 text-white/80 max-w-xl mx-auto text-sm md:text-base">
          Condiciones de uso del sitio web de Distribuidora Sicarú.
        </p>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        {/* Aceptación */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4">
          Aceptación de Términos
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Al acceder y utilizar el sitio web de Distribuidora Sicarú (en
          adelante, &quot;el Sitio&quot;), aceptas cumplir y estar sujeto a los
          presentes términos y condiciones. Si no estás de acuerdo con alguno de
          estos términos, te pedimos que no utilices el Sitio.
        </p>

        {/* Uso del Sitio */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Uso del Sitio Web
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          El Sitio está destinado para uso personal y comercial legítimo. Queda
          estrictamente prohibido:
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Cualquier uso fraudulento o ilegal del Sitio</li>
          <li>
            La modificación, copia o distribución no autorizada del contenido
          </li>
          <li>
            El uso de herramientas de scraping o extracción automatizada de datos
          </li>
          <li>La reventa no autorizada de productos</li>
        </ul>

        {/* Productos y Precios */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Productos y Precios
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Todos los precios publicados en el Sitio están expresados en Pesos
          Mexicanos (MXN) e incluyen IVA. Nos reservamos el derecho de modificar
          los precios en cualquier momento sin previo aviso. Las fotografías de
          los productos son de referencia y pueden variar ligeramente respecto al
          producto físico.
        </p>

        {/* Proceso de Compra */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Proceso de Compra
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Al confirmar un pedido a través del Sitio, aceptas pagar el monto
          total indicado, incluyendo el costo de envío correspondiente. Si un
          producto no se encuentra disponible después de realizada tu compra, te
          notificaremos a la brevedad y procederemos con el reembolso
          correspondiente. Todos los pedidos están sujetos a disponibilidad.
        </p>

        {/* Métodos de Pago */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Métodos de Pago
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Aceptamos los siguientes métodos de pago:
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Tarjeta de crédito y débito (vía Mercado Pago)</li>
          <li>OXXO Pay</li>
          <li>Transferencia bancaria</li>
        </ul>
        <p className="text-gray-600 leading-relaxed mt-3">
          Los datos de pago son procesados de forma segura por Mercado Pago con
          tecnología de encriptación. Distribuidora Sicarú no almacena datos de
          tarjetas de crédito o débito.
        </p>

        {/* Envíos */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Envíos y Entregas
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Consulta nuestra{" "}
          <Link
            href="/envios"
            className="text-sicaru-purple-700 underline font-medium"
          >
            Política de Envíos
          </Link>{" "}
          para conocer los detalles sobre tiempos de entrega, costos y cobertura
          de envío.
        </p>

        {/* Devoluciones */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Devoluciones y Reembolsos
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Consulta nuestra{" "}
          <Link
            href="/devoluciones"
            className="text-sicaru-purple-700 underline font-medium"
          >
            Política de Devoluciones
          </Link>{" "}
          para conocer las condiciones, plazos y proceso de devolución y
          reembolso.
        </p>

        {/* Propiedad Intelectual */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Propiedad Intelectual
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Todo el contenido del Sitio, incluyendo pero no limitado a logotipos,
          textos, imágenes, diseños, gráficos y software, es propiedad de
          Distribuidora Sicarú o de sus respectivos licenciantes y está
          protegido por las leyes de propiedad intelectual aplicables. Queda
          estrictamente prohibida su reproducción, distribución o uso sin
          autorización previa por escrito.
        </p>

        {/* Limitación de Responsabilidad */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Limitación de Responsabilidad
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Distribuidora Sicarú no será responsable por daños indirectos,
          incidentales o consecuentes derivados del uso o la imposibilidad de uso
          del Sitio. Nos esforzamos por mantener la información del Sitio
          actualizada y precisa, pero no garantizamos su exactitud absoluta en
          todo momento.
        </p>

        {/* Ley Aplicable */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Ley Aplicable y Jurisdicción
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Los presentes términos y condiciones se rigen e interpretan conforme a
          las leyes de los Estados Unidos Mexicanos. Cualquier controversia
          derivada del uso del Sitio o de estos términos será sometida a la
          jurisdicción de los tribunales competentes de Monterrey, Nuevo León,
          renunciando las partes a cualquier otro fuero que pudiera
          corresponderles.
        </p>

        {/* Contacto */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Contacto
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Para cualquier duda o aclaración sobre estos términos y condiciones,
          puedes contactarnos en{" "}
          <a
            href="mailto:contacto@sicaru.com"
            className="text-sicaru-purple-700 underline"
          >
            contacto@sicaru.com
          </a>{" "}
          o por WhatsApp al{" "}
          <a
            href="https://wa.me/528281111023"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sicaru-purple-700 underline"
          >
            +52 828 111 1023
          </a>
          .
        </p>
      </section>
    </>
  )
}
