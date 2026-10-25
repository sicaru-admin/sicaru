import type { HttpTypes } from "@medusajs/types";
import { BRANDS, getBrandData, type BrandData } from "@/lib/constants/brands";
import { matchesProductQuery } from "@/lib/product-retail";

const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLocaleLowerCase("es-MX");
export const getBrandSearchHref = (name: string) => `/productos?q=${encodeURIComponent(name)}`;

/** Explicit metadata/collection, then the exact brand prefix in the published title.
 * Descriptions and approximate keyword matches never establish brand ownership. */
export function getProductBrand(product: HttpTypes.StoreProduct): BrandData | undefined {
  const metadataBrand = product.metadata?.brand;
  if (typeof metadataBrand === "string" && metadataBrand.trim()) {
    return Object.values(BRANDS).find(brand => [brand.name, brand.handle].some(value => normalize(value) === normalize(metadataBrand)));
  }
  const collectionBrand = product.collection?.handle ? getBrandData(product.collection.handle) : undefined;
  if (collectionBrand) return collectionBrand;
  return Object.values(BRANDS).find(brand => normalize(product.title || "").startsWith(`${normalize(brand.name)} `));
}

export function getBrandOptions(products: HttpTypes.StoreProduct[]) {
  return Object.values(BRANDS).flatMap(brand => {
    const matches = products.filter(product => getProductBrand(product)?.handle === brand.handle && matchesProductQuery(product, brand.name));
    return matches.length ? [{ ...brand, count: matches.length, href: getBrandSearchHref(brand.name) }] : [];
  });
}
