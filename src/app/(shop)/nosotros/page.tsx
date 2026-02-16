import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Distribuidora Sicarú es distribuidora autorizada de productos de belleza profesional en Cadereyta Jiménez, Nuevo León, con envío a todo México.",
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Nosotros
      </h1>

      <div className="prose prose-lg max-w-3xl">
        <p className="text-gray-600 leading-relaxed">
          Distribuidora Sicaru es una distribuidora autorizada de productos de
          belleza profesional en Mexico. Nos especializamos en llevar las mejores
          marcas del mercado directamente a estilistas, salones de belleza y
          consumidores finales que buscan productos de calidad profesional.
        </p>

        <p className="mt-4 text-gray-600 leading-relaxed">
          Nuestro compromiso es ofrecer productos autenticos, precios
          competitivos y un servicio excepcional. Trabajamos de la mano con las
          marcas mas reconocidas de la industria de la belleza para garantizar
          que nuestros clientes siempre tengan acceso a lo mejor.
        </p>

        <p className="mt-4 text-gray-600 leading-relaxed">
          Con envio a todo el pais, atencion personalizada y un catalogo en
          constante crecimiento, Distribuidora Sicaru es tu aliada en belleza
          profesional.
        </p>
      </div>
    </div>
  );
}
