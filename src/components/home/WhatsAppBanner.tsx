import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "528281111023";
const WHATSAPP_MSG =
  "¡Hola! Tengo una duda sobre los productos de Sicarú.";

export function WhatsAppBanner() {
  return (
    <section className="bg-[#2e2b2b] py-9">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-5 text-center sm:px-8 md:flex-row md:justify-between md:text-left">
        <div>
          <p className="text-xs font-semibold uppercase text-[#9b89a8]">
            Atención cercana
          </p>
          <p className="mt-2 text-lg font-semibold text-[#faf8f5] md:text-xl">
            Si no sabes qué elegir, te orientamos por WhatsApp.
          </p>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 bg-[#faf8f5] px-7 py-3 text-sm font-semibold text-[#2e2b2b] transition-colors hover:bg-[#efe7dd]"
        >
          <MessageCircle className="h-5 w-5 text-[#25D366]" />
          Abrir WhatsApp
        </a>
      </div>
    </section>
  );
}
