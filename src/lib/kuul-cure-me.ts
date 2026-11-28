export const CURE_ME = {
  productId: "prod_01KVV3GD5ZFG0NT90YWFXRPZFK",
  variantId: "variant_01KVV3GD877SSAGARCPETM9JT5",
  legacyHandle: "kuul-cure-me-reconstructor-1l",
  handle: "kuul-cure-me-reconstructor-1kg",
  legacySku: "KUUL-CURE-1L",
  title: "KÜÜL Cure Me Reconstructor System 1 kg",
  presentation: "1 kg",
} as const;

export function isCureMeHandle(handle: string) {
  return handle === CURE_ME.legacyHandle || handle === CURE_ME.handle;
}
