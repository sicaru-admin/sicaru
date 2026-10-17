type ShippingPrice = {
  amount?: number | null;
  price_type?: string;
  calculated_price?: {
    calculated_amount?: number | null;
    currency_code?: string | null;
  } | null;
};

type ShippingOption = ShippingPrice & { id: string };

type ShippingCart = {
  shipping_methods?: {
    shipping_option_id?: string | null;
    amount?: number;
    is_tax_inclusive?: boolean;
  }[] | null;
  shipping_total?: number;
  total?: number;
};

export type DhlQuote =
  | { status: "quote_required"; reason: string; message: string }
  | {
      status: "available";
      shipping_option_id: string;
      amount: number;
      currency_code: "mxn";
    };

export type LocalDeliveryItem = {
  quantity: number;
  title?: string | null;
  product_title?: string | null;
  variant_title?: string | null;
  unit_price?: number | null;
};

export function getShippingOptionPrice(option: ShippingPrice): number | null {
  if (
    option.price_type === "calculated" &&
    option.calculated_price?.calculated_amount == null
  ) {
    return null;
  }
  const amount = option.calculated_price?.calculated_amount ?? option.amount;
  return typeof amount === "number" && Number.isFinite(amount) && amount >= 0
    ? amount
    : null;
}

export function getParcelShippingOptions<T extends ShippingOption>(
  options: T[],
  quote?: DhlQuote
): T[] {
  // Only the backend can approve weight, packaging, coverage and price.
  // The old client-side list of IDs cannot approve a local $49 option.
  if (quote?.status !== "available" || quote.currency_code !== "mxn" ||
      !Number.isFinite(quote.amount) || quote.amount <= 0) return [];
  return options.filter(
    (option) => option.id === quote.shipping_option_id &&
      getShippingOptionPrice(option) === quote.amount
  );
}

export function hasParcelShippingMethod(
  cart: ShippingCart,
  options: ShippingOption[]
): boolean {
  const methods = cart.shipping_methods ?? [];
  if (methods.length !== 1) return false;
  const option = options.find((o) => o.id === methods[0].shipping_option_id);
  const amount = option ? getShippingOptionPrice(option) : null;
  return amount !== null && amount > 0 &&
    methods[0].amount === amount && methods[0].is_tax_inclusive === true &&
    cart.shipping_total === amount && Number.isFinite(cart.total) &&
    cart.total! >= amount;
}

export function getWhatsAppUrl(phone: string, message = ""): string | null {
  const digits = phone.replace(/[^0-9]/g, "");
  if (!/^[1-9][0-9]{9,14}$/.test(digits)) return null;
  return "https://wa.me/" + digits + (message ? "?text=" + encodeURIComponent(message) : "");
}

export function getLocalDeliveryMessage(items: LocalDeliveryItem[] = [], subtotal?: number | null): string {
  const products = items.map(item => {
    const title = item.product_title || item.title || "Producto";
    const variant = item.variant_title && item.variant_title !== "Default Variant" ? " (" + item.variant_title + ")" : "";
    return "- " + item.quantity + " × " + title + variant;
  });
  const amount = typeof subtotal === "number" && Number.isFinite(subtotal) && subtotal >= 0
    ? new Intl.NumberFormat("es-MX", {style:"currency", currency:"MXN"}).format(subtotal) + " MXN" : "por confirmar";
  return ["Hola, quiero coordinar una entrega local en Cadereyta con Sicarú.", "",
    ...products, "", "Subtotal de productos: " + amount,
    "Entrega local: $40 MXN fuera del checkout (se coordina por WhatsApp).",
    "¿Me confirman disponibilidad y cobertura?"].join("\n");
}

export function getLocalDeliveryWhatsAppUrl(phone: string, items: LocalDeliveryItem[] = [], subtotal?: number | null): string | null {
  return getWhatsAppUrl(phone, getLocalDeliveryMessage(items, subtotal));
}

export function getDhlWhatsAppUrl(phone: string, items: LocalDeliveryItem[] = []): string | null {
  const products = items.map(item => "- " + item.quantity + " × " +
    (item.product_title || item.title || "Producto") +
    (item.variant_title && item.variant_title !== "Default Variant" ? " (" + item.variant_title + ")" : ""));
  return getWhatsAppUrl(phone, ["Hola, quisiera consultar una cotización DHL para estos productos:", ...products,
    "Necesito confirmar costo y cobertura antes de pagar."].join("\n"));
}
