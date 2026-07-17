import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const BENEFITS = [
  "Coloración profesional",
  "Tratamientos capilares",
  "Herramientas y accesorios",
  "Atención personalizada",
];


export function SalonCTA() {
  return (
    <section className="bg-[#f5f1eb] py-12 md:py-14">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-stretch">
        <div className="bg-[#7f6d8a] p-6 md:p-8 lg:p-10">
          <span className="mb-4 inline-block text-sm font-medium text-[#efe7dd]">
            Para estilistas
          </span>

          <h2 className="font-heading text-3xl font-semibold text-[#faf8f5] md:text-4xl lg:text-5xl">
            Sicarú para profesionales
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-8 text-[#efe7dd] md:text-lg">
            Encuentra coloración, tratamientos, herramientas y productos para
            tu trabajo como estilista.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-[#faf8f5]">
                <CheckCircle className="h-5 w-5 shrink-0 text-[#efe7dd]" />
                <span className="text-sm md:text-base">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex">
            <Link
              href="/salon-pro"
              className="inline-flex items-center justify-center gap-2 bg-[#faf8f5] px-7 py-3 text-sm font-semibold text-[#7f6d8a] transition-colors hover:bg-[#efe7dd]"
            >
              Consultar disponibilidad
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[260px] overflow-hidden bg-[#efe7dd] sm:min-h-[340px] lg:min-h-full">
          <Image
            src="/images/salon-tratamiento-cabello.jpg"
            alt="Clienta relajándose mientras recibe tratamiento capilar profesional en salón de belleza mexicano"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
      </div>
    </section>
  );
}
