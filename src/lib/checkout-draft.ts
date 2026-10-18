export type CheckoutDraft = { email: string; address: Record<string, string> };
const prefix = "sicaru_checkout_draft:";
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export function readCheckoutDraft(storage: StorageLike, cartId: string): CheckoutDraft | null {
  try {
    const saved = JSON.parse(storage.getItem(prefix + cartId) || "null");
    if (!saved || typeof saved.email !== "string" || !saved.address || typeof saved.address !== "object" || Array.isArray(saved.address)) return null;
    if (Object.values(saved.address).some(value => typeof value !== "string")) return null;
    return { email: saved.email, address: saved.address };
  } catch { return null; }
}
export function saveCheckoutDraft(storage: StorageLike, cartId: string, draft: CheckoutDraft) {
  try { storage.setItem(prefix + cartId, JSON.stringify(draft)); } catch { /* The form remains usable when storage is unavailable. */ }
}
export function clearCheckoutDraft(storage: StorageLike, cartId: string) {
  try { storage.removeItem(prefix + cartId); } catch { /* Order confirmation must still open. */ }
}
