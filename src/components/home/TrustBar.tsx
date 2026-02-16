import { Truck, Store, BadgeCheck, MessageCircle } from "lucide-react";

const items = [
  { icon: Truck, text: "Envío Mismo Día Cadereyta" },
  { icon: Store, text: "Paga con OXXO" },
  { icon: BadgeCheck, text: "Distribuidor Autorizado" },
  { icon: MessageCircle, text: "Atención por WhatsApp" },
];

export function TrustBar() {
  return (
    <section className="bg-sicaru-purple-50 py-4">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4">
        <div className="flex min-w-max items-center justify-around gap-6 md:gap-0">
          {items.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 whitespace-nowrap text-sm text-sicaru-purple-800"
            >
              <item.icon className="h-5 w-5 shrink-0 text-sicaru-purple-600" />
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
