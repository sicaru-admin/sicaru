type ChannelCart = {
  id: string;
  sales_channel_id?: string | null;
  completed_at?: string | Date | null;
};

/** Reconcile a saved cart with this storefront without replacing or clearing it. */
export async function alignCartSalesChannel<T extends ChannelCart>(
  cart: T,
  configuredChannel: string | undefined,
  updateChannel: (cartId: string, channelId: string) => Promise<T>
): Promise<T> {
  if (cart.completed_at || !configuredChannel || cart.sales_channel_id === configuredChannel) return cart;
  const updated = await updateChannel(cart.id, configuredChannel);
  if (updated.id !== cart.id || updated.sales_channel_id !== configuredChannel) {
    throw new Error("No pudimos recuperar tu carrito. Inténtalo nuevamente.");
  }
  return updated;
}
