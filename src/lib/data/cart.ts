import { sdk } from "@/lib/medusa";

const PREVIEW_PAYMENTS_SALES_CHANNEL_ID = "sc_01KYV6FN212F2TC60EGBY2KNED";

export async function createCart(regionId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "";
  const salesChannelId = backendUrl.includes("preview-payments")
    ? PREVIEW_PAYMENTS_SALES_CHANNEL_ID
    : process.env.NEXT_PUBLIC_SALES_CHANNEL_ID;

  const payload = {
    region_id: regionId,
    ...(salesChannelId ? { sales_channel_id: salesChannelId } : {}),
  };

  const { cart } = await sdk.store.cart.create(payload);

  return cart;
}

export async function getCart(cartId: string) {
  const { cart } = await sdk.store.cart.retrieve(cartId);
  return cart;
}

export async function addItem(
  cartId: string,
  variantId: string,
  quantity: number
) {
  const { cart } = await sdk.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  });

  return cart;
}

export async function updateItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  const { cart } = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
    quantity,
  });

  return cart;
}

export async function removeItem(cartId: string, lineItemId: string) {
  const { parent: cart } = await sdk.store.cart.deleteLineItem(
    cartId,
    lineItemId
  );

  return cart;
}
