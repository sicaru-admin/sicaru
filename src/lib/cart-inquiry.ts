import { STORE } from "@/lib/constants/store";
import { getCartLineVariantLabel, type CartLineVariantDetails } from "@/components/cart/cart-line-variant";

type CartInquiryOption = {
  value?: string | null;
  option?: { title?: string | null } | null;
};

export type CartInquiryItem = CartLineVariantDetails & {
  title?: string | null;
  product_title?: string | null;
  variant_title?: string | null;
  variant_sku?: string | null;
  quantity?: number | null;
  variant?: {
    title?: string | null;
    sku?: string | null;
    options?: CartInquiryOption[] | null;
  } | null;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es-MX");
}

function getOption(item: CartInquiryItem, names: string[]) {
  const expected = new Set(names.map(normalize));
  for (const [name, rawValue] of Object.entries(item.variant_option_values ?? {})) {
    if (expected.has(normalize(name))) {
      const value = clean(rawValue);
      if (value) return value;
    }
  }
  const option = item.variant?.options?.find((entry) =>
    expected.has(normalize(clean(entry.option?.title))) && clean(entry.value)
  );
  return option ? clean(option.value) : "";
}

function getPresentation(item: CartInquiryItem) {
  const explicit = getOption(item, ["Presentación", "Presentacion", "Tamaño", "Tamano", "Contenido"]);
  if (explicit) return explicit;

  const variantTitle = clean(item.variant_title ?? item.variant?.title);
  const toneLabel = getCartLineVariantLabel(item);
  const looksLikeDefault = normalize(variantTitle) === "default" || normalize(variantTitle) === "default variant";
  if (!variantTitle || toneLabel || looksLikeDefault) return "";
  return variantTitle;
}

export function getCartWhatsAppHref(items: CartInquiryItem[]) {
  const lines = ["Hola, quisiera consultar disponibilidad de estos productos:"];

  for (const item of items) {
    const product = clean(item.product_title) || clean(item.title) || "Producto";
    const presentation = getPresentation(item);
    const tone = getCartLineVariantLabel(item)?.replace(/^Tono:\s*/i, "") ?? "";
    const sku = clean(item.variant_sku ?? item.variant?.sku);
    const quantity = Math.max(1, Number.isFinite(item.quantity) ? Number(item.quantity) : 1);

    lines.push("", `• ${product}`);
    if (presentation) lines.push(`Presentación: ${presentation}`);
    if (tone) lines.push(`Tono: ${tone}`);
    if (sku) lines.push(`SKU: ${sku}`);
    lines.push(`Cantidad: ${quantity}`);
  }

  lines.push("", "¿Me pueden confirmar disponibilidad y total?");
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}
