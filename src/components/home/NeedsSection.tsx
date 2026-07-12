import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Flame,
  HeartPulse,
  Palette,
  Shield,
  Sparkles,
  Sprout,
  Waves,
} from "lucide-react";

const NEEDS = [
  {
    title: "Reparación",
    text: "Para cabello procesado, quebradizo o debilitado.",
    href: "/productos?buscar=reparacion",
    icon: HeartPulse,
  },
  {
    title: "Hidratación",
    text: "Para suavidad, brillo y manejo diario.",
    href: "/productos?buscar=hidratacion",
    icon: Droplets,
  },
  {
    title: "Control de frizz",
    text: "Para alisar la apariencia y controlar volumen.",
    href: "/productos?buscar=frizz",
    icon: Sparkles,
  },
  {
    title: "Protección térmica",
    text: "Para plancha, secadora y herramientas de calor.",
    href: "/productos?buscar=protector termico",
    icon: Flame,
  },
  {
    title: "Cabello teñido",
    text: "Para mantener color, brillo y cuidado.",
    href: "/productos?buscar=color",
    icon: Palette,
  },
  {
    title: "Crecimiento y caída",
    text: "Para rutinas enfocadas en cuero cabelludo.",
    href: "/productos?buscar=caida",
    icon: Sprout,
  },
  {
    title: "Definición de rizos",
    text: "Para forma, suavidad y acabado natural.",
    href: "/productos?buscar=rizos",
    icon: Waves,
  },
  {
    title: "Matización",
    text: "Para neutralizar tonos y cuidar rubios.",
    href: "/productos?buscar=matizador",
    icon: Shield,
  },
];

export function NeedsSection() {
  return (
    <section className="bg-[#faf8f5] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 grid gap-5 md:grid-cols-[0.8fr_1fr] md:items-end">
          <div>
            <p className="sicaru-eyebrow">01 · Necesidades</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-[#2e2b2b] md:text-5xl">
              ¿Qué necesita tu cabello?
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#2e2b2b]/65 md:text-base">
            Explora productos según tu necesidad y encuentra una opción más
            fácilmente.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden border border-[#efe7dd] bg-[#efe7dd] sm:grid-cols-2 lg:grid-cols-4">
          {NEEDS.map((need) => (
            <Link
              key={need.title}
              href={need.href}
              className="group flex min-h-48 flex-col justify-between bg-[#faf8f5] p-5 transition-colors duration-300 hover:bg-[#f5f1eb]"
            >
              <div>
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[6px] border border-[#9b89a8]/35 text-[#7f6d8a]">
                  <need.icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-[#2e2b2b]">
                  {need.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#2e2b2b]/62">
                  {need.text}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#7f6d8a]">
                Ver opciones
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
