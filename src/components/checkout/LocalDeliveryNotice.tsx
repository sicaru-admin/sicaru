import { STORE } from "@/lib/constants/store";
import {
  getLocalDeliveryWhatsAppUrl,
  type LocalDeliveryItem,
} from "@/lib/shipping";

export function LocalDeliveryNotice({
  items,
}: {
  items?: LocalDeliveryItem[] | null;
}) {
  return (
    <aside
      aria-label="Entrega local en Cadereyta"
      className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5"
    >
      <p className="font-semibold text-gray-900">¿Entrega local en Cadereyta?</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        El envío local cuesta $40 MXN y se coordina por WhatsApp, fuera del
        checkout. Te confirmamos disponibilidad y cobertura antes de acordar la
        entrega.
      </p>
      <a
        href={getLocalDeliveryWhatsAppUrl(STORE.whatsapp, items ?? [])}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
      >
        Coordinar entrega local por WhatsApp
        <span className="sr-only"> (abre una nueva pestaña)</span>
      </a>
    </aside>
  );
}

