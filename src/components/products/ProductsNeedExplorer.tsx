"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const needs = [
  {
    number: "01",
    label: "Reparación e hidratación",
    href: "/categorias/tratamientos-y-mascarillas",
    description:
      "Tratamientos, mascarillas y fórmulas para recuperar suavidad, brillo y resistencia.",
    image: "/images/products-hero/voglia-total-repair.webp",
    alt: "Voglia Total Repair para reparación e hidratación",
  },
  {
    number: "02",
    label: "Coloración",
    href: "/categorias/color-y-tintes",
    description:
      "Color, tintes y apoyo técnico para mantener resultados profesionales y vivos.",
    image: "/images/products-hero/hidra-color-mask.webp",
    alt: "Hidra Color Mask para coloración capilar",
  },
  {
    number: "03",
    label: "Protección y acabado",
    href: "/categorias/styling-y-acabado",
    description:
      "Protectores, finalizadores y productos de styling para pulir cada rutina.",
    image: "/images/products-hero/vitale-bifase-pro-keratin.webp",
    alt: "Vitale Bifase Pro Keratin para proteccion y acabado",
  },
  {
    number: "04",
    label: "Herramientas",
    href: "/categorias/herramientas-pro",
    description:
      "Herramientas y accesorios pensados para trabajo profesional y uso preciso.",
    image: "/images/products-hero/navaja-profesional.webp",
    alt: "Navaja profesional para herramientas de salón",
  },
  {
    number: "05",
    label: "Shampoo y acondicionador",
    href: "/categorias/shampoo-y-acondicionador",
    description:
      "Limpieza y cuidado base para cabello seco, graso, teñido o con tratamiento.",
    image: "/images/products-hero/xiomara-ten-tu.webp",
    alt: "Xiomara Ten+Tu para cuidado capilar diario",
  },
];

export function ProductsNeedExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeNeed = needs[activeIndex];

  return (
    <section className="grid gap-6 border-y border-[#efe7dd] py-8 md:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.75fr)] md:items-stretch md:gap-10 md:py-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7f6d8a]">
          Explorador
        </p>
        <h2 className="mt-2 font-heading text-3xl font-semibold leading-tight text-[#2e2b2b] md:text-4xl">
          Explora por necesidad
        </h2>
        <div className="mt-6 flex snap-x gap-3 overflow-x-auto pb-2 md:block md:space-y-1 md:overflow-visible md:pb-0">
          {needs.map((need, index) => {
            const isActive = index === activeIndex;

            return (
              <Link
                key={need.href}
                href={need.href}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                className={`group flex min-w-[78%] snap-start items-center justify-between gap-4 border border-[#efe7dd] px-4 py-4 transition-[background-color,border-color,color] duration-200 focus:outline-none focus-visible:border-[#7f6d8a] focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.16)] sm:min-w-[48%] md:min-w-0 md:border-x-0 md:border-b md:border-t-0 md:px-0 md:py-5 ${
                  isActive
                    ? "bg-[#efe7dd] md:bg-transparent"
                    : "bg-[#faf8f5] hover:bg-[#f5f1eb] md:bg-transparent"
                }`}
              >
                <span className="flex min-w-0 items-baseline gap-4">
                  <span className="text-xs font-semibold text-[#7f6d8a]">
                    {need.number}
                  </span>
                  <span>
                    <span className="block font-heading text-2xl font-semibold leading-tight text-[#2e2b2b] md:text-3xl">
                      {need.label}
                    </span>
                    <span
                      className={`mt-2 block max-w-xl text-sm leading-6 text-[#2e2b2b]/64 md:transition-opacity md:duration-200 ${
                        isActive ? "md:opacity-100" : "md:opacity-0"
                      }`}
                    >
                      {need.description}
                    </span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#7f6d8a] transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-[260px] overflow-hidden rounded-lg border border-[#efe7dd] bg-[#f5f1eb] md:min-h-full">
        <Image
          key={activeNeed.image}
          src={activeNeed.image}
          alt={activeNeed.alt}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-contain object-center p-8 transition-opacity duration-200"
        />
        <div className="absolute bottom-4 left-4 right-4 border-t border-[#faf8f5]/80 pt-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7f6d8a]">
            {activeNeed.number} / {activeNeed.label}
          </p>
        </div>
      </div>
    </section>
  );
}
