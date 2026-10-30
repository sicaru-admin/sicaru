import type { HttpTypes } from "@medusajs/types";
import { STORE } from "./constants/store";
import { getApprovedPrice } from "./product-retail";

/** Preserve the exact selected reference when the customer continues to WhatsApp. */
export function getProductWhatsAppHref(
  product: HttpTypes.StoreProduct,
  variantId?: string | null,
) {
  const variant = variantId
    ? product.variants?.find((item) => item.id === variantId)
    : undefined;
  const price = getApprovedPrice(product, variant);
  const lines = [`Hola, me interesa ${product.title || "este producto"}.`];

  if (variant?.title) lines.push(`Variante: ${variant.title}.`);
  if (variant?.sku) lines.push(`SKU: ${variant.sku}.`);
  if (price) {
    const formattedPrice = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: price.currency_code || "MXN",
    }).format(price.calculated_amount);
    lines.push(`Precio publicado: ${formattedPrice}.`);
  }

  lines.push(price
    ? "¿Me pueden confirmar disponibilidad?"
    : "¿Me pueden confirmar precio y disponibilidad?");

  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}
