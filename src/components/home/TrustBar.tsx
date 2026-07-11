"use client";

import { Truck, Store, BadgeCheck, MessageCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const items = [
  { icon: Truck, text: "Entrega local en Cadereyta" },
  { icon: Store, text: "Compra en tienda o en línea" },
  { icon: BadgeCheck, text: "Productos profesionales" },
  { icon: MessageCircle, text: "Asesoría por WhatsApp" },
];

export function TrustBar() {
  return (
    <section className="border-y border-[#efe7dd] bg-[#faf8f5] py-4">
      <div className="mx-auto max-w-7xl overflow-x-auto px-5 sm:px-8">
        <div className="flex min-w-max items-center justify-around gap-6 md:gap-8">
          {items.map((item, i) => (
            <ScrollReveal key={item.text} delay={i * 0.1} direction="up">
              <div className="flex items-center gap-2 whitespace-nowrap text-sm text-[#2e2b2b]/70">
                <item.icon className="h-5 w-5 shrink-0 text-[#8e7a9e]" />
                <span className="font-medium">{item.text}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
