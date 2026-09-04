import { initMercadoPago } from "@mercadopago/sdk-react";

let initialized = false;

export function hasMercadoPagoPublicKey() {
  return Boolean(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);
}

export function ensureMercadoPagoInit() {
  if (initialized) return true;
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
  if (!publicKey) {
    console.warn("NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY is not set");
    return false;
  }
  initMercadoPago(publicKey, { locale: "es-MX" });
  initialized = true;
  return true;
}
