import { sdk } from "@/lib/medusa";
import type { HttpTypes } from "@medusajs/types";
import { getParcelShippingOptions, hasParcelShippingMethod, isCurrentParcelQuote } from "@/lib/shipping";
import type { DhlQuote } from "@/lib/shipping";

export async function getFullCart(cartId: string) {
  const { cart } = await sdk.store.cart.retrieve(cartId, {
    fields:
      "+shipping_address,+billing_address,+shipping_methods,+shipping_methods.data,+payment_collection,+payment_collection.payment_sessions,+region,+promotions",
  });
  return cart;
}

export async function updateCart(
  cartId: string,
  data: HttpTypes.StoreUpdateCart
) {
  const { cart } = await sdk.store.cart.update(cartId, data);
  return cart;
}

export async function getDhlShippingState(cartId: string) {
  const response = await sdk.client.fetch<{
    quote: DhlQuote; shipping_options: HttpTypes.StoreCartShippingOption[];
  }>(`/store/carts/${cartId}/dhl-quote`, { method: "GET", cache: "no-store" });
  const quote: DhlQuote = isCurrentParcelQuote(response.quote) || response.quote?.status === "quote_required"
    ? response.quote
    : {status: "quote_required", reason: "unverified_quote", message: "Envío por cotizar"};
  return { quote, options: getParcelShippingOptions(response.shipping_options ?? [], quote) };
}
export async function listShippingOptions(cartId: string) {
  try { return (await getDhlShippingState(cartId)).options; }
  catch { return []; } // Payment guards remain closed if verification is unreachable.
}

export async function addShippingMethod(cartId: string, optionId: string) {
  const {options, quote} = await getDhlShippingState(cartId);
  if (!options.some((option) => option.id === optionId)) {
    throw new Error(
      "El envío cambió o ya no está disponible. Vuelve al paso de envío antes de pagar."
    );
  }

  const { cart } = await sdk.store.cart.addShippingMethod(cartId, {
    option_id: optionId,
    data: quote.status === "available" ? {
      sicaru_quote_id: quote.quote_id,
      sicaru_quote_fingerprint: quote.fingerprint,
    } : {},
  });
  if (!hasParcelShippingMethod(cart, options, quote)) {
    throw new Error("El envío o los importes cambiaron. Revisa la cotización antes de pagar.");
  }
  return cart;
}

export async function requireParcelShipping(cartId: string) {
  const cart = await getFullCart(cartId);
  let state;
  try { state = await getDhlShippingState(cartId); }
  catch { throw new Error("Envío por cotizar. No pudimos verificar el costo y la cobertura antes del pago."); }
  if (!hasParcelShippingMethod(cart, state.options, state.quote)) {
    throw new Error(
      "Envío por cotizar. Confirma una cotización vigente de paquetería antes de pagar."
    );
  }
  return cart;
}

export async function listPaymentProviders(regionId: string) {
  const { payment_providers } = await sdk.store.payment.listPaymentProviders({
    region_id: regionId,
  });
  return payment_providers;
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  providerId: string,
  data?: Record<string, unknown>
) {
  const currentCart = await requireParcelShipping(cart.id);
  const { payment_collection } =
    await sdk.store.payment.initiatePaymentSession(
      currentCart,
      {
        provider_id: providerId,
        ...(data ? { data } : {}),
      },
      {
        fields: "+payment_sessions",
      }
    );
  return payment_collection;
}

export async function completeCart(cartId: string) {
  await requireParcelShipping(cartId);
  return await sdk.store.cart.complete(cartId);
}

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export async function applyPromoCode(cartId: string, promoCode: string) {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/promotions`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promo_codes: [promoCode] }),
    }
  );
  if (!res.ok) throw new Error("Error al aplicar codigo de descuento");
  return res.json();
}

export async function removePromoCode(cartId: string, promoCode: string) {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/promotions`,
    {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promo_codes: [promoCode] }),
    }
  );
  if (!res.ok) throw new Error("Error al remover codigo de descuento");
  return res.json();
}



export async function listVerifiedPaymentMethods():Promise<("card"|"oxxo")[]> {
  try { const response=await sdk.client.fetch<{methods?:string[];methodsVerified?:boolean}>("/store/review-readiness",{method:"GET",cache:"no-store"});
    return response.methodsVerified===true ? (response.methods??[]).filter((method):method is "card"|"oxxo"=>method==="card"||method==="oxxo") : [];
  }catch{return [];}
}
