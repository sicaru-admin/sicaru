import { initMercadoPago } from "@mercadopago/sdk-react";

let initialized = false;

export function ensureMercadoPagoInit() {
  if (initialized) return;
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
  if (!publicKey) {
    console.warn("NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY is not set");
    return;
  }
  initMercadoPago(publicKey, { locale: "es-MX" });
  initialized = true;
}
