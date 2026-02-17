import { HttpTypes } from "@medusajs/types";

type PriceDisplayProps = {
  variant?: HttpTypes.StoreProductVariant;
  amount?: number;
  currency?: string;
  className?: string;
};

export function PriceDisplay({
  variant,
  amount: rawAmount,
  currency = "MXN",
  className = "",
}: PriceDisplayProps) {
  let displayAmount: number | null = null;
  let displayCurrency = currency;

  if (variant?.calculated_price) {
    const price = variant.calculated_price;
    displayAmount =
      price.calculated_amount != null ? price.calculated_amount : null;
    displayCurrency = price.currency_code || currency;
  } else if (rawAmount != null) {
    displayAmount = rawAmount;
  }

  if (displayAmount == null) {
    return <span className={className}>Precio no disponible</span>;
  }

  const formatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: displayCurrency,
  }).format(displayAmount);

  // Split into symbol and number for premium styling
  const match = formatted.match(/^(\$)([\d,.]+)$/);
  if (match) {
    return (
      <span className={`price-premium ${className}`}>
        <span className="price-symbol">{match[1]}</span>
        {match[2]}
      </span>
    );
  }

  return <span className={`price-premium ${className}`}>{formatted}</span>;
}
