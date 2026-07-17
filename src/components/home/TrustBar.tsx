"use client";

import { Store, BadgeCheck, MessageCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const items = [
  { icon: Store, text: "Atención personalizada" },
  { icon: BadgeCheck, text: "Productos profesionales" },
  { icon: MessageCircle, text: "Consulta disponibilidad por WhatsApp" },
];

export function TrustBar() {
  return (
    <section className="border-y border-[#efe7dd] bg-[#faf8f5] py-4">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:overflow-x-auto">
        <div className="grid gap-3 md:flex md:min-w-max md:items-center md:justify-around md:gap-8">
          {items.map((item, i) => (
            <ScrollReveal key={item.text} delay={i * 0.1} direction="up">
              <div className="flex items-center gap-2 text-sm leading-5 text-[#2e2b2b]/70 md:whitespace-nowrap">
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
