"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    headline: "Las Mejores Marcas Mexicanas de Cuidado Capilar",
    subtitle:
      "Küül, Voglia, Nekane, Montis y más — todo en un solo lugar con precios de distribuidora",
    cta: "Ver Productos",
    href: "/productos",
    gradient: "from-sicaru-purple-900 via-sicaru-purple-800 to-sicaru-purple-600",
  },
  {
    headline: "Küül, Voglia, Hidra Color y más — Precios de Distribuidora",
    subtitle:
      "Coloración profesional, tratamientos y styling de las marcas líderes en México",
    cta: "Comprar Ahora",
    href: "/productos",
    gradient: "from-sicaru-purple-800 via-sicaru-purple-700 to-sicaru-pink/80",
  },
  {
    headline: "Montis — Extractos 100% Naturales para Tu Cabello",
    subtitle:
      "Descubre la línea mexicana que combina ingredientes naturales con resultados profesionales",
    cta: "Descubrir Montis",
    href: "/marcas/montis",
    gradient: "from-[#1A3A25] via-[#166534] to-[#22543D]",
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
    <section className="relative w-full h-[85vh] md:h-[70vh] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${slide.gradient} transition-opacity duration-700 ${
            i === active ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h1 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {slide.headline}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg md:text-xl">
              {slide.subtitle}
            </p>
            <Link
              href={slide.href}
              className="mt-8 inline-block rounded-full bg-sicaru-pink px-8 py-3 text-base font-semibold text-white transition-all hover:bg-sicaru-pink/90 hover:scale-105 sm:text-lg"
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={`h-3 w-3 rounded-full transition-all ${
              i === active
                ? "bg-white scale-110"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
