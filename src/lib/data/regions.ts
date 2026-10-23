import { catalogRequest } from "@/lib/catalog-request";
import { sdk } from "@/lib/medusa";

export async function getRegions() {
  const { regions } = await catalogRequest(() => sdk.store.region.list({
    limit: 100,
  }));

  if (!Array.isArray(regions)) throw new Error("Invalid region response");
  return regions;
}

export async function getMexicoRegion() {
  const { regions } = await catalogRequest(() => sdk.store.region.list({
    limit: 100,
  }));

  if (!Array.isArray(regions)) throw new Error("Invalid region response");
  const mexico = regions.find(
    (r) => r.currency_code === "mxn" || r.name?.toLowerCase().includes("mex")
  );

  return mexico || regions[0];
}
