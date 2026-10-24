import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function WhatsAppBanner() {
  return <section aria-label="Contacto y opciones para profesionales" className="px-4 py-5 sm:px-8 sm:py-7 lg:px-10">
    <div className="mx-auto grid max-w-[1320px] gap-5 rounded-xl bg-[#efe7dd] px-4 py-5 sm:px-6 md:grid-cols-[1fr_1.7fr] md:gap-8 md:py-6">
      <div className="flex flex-col items-start justify-center gap-3">
        <h2 className="text-base font-semibold text-[#2e2b2b] sm:text-lg">¿Buscas algún producto?</h2>
        <a href="https://wa.me/528281136652" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#7f6d8a]/45 px-4 py-2 text-xs font-semibold text-[#2e2b2b] transition-colors hover:bg-[#faf8f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f6d8a] sm:text-sm"><MessageCircle className="h-4 w-4" aria-hidden="true" />Escríbenos por WhatsApp</a>
      </div>
      <div className="border-t border-[#7f6d8a]/25 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0" aria-labelledby="sicaru-profesionales">
        <p className="text-[0.65rem] font-semibold uppercase leading-5 tracking-[0.14em] text-[#2e2b2b] sm:text-xs">SICARÚ PROFESIONALES</p>
        <h2 id="sicaru-profesionales" className="mt-2 max-w-xl font-heading text-2xl font-medium leading-tight text-[#2e2b2b] lg:text-3xl">Para quienes hacen de la belleza su profesión.</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#2e2b2b]/80">Valoramos tu experiencia y apoyamos tu trabajo con productos profesionales y precios especiales.</p>
        <Link href="/salon-pro" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-[#2e2b2b] underline decoration-[#8e7a9e] underline-offset-4 hover:decoration-[#7f6d8a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f6d8a]">Consultar precios profesionales</Link>
      </div>
    </div>
  </section>;
}
