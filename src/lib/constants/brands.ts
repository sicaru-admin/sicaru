import { STORE } from "./store";

export interface BrandData {
  name: string;
  handle: string;
  color: string;
  tagline: string;
  description: string;
  faqs: { question: string; answer: string }[];
}

// Names identify the published assortment; no manufacturer, certification or outcome claims.
const definitions = [
  ["kuul", "Küül", "#E8351E"],
  ["voglia", "Voglia", "#8B5CF6"],
  ["nekane-capilar", "Nekane Capilar", "#EC4899"],
  ["hidra-color", "Hidra Color", "#3B82F6"],
  ["xiomara", "Xiomara", "#F59E0B"],
  ["vitale", "Vitale", "#10B981"],
  ["montis", "Montis", "#7f6d8a"],
];
export const BRANDS: Record<string, BrandData> = Object.fromEntries(
  definitions.map(([handle, name, color]) => [handle, {
    handle, name, color,
    tagline: "Productos publicados en SICARÚ",
    description: `Explora los productos ${name} publicados y consulta sus opciones disponibles.`,
    faqs: [
      { question: `¿Cómo consulto productos ${name}?`, answer: `Explora el catálogo publicado de SICARÚ o consulta por WhatsApp al ${STORE.phone}.` },
      { question: "¿Cómo consulto disponibilidad?", answer: "Comparte el producto, presentación y variante que buscas para confirmar las opciones disponibles." },
      { question: "¿Compras para tu trabajo?", answer: "Consulta las opciones para profesionales y las condiciones aplicables a los productos que necesitas." },
    ],
  }]),
);
export const BRAND_HANDLES = Object.keys(BRANDS);
export function getBrandData(handle: string): BrandData | undefined {
  return BRANDS[handle === "nekane" ? "nekane-capilar" : handle];
}
