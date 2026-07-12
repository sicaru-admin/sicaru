import { MapPin, MessageCircle, Navigation, Clock } from "lucide-react";
import { STORE } from "@/lib/constants/store";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  STORE.address.full
)}`;
const WHATSAPP_MESSAGE =
  "Hola, quiero información sobre productos y disponibilidad en Sicarú.";

export function LocationContact() {
  return (
    <section className="bg-[#f5f1eb] py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="sicaru-eyebrow">09 · Ubicación y contacto</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-[#2e2b2b] md:text-5xl">
            Visítanos o escríbenos para revisar disponibilidad
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-6 text-[#2e2b2b]/72">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#7f6d8a]" />
              <span>{STORE.address.full}</span>
            </p>
            <p className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#7f6d8a]" />
              <span>{STORE.hours}</span>
            </p>
            <p className="flex gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#7f6d8a]" />
              <span>{STORE.phone}</span>
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sicaru-button-secondary"
            >
              <Navigation className="h-4 w-4" />
              Cómo llegar
            </a>
            <a
              href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sicaru-button-primary"
            >
              <MessageCircle className="h-4 w-4" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>

        <div className="min-h-[320px] overflow-hidden border border-[#d8cedc] bg-[#faf8f5] p-3">
          <iframe
            title="Mapa de Sicarú"
            src={STORE.googleMapsEmbedUrl}
            className="h-[320px] w-full border-0 md:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
