"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    headline: "Las Mejores Marcas Mexicanas de Cuidado Capilar",
    subtitle:
      "Küül, Voglia, Nekane, Montis y más — todo en un solo lugar con precios de distribuidora",
    cta: "Ver Productos",
    href: "/productos",
    gradient: "from-[#7f6d8a] via-[#8e7a9e] to-[#9b89a8]",
    image: "/images/hero-productos-tienda.jpg",
    alt: "Exhibición de productos profesionales de belleza Küül, Nutrapél y TEC Italy en tienda Sicarú",
  },
  {
    headline: "Küül, Voglia, Hidra Color y más — Precios de Distribuidora",
    subtitle:
      "Coloración profesional, tratamientos y styling de las marcas líderes en México",
    cta: "Comprar Ahora",
    href: "/productos",
    gradient: "from-[#7f6d8a] via-[#8e7a9e] to-[#9b89a8]",
    image: "/images/hero-mujer-salon-elegante.jpg",
    alt: "Mujer mexicana aplicando producto capilar profesional en salón de belleza elegante",
  },
  {
    headline: "Resultados Profesionales que Se Notan",
    subtitle:
      "Cabello saludable y radiante con tratamientos de las mejores marcas mexicanas",
    cta: "Ver Tratamientos",
    href: "/categorias/tratamientos-y-mascarillas",
    gradient: "from-[#7f6d8a] via-[#8e7a9e] to-[#9b89a8]",
    image: "/images/hero-mujer-salon-lujo.jpg",
    alt: "Mujer tocando su cabello ondulado con sonrisa de satisfacción en salón de belleza de lujo",
  },
  {
    headline: "Montis — Extractos 100% Naturales para Tu Cabello",
    subtitle:
      "Descubre la línea mexicana que combina ingredientes naturales con resultados profesionales",
    cta: "Descubrir Montis",
    href: "/marcas/montis",
    gradient: "from-[#7f6d8a] via-[#8e7a9e] to-[#9b89a8]",
    image: "/images/nosotros-ingredientes-naturales-mexico.jpg",
    alt: "Plantas de sábila, romero y nopal en macetas de barro — ingredientes naturales mexicanos para el cuidado capilar",
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
    <section className="noise-overlay relative h-[85vh] w-full overflow-hidden md:h-[70vh]">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
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
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-55`} />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <p className="mb-3 font-heading text-sm uppercase tracking-[0.2em] text-[#efe7dd] md:text-base" style={{ fontStyle: "italic" }}>
              Distribuidora
            </p>
            <h1 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {slide.headline}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg md:text-xl">
              {slide.subtitle}
            </p>
            <Link
              href={slide.href}
              className="mt-8 inline-block rounded-full bg-[#faf8f5] px-8 py-3 text-base font-semibold text-[#2e2b2b] transition-colors hover:bg-[#efe7dd] sm:text-lg"
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
