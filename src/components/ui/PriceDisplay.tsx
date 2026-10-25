import { getApprovedPrice } from "@/lib/product-retail";
import { HttpTypes } from "@medusajs/types";

type PriceDisplayProps = {
  product?: HttpTypes.StoreProduct;
  variant?: HttpTypes.StoreProductVariant;
  amount?: number;
  currency?: string;
  className?: string;
};

export function PriceDisplay({
  product,
  variant,
  amount: rawAmount,
  currency = "MXN",
  className = "",
}: PriceDisplayProps) {
  let displayAmount: number | null = null;
  let displayCurrency = currency;

  if (variant) {
    const price = product ? getApprovedPrice(product, variant) : null;
    if (!price) return <span className={className}>Consultar precio</span>;
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
