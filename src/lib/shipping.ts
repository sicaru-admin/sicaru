type ShippingPrice = {
  amount?: number | null;
  price_type?: string;
  calculated_price?: {
    calculated_amount?: number | null;
    currency_code?: string | null;
  } | null;
};

type ShippingOption = ShippingPrice & { id: string; is_tax_inclusive?: boolean };

type ShippingCart = {
  currency_code?: string;
  item_total?: number;
  shipping_methods?: {
    shipping_option_id?: string | null;
    amount?: number;
    is_tax_inclusive?: boolean;
    data?: Record<string, unknown> | null;
  }[] | null;
  shipping_total?: number;
  shipping_discount_total?: number;
  total?: number;
};

export type DhlQuote =
  | { status: "quote_required"; reason: string; message: string; detail?: string }
  | {
      status: "available";
      mode: "commercial";
      approval_status: "approved";
      coverage_verified: true;
      is_tax_inclusive: true;
      quote_id: string;
      fingerprint: string;
      quoted_at: string;
      expires_at: string;
      shipping_option_id: string;
      amount: number;
      currency_code: "mxn";
      delivery_estimate?: string;
    };

export type ParcelItem = {
  quantity: number;
  title?: string | null;
  product_title?: string | null;
  variant_title?: string | null;
  unit_price?: number | null;
};

// Medusa v2 returns MXN, not cents. Compare integer cents without accepting
// sub-cent values or silently rounding a stale commercial amount.
function minorUnits(amount: unknown): number | null {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) return null;
  const cents = Math.round(amount * 100);
  return Number.isSafeInteger(cents) && Math.abs(amount * 100 - cents) < 0.000001 ? cents : null;
}

export function isCurrentParcelQuote(quote?: DhlQuote, now = Date.now()): quote is Extract<DhlQuote, {status: "available"}> {
  if (quote?.status !== "available" || quote.mode !== "commercial" ||
      quote.approval_status !== "approved" || quote.coverage_verified !== true ||
      quote.is_tax_inclusive !== true || quote.currency_code !== "mxn" ||
      !quote.shipping_option_id || !quote.quote_id || !quote.fingerprint) return false;
  const amount = minorUnits(quote.amount);
  const quotedAt = Date.parse(quote.quoted_at);
  const expiresAt = Date.parse(quote.expires_at);
  return amount !== null && amount > 0 && Number.isFinite(quotedAt) && Number.isFinite(expiresAt) &&
    quotedAt <= now && expiresAt > now && expiresAt > quotedAt;
}

export function getShippingOptionPrice(option: ShippingPrice): number | null {
  if (option.price_type === "calculated" && option.calculated_price?.calculated_amount == null) return null;
  const amount = option.calculated_price?.calculated_amount ?? option.amount;
  return minorUnits(amount) !== null ? amount! : null;
}

export function getParcelShippingOptions<T extends ShippingOption>(options: T[], quote?: DhlQuote): T[] {
  // Approval, coverage, expiry and identity come from Medusa. An old public
  // allowlist or the former manual test option can never approve a quote.
  if (!isCurrentParcelQuote(quote)) return [];
  return options.filter(option => option.id === quote.shipping_option_id &&
    option.is_tax_inclusive === true &&
    (!option.calculated_price?.currency_code || option.calculated_price.currency_code.toLowerCase() === "mxn") &&
    minorUnits(getShippingOptionPrice(option)) === minorUnits(quote.amount));
}

export function hasParcelShippingMethod(cart: ShippingCart, options: ShippingOption[], quote?: DhlQuote): boolean {
  if (!isCurrentParcelQuote(quote) || cart.currency_code?.toLowerCase() !== "mxn") return false;
  const methods = cart.shipping_methods ?? [];
  if (methods.length !== 1) return false;
  const method = methods[0];
  const option = getParcelShippingOptions(options, quote).find(o => o.id === method.shipping_option_id);
  const amount = option ? minorUnits(getShippingOptionPrice(option)) : null;
  const products = minorUnits(cart.item_total);
  const total = minorUnits(cart.total);
  return amount !== null && amount > 0 && products !== null && total !== null &&
    minorUnits(method.amount) === amount && method.is_tax_inclusive === true &&
    minorUnits(cart.shipping_total) === amount && minorUnits(cart.shipping_discount_total) === 0 &&
    total === products + amount &&
    method.data?.sicaru_quote_id === quote.quote_id &&
    method.data?.sicaru_quote_fingerprint === quote.fingerprint;
}

export function getWhatsAppUrl(phone: string, message = ""): string | null {
  const digits = phone.replace(/[^0-9]/g, "");
  if (!/^[1-9][0-9]{9,14}$/.test(digits)) return null;
  return "https://wa.me/" + digits + (message ? "?text=" + encodeURIComponent(message) : "");
}

export function getParcelQuoteMessage(items: ParcelItem[] = [], subtotal?: number | null): string {
  const products = items.map(item => "- " + item.quantity + " × " +
    (item.product_title || item.title || "Producto") +
    (item.variant_title && item.variant_title !== "Default Variant" ? " (" + item.variant_title + ")" : ""));
  const validSubtotal = minorUnits(subtotal) !== null;
  return ["Hola, quisiera consultar una cotización de paquetería para estos productos:", ...products,
    ...(validSubtotal ? ["Subtotal de productos: " + new Intl.NumberFormat("es-MX", {style: "currency", currency: "MXN"}).format(subtotal!) + " MXN"] : []),
    "Envío por cotizar. Necesito confirmar costo, IVA y cobertura antes de pagar."].join("\n");
}

export function getDhlWhatsAppUrl(phone: string, items: ParcelItem[] = []): string | null {
  return getWhatsAppUrl(phone, getParcelQuoteMessage(items));
}
