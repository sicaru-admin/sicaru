import { CATALOG_MODE } from "@/lib/catalog-mode";
import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Política de Devoluciones",
  description:
    "Consulta nuestra política de devoluciones, condiciones, plazos y proceso de reembolso en Distribuidora Sicarú.",
}

export default function DevolucionesPage() {
  if (CATALOG_MODE) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h1 className="font-heading text-3xl text-[#2e2b2b]">Compras online próximamente</h1>
        <p className="mt-5 text-[#2e2b2b]/70">Las políticas de devolución de pedidos online se publicarán antes de habilitar las compras en el sitio.</p>
        <a href="https://wa.me/528281136652" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-11 items-center bg-[#7f6d8a] px-6 py-3 text-white">Consultar a SICARÚ</a>
      </main>
    );
  }
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sicaru-purple-700 to-sicaru-purple-500 py-14 text-white text-center overflow-hidden">
        <Image
          src="/images/hero-cabello-natural-luz.jpg"
          alt="Mujer mexicana sonriendo mientras toca su cabello saludable con luz natural dorada"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="relative z-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">
            Política de Devoluciones
          </h1>
          <p className="mt-3 text-white/80 max-w-xl mx-auto text-sm md:text-base">
            Tu satisfacción es nuestra prioridad. Conoce cómo realizar una
            devolución.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        {/* Plazo */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4">
          Plazo de Devolución
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Aceptamos devoluciones dentro de los 15 días naturales posteriores a la
          recepción de tu pedido.
        </p>

        {/* Condiciones */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Condiciones para Devolución
        </h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>
            El producto debe estar sin abrir, sellado y en su empaque original
          </li>
          <li>
            Debes contar con tu comprobante de compra o número de pedido
          </li>
          <li>El producto no debe mostrar señales de uso</li>
          <li>
            Los productos de higiene personal abiertos no son elegibles para
            devolución
          </li>
        </ul>

        {/* Proceso */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Proceso de Devolución
        </h2>
        <ol className="list-decimal ml-6 space-y-3 text-gray-600">
          <li>
            <span className="font-bold text-gray-900">
              Contacta a nuestro equipo
            </span>{" "}
            — Escríbenos por WhatsApp al +52 828 113 6652 indicando tu número de
            pedido y el motivo de la devolución.
          </li>
          <li>
            <span className="font-bold text-gray-900">
              Recibe tu autorización
            </span>{" "}
            — Te enviaremos una autorización de devolución con las instrucciones
            de envío.
          </li>
          <li>
            <span className="font-bold text-gray-900">Envía el producto</span>{" "}
            — Empaca el producto de forma segura y envíalo a nuestra dirección.
          </li>
          <li>
            <span className="font-bold text-gray-900">
              Recibe tu reembolso
            </span>{" "}
            — Una vez recibido y verificado el producto, procesaremos tu
            reembolso en un plazo de 5-10 días hábiles.
          </li>
        </ol>

        {/* Excepciones */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Excepciones
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          No se aceptan devoluciones en los siguientes casos:
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Productos cosméticos abiertos o usados</li>
          <li>Productos con sellos de seguridad rotos</li>
          <li>Productos personalizados o mezclados</li>
          <li>
            Productos adquiridos en promoción o liquidación (salvo defectos)
          </li>
        </ul>

        {/* Reembolsos */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          Reembolsos
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Los reembolsos se realizan por el mismo método de pago utilizado en la
          compra. Si pagaste con OXXO, el reembolso se hará por transferencia
          bancaria.
        </p>

        {/* CTA */}
        <h2 className="text-xl font-bold text-sicaru-purple-900 mb-4 mt-8">
          ¿Necesitas hacer una devolución?
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Contáctanos por WhatsApp y te guiaremos en el proceso.
        </p>
        <a
          href="https://wa.me/528281136652"
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
