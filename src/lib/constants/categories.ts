export interface CategoryData {
  name: string
  handle: string
  gradient: string
  description: string
}

export const CATEGORIES: Record<string, CategoryData> = {
  "shampoo-y-acondicionador": {
    name: "Shampoo y Acondicionador",
    handle: "shampoo-y-acondicionador",
    gradient: "from-sicaru-purple-600 to-sicaru-purple-800",
    description:
      "Shampoos y acondicionadores profesionales para distintas necesidades del cabello: hidratación, limpieza, cuidado del color y mantenimiento diario.",
  },
  "color-y-tintes": {
    name: "Color y Tintes",
    handle: "color-y-tintes",
    gradient: "from-sicaru-purple-700 to-sicaru-purple-600",
    description:
      "Tintes profesionales en crema, oxidantes y productos de coloración de Küül, Voglia e Hidra Color. Opciones para renovar el tono, cubrir canas y mantener un acabado uniforme.",
  },
  "styling-y-acabado": {
    name: "Styling y Acabado",
    handle: "styling-y-acabado",
    gradient: "from-sicaru-pink to-sicaru-purple-700",
    description:
      "Geles, ceras, sprays, protectores térmicos y productos de acabado profesional. Todo lo que necesitas para crear y mantener cualquier estilo.",
  },
  "linea-natural": {
    name: "Línea Natural",
    handle: "linea-natural",
    gradient: "from-sicaru-purple-500 to-sicaru-purple-700",
    description:
      "Productos con extractos 100% naturales de Montis. Libres de sulfatos, parabenos y siliconas para una rutina de belleza consciente y responsable.",
  },
  "tratamientos-y-mascarillas": {
    name: "Tratamientos y Mascarillas",
    handle: "tratamientos-y-mascarillas",
    gradient: "from-sicaru-purple-500 to-sicaru-purple-700",
    description:
      "Keratinas, mascarillas de hidratación profunda, botox capilar y tratamientos de reconstrucción para restaurar cabello dañado y procesado químicamente.",
  },
  "herramientas-pro": {
    name: "Herramientas Pro",
    handle: "herramientas-pro",
    gradient: "from-sicaru-purple-700 to-sicaru-purple-600",
    description:
      "Secadoras, planchas, tenazas, cepillos y accesorios profesionales para estilistas y salones de belleza.",
  },
}

export function getCategoryData(handle: string): CategoryData | undefined {
  return CATEGORIES[handle]
}
