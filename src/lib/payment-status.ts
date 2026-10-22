type PaymentOrder = {
  payment_status?: string | null;
  payment_collections?: Array<{
    status?: string | null;
    payment_sessions?: Array<{data?: {mp_status?: string; status_detail?: string}}> | null;
  }> | null;
};
export function getOrderPaymentState(order: PaymentOrder): "paid" | "pending" | "rejected" {
  const sessions = order.payment_collections?.flatMap(c => c.payment_sessions ?? []) ?? [];
  if (["canceled", "failed", "error", "rejected"].includes(order.payment_status ?? "") ||
      order.payment_collections?.some(c => ["canceled", "failed"].includes(c.status ?? "")) ||
      sessions.some(s => ["rejected", "cancelled", "refunded", "charged_back"].includes(s.data?.mp_status ?? ""))) return "rejected";
  if (sessions.some(s => s.data?.mp_status === "approved") ||
      order.payment_status === "captured" ||
      order.payment_collections?.some(c => c.status === "completed")) return "paid";
  return "pending"; // Unknown, authorized, OXXO and in_process never imply paid.
}
