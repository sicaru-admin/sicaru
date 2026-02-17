import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description:
    "Aviso de Privacidad de Distribuidora Sicarú conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).",
}

export default function PoliticaPrivacidadPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sicaru-purple-900 to-sicaru-purple-700 py-14 text-white text-center">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">
          Aviso de Privacidad
        </h1>
        <p className="mt-3 text-white/80 max-w-xl mx-auto text-sm md:text-base">
          Conforme a la Ley Federal de Protección de Datos Personales en
          Posesión de los Particulares (LFPDPPP).
        </p>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        {/* Identidad del Responsable */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4">
          Identidad del Responsable
        </h2>
        <p className="text-gray-600 leading-relaxed">
          <strong>Distribuidora Sicarú</strong>, con domicilio en La Plaza Local
          204, Cadereyta Jiménez, Nuevo León, C.P. 67480, México, es
          responsable del tratamiento de tus datos personales.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          Correo electrónico:{" "}
          <a
            href="mailto:contacto@sicaru.com"
            className="text-sicaru-purple-700 underline"
          >
            contacto@sicaru.com
          </a>
          <br />
          Teléfono:{" "}
          <a
            href="tel:+528281111023"
            className="text-sicaru-purple-700 underline"
          >
            +52 828 111 1023
          </a>
        </p>

        {/* Datos que Recabamos */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Datos Personales que Recabamos
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Para las finalidades señaladas en el presente aviso de privacidad,
          podemos recabar los siguientes datos personales:
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Nombre completo</li>
          <li>Correo electrónico</li>
          <li>Número telefónico</li>
          <li>Dirección de envío</li>
          <li>RFC (opcional, para facturación)</li>
          <li>Datos de navegación y cookies</li>
        </ul>

        {/* Finalidades */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Finalidades del Tratamiento
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Los datos personales que recabamos serán utilizados para las siguientes
          finalidades:
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Procesar y dar seguimiento a tus pedidos</li>
          <li>Enviar confirmaciones de compra y actualizaciones de envío</li>
          <li>Gestionar envíos y entregas</li>
          <li>Atender solicitudes, dudas y reclamaciones</li>
          <li>Mejorar nuestros productos y servicios</li>
          <li>
            Enviar promociones, ofertas y comunicaciones comerciales (con tu
            consentimiento previo)
          </li>
        </ul>

        {/* Transferencias */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Transferencias de Datos
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Tus datos personales podrán ser transferidos a los siguientes terceros
          para las finalidades indicadas:
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>
            <strong>Proveedores de pago</strong> (Mercado Pago) — para procesar
            transacciones de forma segura
          </li>
          <li>
            <strong>Servicios de paquetería</strong> — para la entrega de tus
            pedidos
          </li>
          <li>
            <strong>Plataformas de comunicación</strong> (WhatsApp Business) —
            para notificaciones y atención al cliente
          </li>
        </ul>
        <p className="text-gray-600 leading-relaxed mt-3">
          <strong>No vendemos tus datos personales a terceros.</strong>
        </p>

        {/* Derechos ARCO */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Derechos ARCO
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Como titular de tus datos personales, tienes derecho a ejercer en
          cualquier momento tus derechos de <strong>Acceso</strong>,{" "}
          <strong>Rectificación</strong>, <strong>Cancelación</strong> y{" "}
          <strong>Oposición</strong> (Derechos ARCO).
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          Para ejercer estos derechos, envía tu solicitud a{" "}
          <a
            href="mailto:contacto@sicaru.com"
            className="text-sicaru-purple-700 underline"
          >
            contacto@sicaru.com
          </a>{" "}
          acompañada de una copia de tu identificación oficial. Daremos
          respuesta a tu solicitud en un plazo máximo de 20 días hábiles.
        </p>

        {/* Cookies */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Cookies y Tecnologías de Rastreo
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Usamos cookies y tecnologías similares para mejorar tu experiencia de
          navegación, recordar tus preferencias y analizar el tráfico de nuestro
          sitio web. Puedes desactivar las cookies en la configuración de tu
          navegador, aunque esto podría afectar algunas funcionalidades del
          sitio.
        </p>

        {/* Cambios */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Cambios al Aviso de Privacidad
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Nos reservamos el derecho de modificar el presente aviso de privacidad
          en cualquier momento. Cualquier modificación será publicada en esta
          página. Te recomendamos revisarla periódicamente.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          <strong>Última actualización:</strong> febrero 2026.
        </p>

        {/* Contacto */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Contacto
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Para dudas o aclaraciones sobre este aviso de privacidad, puedes
          escribirnos a{" "}
          <a
            href="mailto:contacto@sicaru.com"
            className="text-sicaru-purple-700 underline"
          >
            contacto@sicaru.com
          </a>{" "}
          o contactarnos por WhatsApp.
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
