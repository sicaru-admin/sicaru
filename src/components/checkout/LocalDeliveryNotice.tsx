import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { getLocalDeliveryMessage, type LocalDeliveryItem } from "@/lib/shipping";
export function LocalDeliveryNotice({items, subtotal}: {
  items?: LocalDeliveryItem[] | null; subtotal?: number | null;
}) {
  return <aside aria-label="Entrega local en Cadereyta" className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">
    <p className="font-semibold text-gray-900">¿Entrega local en Cadereyta?</p>
    <p className="mt-2 text-sm leading-relaxed text-gray-700">
      Entrega local de $40 MXN, coordinada por WhatsApp fuera del checkout. Confirmaremos disponibilidad y cobertura.
    </p>
    <WhatsAppLink message={getLocalDeliveryMessage(items ?? [], subtotal)}
      className="mt-4 inline-block rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white">
      Pedir entrega local por WhatsApp · $40
    </WhatsAppLink>
  </aside>;
}
