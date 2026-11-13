/**
 * Datos editoriales para el piloto de Fantasy Nails.
 * Fuente: recepción documentada V52007133 (03–04 nov 2026).
 * Los precios son aprobaciones históricas, NO confirmación de POS.
 * NO conectar a Medusa, catálogo Meta ni inventario automáticamente.
 */
export type FantasyPilotProduct = {
  sku: string;
  slug: string;
  title: string;
  shortDescription: string;
  approvedPublicPrice: number;
  originalPhotoFilename: string;
  catalogPhotoFilename: string;
  imageUrl: string | null;
};

export const fantasyPilotProducts: readonly FantasyPilotProduct[] = [
  {
    sku: "17133",
    slug: "gel-rubber-pink-shine",
    title: "Gel Rubber Pink Shine Fantasy Nails 15 ml",
    shortDescription: "Gel Rubber Fantasy Nails, variante Pink Shine, presentación de 15 ml. Consulta disponibilidad actual y detalles del producto con SICARÚ.",
    approvedPublicPrice: 99,
    originalPhotoFilename: "gel rubber pink shine.jpeg",
    catalogPhotoFilename: "SICARU_FB_FANTASY_17133_1254x1254.png",
    imageUrl: null,
  },
  {
    sku: "17141",
    slug: "gel-rubber-petal",
    title: "Gel Rubber Petal Fantasy Nails 15 ml",
    shortDescription: "Gel Rubber Fantasy Nails, variante Petal, presentación de 15 ml. Consulta disponibilidad actual y detalles del producto con SICARÚ.",
    approvedPublicPrice: 99,
    originalPhotoFilename: "gel rubber petal.jpeg",
    catalogPhotoFilename: "SICARU_FB_FANTASY_17141_1254x1254.png",
    imageUrl: null,
  },
  {
    sku: "17136",
    slug: "gel-rubber-piel",
    title: "Gel Rubber Piel Fantasy Nails 15 ml",
    shortDescription: "Gel Rubber Fantasy Nails, variante Piel, presentación de 15 ml. Consulta disponibilidad actual y detalles del producto con SICARÚ.",
    approvedPublicPrice: 99,
    originalPhotoFilename: "gel rubber piel.jpeg",
    catalogPhotoFilename: "SICARU_FB_FANTASY_17136_1254x1254.png",
    imageUrl: null,
  },
  {
    sku: "28101",
    slug: "gel-polish-super-blanco",
    title: "Gel Polish Super Blanco Fantasy Nails 15 ml",
    shortDescription: "Gel de color Fantasy Nails, Super Blanco, presentación de 15 ml. Consulta disponibilidad actual y detalles del producto con SICARÚ.",
    approvedPublicPrice: 99,
    originalPhotoFilename: "gel super blanco.jpeg",
    catalogPhotoFilename: "SICARU_FB_FANTASY_28101_1254x1254.png",
    imageUrl: null,
  },
  {
    sku: "28102",
    slug: "gel-polish-super-negro",
    title: "Gel Polish Super Negro Fantasy Nails 15 ml",
    shortDescription: "Gel de color Fantasy Nails, Super Negro, presentación de 15 ml. Consulta disponibilidad actual y detalles del producto con SICARÚ.",
    approvedPublicPrice: 99,
    originalPhotoFilename: "gel super negro.jpeg",
    catalogPhotoFilename: "SICARU_FB_FANTASY_28102_1254x1254.png",
    imageUrl: null,
  },
  {
    sku: "20132",
    slug: "truebond-sin-acido",
    title: "TrueBond sin ácido Fantasy Nails 15 ml",
    shortDescription: "TrueBond sin ácido Fantasy Nails, presentación de 15 ml. Consulta disponibilidad actual y detalles del producto con SICARÚ.",
    approvedPublicPrice: 59,
    originalPhotoFilename: "truebond.jpeg",
    catalogPhotoFilename: "SICARU_FB_FANTASY_20132_1254x1254.png",
    imageUrl: null,
  },
];

export function findFantasyPilotProduct(slug: string) {
  return fantasyPilotProducts.find((product) => product.slug === slug);
}
