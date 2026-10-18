type CartLineVariantOption = { value?: string | null; option?: {title?: string | null} | null };
export type CartLineVariantDetails = {
  title?: string | null; product_title?: string | null; variant_title?: string | null;
  variant_option_values?: Record<string, unknown> | null;
  variant?: {title?: string | null; options?: CartLineVariantOption[] | null} | null;
};
const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
const normalize = (value: string) => value.toLocaleLowerCase("es-MX");
export function getCartLineVariantLabel(item: CartLineVariantDetails) {
  const options = new Map<string, string>();
  for (const [name, raw] of Object.entries(item.variant_option_values ?? {})) {
    if (clean(raw)) options.set(normalize(name), clean(raw));
  }
  for (const option of item.variant?.options ?? []) {
    const name = clean(option.option?.title), value = clean(option.value);
    if (name && value && !options.has(normalize(name))) options.set(normalize(name), value);
  }
  const labels = [...options].map(([name, value]) => {
    const label = ["tono", "color"].includes(name) ? "Tono" :
      ["presentación", "presentacion", "tamaño", "tamano", "capacidad"].includes(name) ? "Presentación" : name;
    return label + ": " + value;
  });
  if (labels.length) return labels.join(" · ");
  const title = [item.variant_title, item.variant?.title].map(clean)
    .find(value => value && !["default variant", "default", "variante predeterminada"].includes(normalize(value)));
  if (!title) return null;
  if (/^\d+(?:[.,]\d+)?\s*(?:ml|l|g|kg|oz|pzas?|piezas?)\.?$/i.test(title)) return "Presentación: " + title;
  if (/^\d{1,2}[./-]\d+(?:\s+\S.*)?$/.test(title) || /^\d{1,2}\s+\S+/.test(title)) return "Tono: " + title;
  return "Variante: " + title;
}
