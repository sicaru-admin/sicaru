"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type NeedProduct = {
  src: string;
  alt: string;
  className: string;
};

type Need = {
  id: string;
  number: string;
  label: string;
  href: string;
  title: string;
  description: string;
  brands: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  products?: NeedProduct[];
};

const NEEDS: Need[] = [
  {
    id: "repair",
    number: "01",
    label: "Reparación",
    href: "/categorias/tratamientos-y-mascarillas",
    title: "Repara y fortalece el cabello dañado",
    description:
      "Tratamientos, mascarillas y fórmulas pensadas para cabello seco, procesado o debilitado.",
    brands: "Voglia · Vitale · Nekane Capilar",
    image: "/images/salon-aplicacion-tratamiento.jpg",
    imageAlt:
      "Manos de estilista aplicando tratamiento capilar cremoso al cabello de clienta",
    imagePosition: "object-center",
    products: [
      {
        src: "/images/products-hero/voglia-total-repair.webp",
        alt: "Voglia Total Repair para reparación profesional del cabello",
        className:
          "bottom-[9%] right-[15%] w-[30%] sm:bottom-[8%] sm:right-[18%] sm:w-[26%] lg:right-[20%] lg:w-[27%]",
      },
      {
        src: "/images/products-hero/vitale-bifase-pro-keratin.webp",
        alt: "Vitale Bifase Pro Keratin para protección capilar",
        className:
          "bottom-[8%] right-[3%] w-[27%] sm:right-[6%] sm:w-[23%] lg:right-[5%] lg:w-[23%]",
      },
    ],
  },
  {
    id: "hydration",
    number: "02",
    label: "Hidratación",
    href: "/categorias/tratamientos-y-mascarillas",
    title: "Devuelve suavidad, brillo y manejabilidad",
    description:
      "Opciones de hidratación para cabello seco, opaco o difícil de controlar.",
    brands: "Nekane Capilar · Vitale · Montis",
    image: "/images/producto-tratamiento-capilar.jpg",
    imageAlt: "Producto de tratamiento capilar para hidratación del cabello",
    imagePosition: "object-center",
  },
  {
    id: "color",
    number: "03",
    label: "Color",
    href: "/categorias/color-y-tintes",
    title: "Color profesional para transformar tu cabello",
    description:
      "Tintes, coloración cremosa y productos para mantener resultados definidos y uniformes.",
    brands: "Küül · Voglia · Hidra Color",
    image: "/images/marcas-colorista-aplicando-tinte.jpg",
    imageAlt: "Estilista profesional aplicando tinte rojo a clienta en salón de belleza",
    imagePosition: "object-center",
    products: [
      {
        src: "/images/products-hero/hidra-color-mask.webp",
        alt: "Hidra Color Mask para coloración capilar",
        className:
          "bottom-[7%] right-[16%] w-[30%] sm:right-[18%] sm:w-[25%] lg:right-[20%] lg:w-[27%]",
      },
      {
        src: "/images/products-hero/voglia-color-fun.webp",
        alt: "Voglia Color Fun para coloración profesional",
        className:
          "bottom-[7%] right-[2%] w-[29%] sm:right-[6%] sm:w-[24%] lg:right-[5%] lg:w-[24%]",
      },
    ],
  },
  {
    id: "frizz",
    number: "04",
    label: "Control de frizz",
    href: "/categorias/styling-y-acabado",
    title: "Control, definición y acabado para cada estilo",
    description:
      "Productos para reducir frizz, mejorar la forma y mantener un acabado más pulido.",
    brands: "Xiomara · Voglia · Nekane",
    image: "/images/salon-estilista-secando-cabello.jpg",
    imageAlt: "Estilista secando y peinando el cabello de clienta sonriente en salón",
    imagePosition: "object-center",
    products: [
      {
        src: "/images/products-hero/xiomara-ten-tu.webp",
        alt: "Xiomara Ten+Tú para control y acabado capilar",
        className:
          "bottom-[7%] right-[5%] w-[35%] sm:right-[8%] sm:w-[30%] lg:right-[8%] lg:w-[31%]",
      },
    ],
  },
  {
    id: "thermal",
    number: "05",
    label: "Protección térmica",
    href: "/categorias/styling-y-acabado",
    title: "Protege el cabello antes del calor",
    description:
      "Fórmulas para acompañar el uso de secadora, plancha y herramientas térmicas.",
    brands: "Vitale · Xiomara · Voglia",
    image: "/images/salon-alisado-plancha-profesional.jpg",
    imageAlt: "Plancha profesional alisando cabello con vapor en salón de belleza",
    imagePosition: "object-center",
    products: [
      {
        src: "/images/products-hero/vitale-bifase-pro-keratin.webp",
        alt: "Vitale Bifase Pro Keratin para protección capilar",
        className:
          "bottom-[7%] right-[6%] w-[30%] sm:right-[9%] sm:w-[25%] lg:right-[8%] lg:w-[28%]",
      },
    ],
  },
  {
    id: "professional",
    number: "06",
    label: "Uso profesional",
    href: "/categorias/herramientas-pro",
    title: "Herramientas y productos para el trabajo en salón",
    description:
      "Una selección pensada para estilistas que buscan opciones prácticas y profesionales.",
    brands: "Küül · Voglia · Pomania",
    image: "/images/salon-tratamiento-cabello.jpg",
    imageAlt:
      "Clienta relajándose mientras recibe tratamiento capilar profesional en salón de belleza mexicano",
    imagePosition: "object-center",
  },
];

