import { STORE } from "@/lib/constants/store";

/**
 * SICARÚ remains an informational catalog: queries prepare WhatsApp messages,
 * never promise stock, send a message automatically or create an order.
 */
function normalizeSubject(subject: string): string {
  return subject.normalize("NFC").trim().replace(/\s+/g, " ").slice(0, 120);
}

function inquiryLink(message: string): string {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function getCatalogSearchWhatsAppHref(query: string): string {
  const subject = normalizeSubject(query);
  return inquiryLink(
    subject
      ? `Hola, estoy buscando "${subject}". ¿Me pueden ayudar a encontrarlo y confirmar disponibilidad y precio?`
      : "Hola, quisiera consultar un producto de belleza profesional con SICARÚ."
  );
}

export function getCatalogCategoryWhatsAppHref(categoryName: string): string {
  const subject = normalizeSubject(categoryName);
  return inquiryLink(
    `Hola, quisiera consultar productos de ${subject || "belleza profesional"}. ¿Me pueden orientar sobre opciones y disponibilidad?`
  );
}
