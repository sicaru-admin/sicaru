type InventoryVariant = {
  manage_inventory?: boolean | null; allow_backorder?: boolean | null; inventory_quantity?: number | null;
};
export function getProductAvailability(variant: InventoryVariant | null | undefined, quantity = 1) {
  if (!variant) return "unselected";
  if (!variant.manage_inventory || variant.allow_backorder) return "available";
  const stock = variant.inventory_quantity;
  if (typeof stock !== "number" || !Number.isFinite(stock)) return "unknown";
  if (stock <= 0) return "out_of_stock";
  return stock < quantity ? "insufficient" : "available";
}
