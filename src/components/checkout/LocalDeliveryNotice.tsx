import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { getLocalDeliveryMessage, LOCAL_DELIVERY_COVERAGE, LOCAL_DELIVERY_OUTSKIRTS, type LocalDeliveryItem } from "@/lib/shipping";
export function LocalDeliveryNotice({items, subtotal}: {
  items?: LocalDeliveryItem[] | null; subtotal?: number | null;
}) {
  return <aside aria-label="Entrega local en Cadereyta" className="mt-5 border-t border-gray-200 pt-5">
    <WhatsAppLink message={getLocalDeliveryMessage(items ?? [], subtotal)}
      className="inline-flex min-h-11 items-center text-sm font-semibold text-green-800 underline underline-offset-4">
      ¿Entrega local? Pídela por WhatsApp · $40
    </WhatsAppLink>
    <p className="mt-2 text-xs leading-relaxed text-gray-600">
      {LOCAL_DELIVERY_COVERAGE}
    </p>
    <p className="mt-2 text-xs leading-relaxed text-gray-600">
      {LOCAL_DELIVERY_OUTSKIRTS}
    </p>
  </aside>;
}
