import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "528281111023";
const WHATSAPP_MSG =
  "¡Hola! Tengo una duda sobre los productos de Sicarú.";

export function WhatsAppBanner() {
  return (
    <section className="bg-[#f5f1eb] py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-5 text-center sm:px-8 md:flex-row md:justify-between md:text-left">
        <div>
          <p className="sicaru-eyebrow">
            05 · Atención cercana
          </p>
          <p className="mt-2 font-heading text-2xl font-semibold text-[#2e2b2b] md:text-3xl">
            Si no sabes qué elegir, te orientamos por WhatsApp.
          </p>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="sicaru-button-primary shrink-0"
        >
          <MessageCircle className="h-5 w-5" />
          Abrir WhatsApp
        </a>
      </div>
    </section>
  );
}
