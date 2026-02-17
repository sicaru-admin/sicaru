import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Clock, Phone, Mail, MessageCircle } from "lucide-react";

import { STORE } from "@/lib/constants/store";
import ContactFormClient from "@/components/contact/ContactFormClient";

export const metadata: Metadata = {
  title: "Contáctanos — Distribuidora Sicarú",
  description:
    "Ponte en contacto con Distribuidora Sicarú. Estamos para ayudarte con tus preguntas sobre productos, pedidos, precios de mayoreo y más.",
};

export default function ContactoPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-sicaru-purple-900 to-sicaru-purple-700 py-16 text-white overflow-hidden">
        <Image
          src="/images/hero-mujer-salon-morado.jpg"
          alt="Mujer sonriente con cabello rizado en salón de belleza Sicarú con pared morada"
          fill
          className="object-cover opacity-25"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-heading text-3xl font-bold md:text-5xl">
            Contáctanos
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Estamos para ayudarte. Escríbenos y te respondemos a la brevedad.
          </p>
        </div>
      </section>

      {/* ── Form + Store Info ── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left — Contact Form */}
          <div className="lg:col-span-3">
            <ContactFormClient />
          </div>

          {/* Right — Store Information */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h2 className="text-lg font-bold text-sicaru-purple-900">
                Información de la Tienda
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sicaru-purple-600" />
                  <span className="text-sm text-gray-700">
                    {STORE.address.full}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-sicaru-purple-600" />
                  <span className="text-sm text-gray-700">{STORE.phone}</span>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-sicaru-purple-600" />
                  <a
                    href={`mailto:${STORE.email}`}
                    className="text-sm text-sicaru-purple-600 underline hover:text-sicaru-purple-800"
                  >
                    {STORE.email}
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-sicaru-purple-600" />
                  <span className="text-sm text-gray-700">{STORE.hours}</span>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="mt-6 overflow-hidden rounded-xl">
                <iframe
                  src={STORE.googleMapsEmbedUrl}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Distribuidora Sicarú"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <section className="bg-[#25D366] py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <MessageCircle className="mx-auto mb-3 h-10 w-10" />
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            ¿Prefieres WhatsApp?
          </h2>
          <p className="mt-2 text-white/90">
            Escríbenos directamente para atención inmediata
          </p>
          <a
            href="https://wa.me/528281111023"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-[#25D366] transition-colors hover:bg-white/90"
          >
            Abrir WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
