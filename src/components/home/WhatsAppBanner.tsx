import { MessageCircle } from "lucide-react";

export function WhatsAppBanner() {
  return <section className="px-4 py-5 sm:px-8 sm:py-7 lg:px-10">
    <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-3 rounded-xl bg-[#efe7dd] px-4 py-5 sm:flex-row sm:items-center sm:px-6">
      <h2 className="text-base font-semibold text-[#2e2b2b] sm:text-lg">¿Buscas algún producto?</h2>
      <a href="https://wa.me/528281136652" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#7f6d8a]/45 px-4 py-2 text-xs font-semibold text-[#7f6d8a] transition-colors hover:bg-[#faf8f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f6d8a] sm:text-sm"><MessageCircle className="h-4 w-4" aria-hidden="true" />Escríbenos por WhatsApp</a>
    </div>
  </section>;
}
