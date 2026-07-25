type CartLineVariantOption = {
  value?: string | null;
  option?: {
    title?: string | null;
  } | null;
};

export type CartLineVariantDetails = {
  title?: string | null;
  product_title?: string | null;
  variant_title?: string | null;
  variant_option_values?: Record<string, unknown> | null;
  variant?: {
    title?: string | null;
    options?: CartLineVariantOption[] | null;
  } | null;
};

function normalize(value?: string | null) {
  return value?.trim().toLocaleLowerCase("es-MX") ?? "";
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isToneTitle(title: string) {
  return /^\d{1,2}(?:[./-]\d+)?\s+\S+/.test(title.trim());
}

export function getCartLineVariantLabel(item: CartLineVariantDetails) {
  const optionValues = item.variant_option_values ?? {};

  for (const [name, rawValue] of Object.entries(optionValues)) {
    const value = clean(rawValue);
    if (normalize(name) === "tono" && value) {
      return "Tono: " + value;
    }
  }

  const toneOption = item.variant?.options?.find(
    (option) => normalize(option.option?.title) === "tono" && clean(option.value)
  );

  if (toneOption) {
    return "Tono: " + clean(toneOption.value);
  }

  const variantTitle = clean(item.variant_title ?? item.variant?.title);
  if (variantTitle && isToneTitle(variantTitle)) {
    return "Tono: " + variantTitle;
  }

  return null;
}
