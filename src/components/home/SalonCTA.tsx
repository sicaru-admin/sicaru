import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

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
    <section className="relative overflow-hidden bg-sicaru-purple-700 py-16 md:py-20">
      <Image
        src="/images/salon-tratamiento-cabello.jpg"
        alt="Clienta relajándose mientras recibe tratamiento capilar profesional en salón de belleza mexicano"
        fill
        className="object-cover opacity-15"
        sizes="100vw"
      />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <span className="mb-4 inline-block rounded-full border border-sicaru-gold/40 px-4 py-1 text-sm font-medium text-sicaru-gold">
          Para Profesionales
        </span>

        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          &iquest;Eres Profesional? &Uacute;nete a Sicar&uacute; PRO
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg">
          Precios de distribuidora en Küül, Voglia, Nekane y todas nuestras
          marcas
        </p>

        <ul className="mx-auto mt-8 flex max-w-lg flex-col gap-3 text-left">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-3 text-white/90">
              <CheckCircle className="h-5 w-5 shrink-0 text-sicaru-gold" />
              <span className="text-sm md:text-base">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/salon-pro"
            className="inline-block rounded-full bg-[#faf8f5] px-8 py-3 font-semibold text-[#2e2b2b] transition-colors hover:bg-[#efe7dd]"
          >
            Solicitar Acceso PRO
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border-2 border-[#25D366] px-8 py-3 font-semibold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
          >
            Pregunta por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