export function CategoriesGrid() {
  const [activeId, setActiveId] = useState(NEEDS[0].id);
  const [displayNeed, setDisplayNeed] = useState<Need>(NEEDS[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const exitTimer = useRef<number | null>(null);
  const enterTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (exitTimer.current) {
        window.clearTimeout(exitTimer.current);
      }
      if (enterTimer.current) {
        window.clearTimeout(enterTimer.current);
      }
    };
  }, []);

  const selectNeed = (id: string) => {
    if (id === activeId && id === displayNeed.id) {
      return;
    }

    const nextNeed = NEEDS.find((need) => need.id === id) ?? NEEDS[0];

    if (exitTimer.current) {
      window.clearTimeout(exitTimer.current);
    }
    if (enterTimer.current) {
      window.clearTimeout(enterTimer.current);
    }

    setActiveId(id);
    setIsTransitioning(true);
    exitTimer.current = window.setTimeout(() => {
      setDisplayNeed(nextNeed);
      enterTimer.current = window.setTimeout(() => {
        setIsTransitioning(false);
      }, 20);
    }, 120);
  };

  return (
    <section className="bg-[#faf8f5] py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase text-[#8e7a9e]">
            Compra con dirección
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-[#2e2b2b] md:text-4xl">
            Encuentra productos según el resultado que buscas
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,0.34fr)_minmax(0,0.66fr)] lg:items-stretch">
          <div className="border-y border-[#efe7dd]" aria-label="Necesidades capilares">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-col">
              {NEEDS.map((need) => {
                const active = need.id === activeId;

                return (
                  <button
                    key={need.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectNeed(need.id)}
                    className={`group flex min-h-[58px] items-center gap-2.5 border-b border-[#efe7dd] px-3 py-3 text-left transition-colors duration-[220ms] focus:outline-none focus-visible:bg-[#f5f1eb] focus-visible:shadow-[inset_4px_0_0_#7f6d8a] md:min-h-16 md:gap-4 md:px-4 md:py-4 lg:border-l lg:px-5 ${
                      active
                        ? "border-l-[#7f6d8a] bg-[#f5f1eb] text-[#7f6d8a] shadow-[inset_4px_0_0_#7f6d8a]"
                        : "border-l-transparent text-[#2e2b2b] hover:bg-[#f5f1eb] hover:text-[#7f6d8a]"
                    }`}
                  >
                    <span
                      className={`font-semibold transition-colors duration-[220ms] ${
                        active ? "text-sm text-[#7f6d8a] md:text-base" : "text-[0.7rem] text-[#9b89a8] md:text-xs"
                      }`}
                    >
                      {need.number}
                    </span>
                    <span
                      className={`font-heading font-semibold leading-tight transition-[font-size,color] duration-[220ms] ${
                        active ? "text-[1.05rem] md:text-[1.35rem]" : "text-[0.95rem] md:text-xl"
                      }`}
                    >
                      {need.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="relative min-h-[520px] overflow-hidden border border-[#efe7dd] bg-[#f5f1eb] md:min-h-[560px] lg:min-h-[590px]"
            aria-live="polite"
          >
            <div className="absolute left-0 top-0 hidden h-full w-[34%] overflow-hidden bg-[#7f6d8a] lg:block" aria-hidden="true">
              <span className="absolute left-7 top-8 font-heading text-[8rem] font-semibold leading-none text-[#faf8f5]/12">
                {displayNeed.number}
              </span>
            </div>
            <div
              key={displayNeed.id}
              className={`relative h-full min-h-[520px] transition-all duration-[240ms] ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none md:min-h-[560px] lg:min-h-[590px] ${
                isTransitioning ? "translate-y-2 opacity-90" : "translate-y-0 opacity-100"
              }`}
            >
              <div className="relative h-[260px] overflow-hidden bg-[#efe7dd] sm:h-[340px] lg:absolute lg:inset-y-0 lg:left-[30%] lg:right-0 lg:h-auto">
                <Image
                  src={displayNeed.image}
                  alt={displayNeed.imageAlt}
                  fill
                  priority={displayNeed.id === NEEDS[0].id}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className={`object-cover ${displayNeed.imagePosition ?? "object-center"}`}
                />

                {displayNeed.products?.map((product) => (
                  <div
                    key={product.src}
                    className={`pointer-events-none absolute z-20 aspect-[6/7] drop-shadow-[0_14px_20px_rgba(127,109,138,0.14)] transition-all delay-[60ms] duration-[240ms] ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                      isTransitioning ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
                    } ${product.className}`}
                  >
                    <Image
                      src={product.src}
                      alt={product.alt}
                      fill
                      sizes="(max-width: 640px) 28vw, (max-width: 1024px) 22vw, 180px"
                      className="object-contain object-center"
                    />
                  </div>
                ))}
              </div>

              <div className="relative z-30 flex min-h-[260px] flex-col justify-end p-5 sm:p-6 md:p-7 lg:min-h-[590px] lg:justify-end lg:p-8">
                <div className="max-w-xl border-t border-[#efe7dd] bg-[#faf8f5] px-5 py-4 sm:px-6 md:px-6 md:py-5 lg:max-w-[48%] lg:border-l lg:border-r">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8e7a9e]">
                    {displayNeed.label}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-semibold leading-tight text-[#2e2b2b] md:text-3xl lg:text-[2.15rem]">
                    {displayNeed.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#2e2b2b]/70 md:text-base">
                    {displayNeed.description}
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#7f6d8a]">
                    {displayNeed.brands}
                  </p>
                  <Link
                    href={displayNeed.href}
                    className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 bg-[#7f6d8a] px-6 py-3 text-sm font-semibold text-[#faf8f5] transition-colors duration-[200ms] hover:bg-[#8e7a9e] focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.22)]"
                  >
                    Explorar productos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
