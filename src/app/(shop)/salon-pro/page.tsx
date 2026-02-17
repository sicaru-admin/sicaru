import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  Tag,
  Truck,
  FileText,
  MessageCircle,
  CheckCircle,
  Star,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Sicaru PRO — Precios de Distribuidora para Profesionales",
  description:
    "Precios de mayoreo exclusivos para estilistas y salones. Descuentos de 15-25% en Kuul, Voglia, Nekane y todas nuestras marcas desde 12 piezas.",
}

const BENEFITS = [
  {
    icon: Tag,
    title: "Precios Mayoreo",
    description:
      "Descuentos de 15-25% desde 12 piezas en todas nuestras marcas",
  },
  {
    icon: Truck,
    title: "Entrega Dedicada",
    description: "Rutas semanales para tu salon los martes y viernes",
  },
  {
    icon: FileText,
    title: "Facturacion Automatica",
    description: "CFDI 4.0 generado automaticamente en cada pedido",
  },
  {
    icon: MessageCircle,
    title: "Asesoria Personalizada",
    description: "Linea WhatsApp exclusiva PRO con atencion directa",
  },
]

const PRICING_TIERS = [
  {
    name: "Publico",
    range: "1-11 piezas",
    discount: null,
    price: "$389",
    highlighted: false,
  },
  {
    name: "PRO 12+",
    range: "12-47 piezas",
    discount: "-15%",
    price: "$330",
    highlighted: false,
  },
  {
    name: "PRO 48+",
    range: "48+ piezas",
    discount: "-25%",
    price: "$292",
    highlighted: true,
  },
]

const BRANDS = [
  {
    name: "Kuul",
    color: "#E8351E",
    description: "Lider mexicano en coloracion profesional — Henkel",
    handle: "kuul",
  },
  {
    name: "Voglia",
    color: "#8B5CF6",
    description: "Tintes y linea de barberia desde Leon, GTO",
    handle: "voglia",
  },
  {
    name: "Nekane Capilar",
    color: "#EC4899",
    description: "Tratamientos capilares de hidratacion profunda",
    handle: "nekane-capilar",
  },
  {
    name: "Hidra Color",
    color: "#3B82F6",
    description: "Sistema de coloracion cremosa profesional",
    handle: "hidra-color",
  },
  {
    name: "Xiomara",
    color: "#F59E0B",
    description: "Styling y fijacion profesional",
    handle: "xiomara",
  },
  {
    name: "Vitale",
    color: "#10B981",
    description: "Keratina y tratamientos de reconstruccion",
    handle: "vitale",
  },
  {
    name: "Montis",
    color: "#166534",
    description: "Marca mexicana con extractos 100% naturales",
    handle: "montis",
  },
]

const TESTIMONIALS = [
  {
    quote:
      "Desde que trabajo con Sicaru PRO, mis costos bajaron y siempre tengo producto disponible.",
    name: "Proximamente",
    salon: "Salon en Monterrey",
  },
  {
    quote:
      "La entrega puntual los martes me permite planificar mi semana sin preocuparme por inventario.",
    name: "Proximamente",
    salon: "Salon en Guadalajara",
  },
  {
    quote:
      "La facturacion automatica me ahorra horas cada mes. Todo llega perfecto.",
    name: "Proximamente",
    salon: "Salon en CDMX",
  },
]

