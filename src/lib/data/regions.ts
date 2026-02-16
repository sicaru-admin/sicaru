import { sdk } from "@/lib/medusa";

export async function getRegions() {
  const { regions } = await sdk.store.region.list({
    limit: 100,
  });

  return regions;
}

export async function getMexicoRegion() {
  const { regions } = await sdk.store.region.list({
    limit: 100,
  });

  const mexico = regions.find(
    (r) => r.currency_code === "mxn" || r.name?.toLowerCase().includes("mex")
  );

  return mexico || regions[0];
}
