import type { ReactNode } from "react";
import { STORE } from "@/lib/constants/store";
import { getWhatsAppUrl } from "@/lib/shipping";

export function WhatsAppLink({message = "", children, className = ""}: {
  message?: string; children: ReactNode; className?: string;
}) {
  const url = getWhatsAppUrl(STORE.whatsapp, message);
  if (!url) return <span role="link" aria-disabled="true" className={className}>
    {children}<span className="block text-xs">WhatsApp pendiente de confirmar</span>
  </span>;
  return <a href={url} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}