export default function SalonProPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sicaru-purple-900 to-sicaru-purple-700 py-20 text-white md:py-28 overflow-hidden">
        <Image
          src="/images/salon-estilista-secando-cabello.jpg"
          alt="Estilista profesional secando el cabello de clienta sonriente en salón de belleza"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            Para Profesionales
          </span>
          <h1
            className="mx-auto max-w-4xl text-3xl font-bold leading-tight md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Sicaru PRO — Precios de Distribuidora para Profesionales
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Mayoreo desde 12 piezas en Kuul, Voglia, Nekane y todas nuestras
            marcas. Entrega dedicada, facturacion automatica y asesoria
            personalizada para tu salon.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/salon-pro/registro"
              className="rounded-full bg-sicaru-pink px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
            >
              Solicitar Acceso PRO
            </Link>
            <a
              href="https://wa.me/528281111023?text=Hola%2C%20me%20interesa%20Sicaru%20PRO"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2
            className="mb-12 text-center text-2xl font-bold text-sicaru-purple-900 md:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ventajas Exclusivas PRO
          </h2>

          <div className="mb-12 grid gap-8 md:grid-cols-2 md:items-center">
            <div className="relative overflow-hidden rounded-xl aspect-[3/2]">
              <Image
                src="/images/salon-colorista-muestrario.jpg"
                alt="Colorista profesional consultando muestrario de colores de tinte junto a herramientas de mezcla en salón"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-[3/2]">
              <Image
                src="/images/barberia-corte-masculino.jpg"
                alt="Barbero mexicano realizando corte de cabello masculino en barbería tradicional"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-sicaru-purple-100">
                  <benefit.icon className="h-6 w-6 text-sicaru-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-sicaru-purple-900">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2
            className="mb-4 text-center text-2xl font-bold text-sicaru-purple-900 md:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Precios que Impulsan Tu Negocio
          </h2>
          <p className="mb-12 text-center text-gray-600">
            Ejemplo: Kuul Cure Me Shampoo 1L
          </p>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl border-2 bg-white p-6 text-center shadow-sm ${
                  tier.highlighted
                    ? "border-sicaru-pink shadow-lg"
                    : "border-gray-200"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sicaru-pink px-4 py-1 text-xs font-bold text-white">
                    Mejor Precio
                  </span>
                )}
                <h3 className="mb-1 text-lg font-bold text-sicaru-purple-900">
                  {tier.name}
                </h3>
                <p className="mb-4 text-sm text-gray-500">{tier.range}</p>
                <p className="text-3xl font-bold text-sicaru-purple-900">
                  {tier.price}
                  <span className="text-base font-normal text-gray-500">
                    {" "}
                    MXN
                  </span>
                </p>
                {tier.discount && (
                  <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    {tier.discount}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">
            Precios ejemplo base tinte profesional. Los descuentos aplican a
            todo el catalogo.
          </p>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2
            className="mb-12 text-center text-2xl font-bold text-sicaru-purple-900 md:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Marcas Disponibles en Mayoreo
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
            {BRANDS.map((brand) => (
              <Link
                key={brand.handle}
                href={`/marcas/${brand.handle}`}
                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className="h-1.5"
                  style={{ backgroundColor: brand.color }}
                />
                <div className="flex flex-1 flex-col items-center p-4 text-center">
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: brand.color }}
                  >
                    {brand.name[0]}
                  </div>
                  <h3 className="text-sm font-bold text-sicaru-purple-900">
                    {brand.name}
                  </h3>
                  <p className="mt-1 text-xs leading-snug text-gray-500">
                    {brand.description}
                  </p>
                  <span className="mt-2 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                    Mayoreo disponible
                  </span>
                  <span className="mt-auto pt-3 text-xs font-semibold text-sicaru-pink transition-colors group-hover:text-sicaru-purple-600">
                    Ver Productos &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2
            className="mb-12 text-center text-2xl font-bold text-sicaru-purple-900 md:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Lo Que Dicen Nuestros Clientes PRO
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-3 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-sicaru-gold text-sicaru-gold"
                    />
                  ))}
                </div>
                <p className="mb-4 italic text-gray-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm font-semibold text-sicaru-purple-900">
                  {t.name}
                </p>
                <p className="text-xs text-gray-500">{t.salon}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative bg-sicaru-purple-900 py-16 text-white overflow-hidden">
        <Image
          src="/images/salon-mezcla-tintes-profesional.jpg"
          alt="Mesa de trabajo profesional con mezcla de tintes de diferentes colores listos para aplicación"
          fill
          className="object-cover opacity-15"
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-sicaru-gold" />
          <h2
            className="mb-4 text-2xl font-bold md:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Registra Tu Salon
          </h2>
          <p className="mb-8 text-white/80">
            Completa tu solicitud en menos de 3 minutos. Te contactaremos por
            WhatsApp en maximo 48 horas para activar tu cuenta PRO.
          </p>
          <Link
            href="/salon-pro/registro"
            className="inline-block rounded-full bg-sicaru-pink px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
          >
            Solicitar Acceso PRO
          </Link>
        </div>
      </section>
    </>
  )
}
