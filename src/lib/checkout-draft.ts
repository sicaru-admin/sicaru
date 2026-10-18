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


const rememberedKey="sicaru_checkout_remembered_v1";
const addressKeys=["first_name","last_name","phone","address_1","address_2","interior","references","city","province","postal_code","country_code"];
export function rememberCheckout(storage:StorageLike,draft:CheckoutDraft){
  const address=Object.fromEntries(addressKeys.filter(key=>typeof draft.address[key]==="string").map(key=>[key,draft.address[key].slice(0,250)]));
  try{storage.setItem(rememberedKey,JSON.stringify({version:1,consent:true,email:draft.email.slice(0,254),address}));}catch{}
}
export function readRememberedCheckout(storage:StorageLike):CheckoutDraft|null{
  try{const value=JSON.parse(storage.getItem(rememberedKey)||"null");if(value?.version!==1||value.consent!==true||typeof value.email!=="string"||!value.address||typeof value.address!=="object"||Array.isArray(value.address))return null;
    return {email:value.email,address:Object.fromEntries(addressKeys.filter(key=>typeof value.address[key]==="string").map(key=>[key,value.address[key]]))};
  }catch{return null;}
}
export function forgetRememberedCheckout(storage:StorageLike){try{storage.removeItem(rememberedKey);}catch{}}
