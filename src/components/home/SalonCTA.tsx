import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, MessageCircle } from "lucide-react";

const BENEFITS = [
  "Precios mayoreo desde 12 piezas",
  "Envío semanal dedicado",
  "Facturación CFDI automática",
  "Asesoría personalizada",
];

const WHATSAPP_NUMBER = "528281111023";
const WHATSAPP_MSG =
  "¡Hola! Me interesa el programa Sicarú PRO para profesionales.";

export function SalonCTA() {
  return (
    <section className="relative overflow-hidden bg-[#7f6d8a] py-16 md:py-20">
      <div className="absolute left-0 top-0 h-px w-full bg-[#faf8f5]/20" />
      <div className="absolute -right-12 top-10 h-48 w-48 border border-[#faf8f5]/20" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_0.8fr_0.75fr] lg:items-center">
        <div>
          <span className="mb-4 inline-block rounded-[6px] border border-[#efe7dd]/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#efe7dd]">
            Salón Pro
          </span>

          <h2 className="font-heading text-3xl font-semibold text-[#faf8f5] md:text-4xl lg:text-5xl">
            Sicarú para profesionales
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-8 text-[#faf8f5]/75 md:text-lg">
            Encuentra productos de coloración, decoloración, tratamientos,
            herramientas y líneas técnicas para tu trabajo en salón.
          </p>
        </div>

        <div>
          <ul className="flex flex-col gap-3 text-left">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-[#faf8f5]/90">
                <CheckCircle className="h-5 w-5 shrink-0 text-[#efe7dd]" />
                <span className="text-sm md:text-base">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/salon-pro"
              className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#faf8f5] px-7 py-3 text-sm font-semibold text-[#2e2b2b] transition-colors hover:bg-[#efe7dd]"
            >
              Ver productos profesionales
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#faf8f5]/45 px-7 py-3 text-sm font-semibold text-[#faf8f5] transition-colors hover:bg-[#faf8f5]/10"
            >
              <MessageCircle className="h-4 w-4" />
              Consultar disponibilidad
            </a>
          </div>
        </div>

        <div className="relative min-h-72 overflow-hidden border border-[#faf8f5]/25 bg-[#faf8f5]/10 p-3">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/salon-colorista-muestrario.jpg"
              alt="Colorista profesional revisando muestrario de color para trabajo en salón"
              fill
              sizes="(max-width: 1024px) 100vw, 28vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
