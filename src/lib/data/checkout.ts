import { sdk } from "@/lib/medusa";
import type { HttpTypes } from "@medusajs/types";

export async function getFullCart(cartId: string) {
  const { cart } = await sdk.store.cart.retrieve(cartId, {
    fields:
      "+shipping_address,+billing_address,+shipping_methods,+payment_collection,+region,+promotions",
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

export async function listShippingOptions(cartId: string) {
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cartId,
  });
  return shipping_options;
}

export async function addShippingMethod(cartId: string, optionId: string) {
  const { cart } = await sdk.store.cart.addShippingMethod(cartId, {
    option_id: optionId,
  });
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
  const { payment_collection } =
    await sdk.store.payment.initiatePaymentSession(cart, {
      provider_id: providerId,
      ...(data ? { data } : {}),
    });
  return payment_collection;
}

export async function completeCart(cartId: string) {
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
