import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Heart,
  Sparkles,
  Users,
} from "lucide-react";
import { STORE } from "@/lib/constants/store";
import { BRANDS } from "@/lib/constants/brands";

export const metadata: Metadata = {
  title: "Nosotros — Distribuidora Sicarú",
  description:
    "Distribuidora Sicarú es distribuidora autorizada de productos de belleza profesional en Cadereyta Jiménez, Nuevo León, con envío a todo México.",
};

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sicaru-purple-900 to-sicaru-purple-700 py-16 md:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold">
            Sicarú — Especialistas en Cuidado Capilar Profesional
          </h1>
          <p className="text-lg text-white/80 mt-4">
            Distribuidores autorizados de las mejores marcas mexicanas de
            belleza profesional en Cadereyta Jiménez, Nuevo León
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-sicaru-purple-900 mb-6">
            Nuestra Historia
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Distribuidora Sicarú nace en Cadereyta Jiménez, Nuevo León, con la
            misión de acercar los mejores productos de belleza profesional a
            estilistas, salones y consumidores de todo México. Desde nuestra
            ubicación en La Plaza, Local 204, hemos construido relaciones de
            confianza con las marcas líderes del mercado mexicano.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Nos especializamos en coloración profesional, tratamientos
            capilares, productos de styling y cuidado natural. Como
            distribuidores autorizados, garantizamos la autenticidad de cada
            producto que ofrecemos, con precios competitivos y un servicio
            personalizado que nos distingue.
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h3 className="flex items-center gap-2 text-xl font-bold text-sicaru-purple-900">
              <Heart className="h-5 w-5" />
              Nuestra Misión
            </h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Democratizar el acceso a productos de belleza profesional en
              México, ofreciendo marcas auténticas a precios justos con un
              servicio cercano y personalizado.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h3 className="flex items-center gap-2 text-xl font-bold text-sicaru-purple-900">
              <Sparkles className="h-5 w-5" />
              Nuestra Visión
            </h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Ser la distribuidora de referencia en productos de belleza
              profesional en el noreste de México, reconocida por nuestra
              confiabilidad, variedad y compromiso con la comunidad de
              estilistas.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-sicaru-purple-900 text-center mb-8">
            Nuestros Valores
          </h2>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="rounded-xl bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sicaru-purple-100">
                <ShieldCheck className="h-6 w-6 text-sicaru-purple-700" />
              </div>
              <h3 className="mt-4 text-base font-bold text-sicaru-purple-900">
                Autenticidad
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                100% productos originales de distribuidores autorizados
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sicaru-purple-100">
                <Heart className="h-6 w-6 text-sicaru-purple-700" />
              </div>
              <h3 className="mt-4 text-base font-bold text-sicaru-purple-900">
                Servicio
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Atención personalizada por WhatsApp y asesoría profesional
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sicaru-purple-100">
                <Sparkles className="h-6 w-6 text-sicaru-purple-700" />
              </div>
              <h3 className="mt-4 text-base font-bold text-sicaru-purple-900">
                Calidad
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Solo las mejores marcas mexicanas e internacionales
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sicaru-purple-100">
                <Users className="h-6 w-6 text-sicaru-purple-700" />
              </div>
              <h3 className="mt-4 text-base font-bold text-sicaru-purple-900">
                Accesibilidad
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Precios competitivos y programa de mayoreo para profesionales
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-sicaru-purple-900 text-center mb-8">
          Nuestras Marcas
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {Object.values(BRANDS).map((brand) => (
            <Link
              key={brand.handle}
              href={`/marcas/${brand.handle}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
                style={{ backgroundColor: brand.color }}
              >
                {brand.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-sicaru-purple-900 group-hover:text-sicaru-pink transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Store / Map */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-sicaru-purple-900 text-center mb-8">
            Visítanos
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Store info */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h3 className="text-lg font-bold text-sicaru-purple-900">
                {STORE.name}
              </h3>

              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sicaru-purple-700" />
                  <span>{STORE.address.full}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-sicaru-purple-700" />
                  <span>{STORE.phone}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-sicaru-purple-700" />
                  <span>{STORE.email}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-sicaru-purple-700" />
                  <span>{STORE.hours}</span>
                </li>
              </ul>

              <a
                href={`https://wa.me/${STORE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Escríbenos por WhatsApp
              </a>
            </div>

            {/* Google Maps */}
            <div className="rounded-xl overflow-hidden shadow-sm">
              <iframe
                src={STORE.googleMapsEmbedUrl}
                width="100%"
                height={400}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Distribuidora Sicarú"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
