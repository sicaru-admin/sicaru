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
      <Image
        src="/images/salon-tratamiento-cabello.jpg"
        alt="Clienta relajándose mientras recibe tratamiento capilar profesional en salón de belleza mexicano"
        fill
        className="object-cover opacity-20"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2e2b2b]/80 via-[#7f6d8a]/80 to-[#9b89a8]/50" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[1fr_0.8fr] md:items-center">
        <div>
          <span className="mb-4 inline-block border border-[#efe7dd]/40 px-4 py-1 text-sm font-medium text-[#efe7dd]">
            Para Profesionales
          </span>

          <h2 className="font-heading text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Stock profesional para salones que cuidan su resultado
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            Si compras para salón, te ayudamos a armar una selección práctica:
            productos de rotación, tratamientos de venta y básicos para servicio.
          </p>
        </div>

        <div>
          <ul className="flex flex-col gap-3 text-left">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-white/90">
                <CheckCircle className="h-5 w-5 shrink-0 text-[#efe7dd]" />
                <span className="text-sm md:text-base">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/salon-pro"
              className="inline-flex items-center justify-center gap-2 bg-[#faf8f5] px-7 py-3 text-sm font-semibold text-[#2e2b2b] transition-colors hover:bg-[#efe7dd]"
            >
              Solicitar acceso
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/45 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
