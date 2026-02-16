import { Phone } from "lucide-react";

const WHATSAPP_NUMBER = "528281111023";
const WHATSAPP_MSG =
  "¡Hola! Tengo una duda sobre los productos de Sicarú.";

export function WhatsAppBanner() {
  return (
    <section className="bg-[#25D366] py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 text-center md:flex-row md:justify-between md:text-left">
        <p className="text-lg font-semibold text-white md:text-xl">
          &iquest;Tienes dudas? Escr&iacute;benos por WhatsApp — respondemos en
          minutos
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-[#25D366] transition-transform hover:scale-105"
        >
          <Phone className="h-5 w-5" />
          Abrir WhatsApp
        </a>
      </div>
    </section>
  );
}
