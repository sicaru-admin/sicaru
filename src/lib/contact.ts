import { STORE } from "./constants/store";
import { getWhatsAppUrl } from "./shipping";
export function getSalesWhatsAppUrl(message = ""): string | undefined {
  return getWhatsAppUrl(STORE.whatsapp, message) ?? undefined;
}
