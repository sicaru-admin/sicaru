import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { getParcelQuoteMessage, type ParcelItem } from "@/lib/shipping";

export function ParcelQuoteNotice({items, subtotal}: {
  items?: ParcelItem[] | null; subtotal?: number | null;
}) {
  return <aside aria-label="Cotización de paquetería" className="mt-4 border-t border-sicaru-purple-200 pt-4">
    <p className="text-sm font-medium">Envío por cotizar</p>
    <p className="mt-1 text-xs leading-5 text-gray-600">Confirmaremos cobertura y costo de paquetería antes de iniciar el pago. Tus productos siguen guardados.</p>
    <WhatsAppLink message={getParcelQuoteMessage(items ?? [], subtotal)}
      className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-green-800 underline underline-offset-4">Consultar envío por WhatsApp</WhatsAppLink>
  </aside>;
}
