"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

const slides = [
  {
    eyebrow: "Belleza profesional en Cadereyta",
    headline: "Productos capilares seleccionados con criterio profesional",
    subtitle:
      "Tratamientos, color y styling para cuidar tu cabello con una experiencia limpia, cercana y confiable.",
    cta: "Ver productos",
    href: "/productos",
    image: "/images/hero-mujer-salon-elegante.jpg",
    alt: "Mujer en salón de belleza profesional usando productos capilares",
  },
  {
    eyebrow: "Asesoría antes de comprar",
    headline: "El producto correcto para lo que tu cabello necesita hoy",
    subtitle:
      "Te ayudamos a elegir entre hidratación, reparación, protección térmica, coloración y acabado profesional.",
    cta: "Pedir recomendación",
    href: "/contacto",
    image: "/images/salon-estilista-secando-cabello.jpg",
    alt: "Estilista profesional secando el cabello de una clienta",
  },
  {
    eyebrow: "Para uso personal y salón",
    headline: "Una selección pensada para verse bien y trabajar mejor",
    subtitle:
      "Marcas profesionales, básicos confiables y productos especiales para mantener resultados de salón.",
    cta: "Explorar tratamientos",
    href: "/categorias/tratamientos-y-mascarillas",
    image: "/images/hero-productos-tienda.jpg",
    alt: "Productos profesionales de belleza en exhibición limpia",
  },
];

export function HeroSection() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="noise-overlay relative min-h-[720px] w-full overflow-hidden bg-[#2e2b2b] md:min-h-[680px]">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === active ? "z-10 opacity-100 pointer-events-auto" : "z-0 opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-cover scale-105 transition-transform duration-[8000ms] ease-out"
            style={{ transform: i === active ? "scale(1)" : "scale(1.05)" }}
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2e2b2b]/90 via-[#7f6d8a]/70 to-[#efe7dd]/20" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#faf8f5] to-transparent" />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 py-24 sm:px-8">
            <div className="max-w-3xl text-left">
              <div className="mb-5 inline-flex items-center gap-2 border border-[#efe7dd]/40 bg-[#faf8f5]/10 px-4 py-2 text-xs font-semibold uppercase text-[#faf8f5] backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                {slide.eyebrow}
              </div>

              <h1 className="font-heading text-4xl font-semibold leading-tight text-[#faf8f5] sm:text-5xl lg:text-6xl">
                {slide.headline}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#faf8f5]/80 sm:text-lg">
                {slide.subtitle}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={slide.href}
                  className="inline-flex items-center justify-center gap-2 bg-[#faf8f5] px-7 py-3 text-sm font-semibold text-[#2e2b2b] transition-colors hover:bg-[#efe7dd]"
                >
                  {slide.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://wa.me/528281111023?text=Hola%2C%20quiero%20asesor%C3%ADa%20para%20elegir%20productos%20Sicar%C3%BA."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-[#faf8f5]/50 px-7 py-3 text-sm font-semibold text-[#faf8f5] transition-colors hover:bg-[#faf8f5]/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  Asesoría por WhatsApp
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-3 border-y border-[#faf8f5]/25 py-5 text-[#faf8f5]">
                <div>
                  <p className="text-lg font-semibold">Local</p>
                  <p className="mt-1 text-xs text-[#faf8f5]/70">Cadereyta</p>
                </div>
                <div className="border-x border-[#faf8f5]/20 px-4">
                  <p className="text-lg font-semibold">Pro</p>
                  <p className="mt-1 text-xs text-[#faf8f5]/70">Uso salón</p>
                </div>
                <div className="pl-4">
                  <p className="text-lg font-semibold">Guía</p>
                  <p className="mt-1 text-xs text-[#faf8f5]/70">Compra segura</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-10 left-5 z-20 flex gap-2 sm:left-8 lg:left-[calc((100vw-80rem)/2+2rem)]">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={`h-2.5 transition-all ${
              i === active
                ? "w-8 bg-[#faf8f5]"
                : "w-2.5 bg-[#faf8f5]/45 hover:bg-[#faf8f5]/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
