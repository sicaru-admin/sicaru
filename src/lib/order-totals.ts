type TotalsSource = {
  item_subtotal?: number | null;
  item_total?: number | null;
  subtotal?: number | null;
  shipping_subtotal?: number | null;
  shipping_total?: number | null;
  tax_total?: number | null;
  item_tax_total?: number | null;
  shipping_tax_total?: number | null;
  discount_total?: number | null;
  total?: number | null;
  original_total?: number | null;
};

export type NormalizedOrderTotals = {
  products: number;
  shipping: number;
  taxes: number;
  itemTaxes: number;
  shippingTaxes: number;
  discount: number;
  subtotal: number;
  total: number;
  originalTotal?: number;
};

function asAmount(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function normalizeOrderTotals(
  source: TotalsSource | null | undefined
): NormalizedOrderTotals {
  const subtotal = asAmount(source?.subtotal);
  const products = asAmount(
    source?.item_subtotal ?? source?.item_total ?? source?.subtotal
  );
  const shippingTaxes = asAmount(source?.shipping_tax_total);
  const shippingFromSubtotal = subtotal > products ? subtotal - products : null;
  const shipping = asAmount(
    source?.shipping_subtotal ??
      shippingFromSubtotal ??
      (source?.shipping_total == null
        ? undefined
        : source.shipping_total - shippingTaxes)
  );
  const taxes = asAmount(source?.tax_total);
  const itemTaxes = asAmount(source?.item_tax_total);
  const discount = asAmount(source?.discount_total);
  const displaySubtotal = subtotal || products + shipping;
  const total = asAmount(source?.total);
  const originalTotal =
    source?.original_total == null ? undefined : asAmount(source.original_total);

  return {
    products,
    shipping,
    taxes,
    itemTaxes,
    shippingTaxes,
    discount,
    subtotal: displaySubtotal,
    total,
    originalTotal,
  };
}

export function formatCurrency(
  amount: number | undefined | null,
  currency = "MXN"
) {
  if (amount == null) return "$0.00";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount);
}
