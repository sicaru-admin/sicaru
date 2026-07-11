"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "528281111023";
const MESSAGE =
  "\u00a1Hola! Me interesa saber m\u00e1s sobre los productos de Sicar\u00fa.";

export function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-pulse tap-feedback fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-[8px] border border-[#faf8f5]/35 bg-[#7f6d8a] text-[#faf8f5] transition-colors hover:bg-[#8e7a9e]"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.8} />
    </a>
  );
}
