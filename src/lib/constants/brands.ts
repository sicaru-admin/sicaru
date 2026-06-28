export interface BrandData {
  name: string
  handle: string
  color: string
  tagline: string
  description: string
  faqs: { question: string; answer: string }[]
}

export const BRANDS: Record<string, BrandData> = {
  kuul: {
    name: "Küül",
    handle: "kuul",
    color: "#E8351E",
    tagline: "Líder mexicano en coloración profesional — por Henkel",
    description:
      "Marca líder de Henkel en coloración profesional mexicana. Sistema completo de color, tratamientos reconstructores y cuidado capilar con tecnología alemana adaptada al cabello latinoamericano.",
    faqs: [
      {
        question: "¿Küül es buena marca de tintes?",
        answer:
          "Sí, Küül es una de las marcas líderes de coloración profesional en México, respaldada por Henkel. Sus tintes ofrecen cobertura completa de canas, colores vibrantes y durabilidad. Es utilizada por miles de estilistas profesionales en todo el país.",
      },
      {
        question: "¿Dónde comprar Küül en Nuevo León?",
        answer:
          "Puedes comprar productos Küül originales en Distribuidora Sicarú, ubicada en La Plaza, Local 204, Cadereyta Jiménez, Nuevo León. También puedes comprar en línea en nuestra tienda con envío a todo México.",
      },
      {
        question: "¿Qué productos tiene la línea Küül?",
        answer:
          "La línea Küül incluye tintes en crema (Küül Color System), oxidantes, decolorante Küül Blond, shampoo y acondicionador Küül Cure Me, tratamientos capilares, y productos de styling. Cada línea está formulada con ingredientes de calidad profesional.",
      },
      {
        question: "¿Los tintes Küül cubren las canas?",
        answer:
          "Sí, los tintes Küül Color System están formulados para una cobertura de canas del 100%. Su fórmula en crema permite una aplicación uniforme con resultados profesionales y colores duraderos.",
      },
      {
        question: "¿Küül tiene precios de mayoreo?",
        answer:
          "Sí, en Distribuidora Sicarú ofrecemos precios especiales de mayoreo para profesionales y salones de belleza a través de nuestro programa Salón Pro. Contáctanos por WhatsApp al +52 828 111 1023.",
      },
    ],
  },
  voglia: {
    name: "Voglia",
    handle: "voglia",
    color: "#8B5CF6",
    tagline: "Tintes premium y línea de barbería desde León, Guanajuato",
    description:
      "Desde León, Guanajuato. Línea completa de tintes permanentes y semi-permanentes, más línea especializada de barbería para el profesional moderno.",
    faqs: [
      {
        question: "¿Voglia es buena marca de tintes?",
        answer:
          "Sí, Voglia es una marca premium mexicana reconocida por la calidad de sus tintes en crema. Ofrece una amplia carta de colores con resultados vibrantes y duraderos, utilizada por profesionales en salones y barberías.",
      },
      {
        question: "¿Los tintes Voglia dañan el cabello?",
        answer:
          "Los tintes Voglia están formulados con ingredientes que minimizan el daño al cabello. Su fórmula en crema incluye agentes acondicionadores que ayudan a mantener la hidratación durante el proceso de coloración.",
      },
      {
        question: "¿Voglia tiene línea de barbería?",
        answer:
          "Sí, Voglia cuenta con una línea completa de productos para barbería que incluye geles, ceras, pomadas y productos de styling masculino profesional.",
      },
      {
        question: "¿Dónde comprar Voglia original?",
        answer:
          "Puedes comprar productos Voglia 100% originales en Distribuidora Sicarú, tanto en nuestra tienda física en Cadereyta Jiménez, Nuevo León, como en nuestra tienda en línea con envío a todo México.",
      },
      {
        question: "¿Voglia tiene precios de mayoreo?",
        answer:
          "Sí, ofrecemos precios de mayoreo para profesionales a través de nuestro programa Salón Pro. Contáctanos por WhatsApp al +52 828 111 1023 para cotizaciones.",
      },
    ],
  },
  "nekane-capilar": {
    name: "Nekane Capilar",
    handle: "nekane-capilar",
    color: "#EC4899",
    tagline: "Tratamientos de hidratación profunda y reconstrucción capilar",
    description:
      "Tratamientos de hidratación profunda y reconstrucción capilar. Especialistas en cabello dañado y procesado químicamente.",
    faqs: [
      {
        question: "¿Nekane Capilar es buena marca?",
        answer:
          "Sí, Nekane Capilar se especializa en tratamientos de hidratación profunda y reconstrucción capilar. Sus productos están formulados para restaurar cabello dañado por procesos químicos como decoloración y alisados.",
      },
      {
        question: "¿Para qué sirve Nekane Capilar?",
        answer:
          "Nekane Capilar ofrece tratamientos profesionales de hidratación, reconstrucción y nutrición capilar. Es ideal para cabello seco, maltratado, con frizz o dañado por procesos químicos.",
      },
      {
        question: "¿Nekane Capilar funciona en cabello teñido?",
        answer:
          "Sí, los tratamientos Nekane Capilar son compatibles con cabello teñido y procesado químicamente. Ayudan a restaurar la hidratación y el brillo perdido sin alterar el color.",
      },
      {
        question: "¿Dónde comprar Nekane Capilar?",
        answer:
          "Compra productos Nekane Capilar originales en Distribuidora Sicarú con envío a todo México. Somos distribuidores autorizados.",
      },
      {
        question: "¿Nekane Capilar tiene precios de mayoreo?",
        answer:
          "Sí, ofrecemos precios especiales de mayoreo para profesionales y salones a través de nuestro programa Salón Pro. Contáctanos por WhatsApp.",
      },
    ],
  },
  "hidra-color": {
    name: "Hidra Color",
    handle: "hidra-color",
    color: "#3B82F6",
    tagline: "Sistema de coloración cremosa con alta cobertura",
    description:
      "Sistema de coloración cremosa profesional con alta cobertura de canas y fórmulas nutritivas que protegen la fibra capilar.",
    faqs: [
      {
        question: "¿Hidra Color es buena marca de tintes?",
        answer:
          "Sí, Hidra Color es un sistema de coloración cremosa profesional reconocido por su alta cobertura de canas y fórmulas nutritivas que protegen la fibra capilar durante el proceso de coloración.",
      },
      {
        question: "¿Los tintes Hidra Color cubren las canas?",
        answer:
          "Sí, Hidra Color está especialmente formulado para una cobertura de canas superior. Su sistema cremoso permite una aplicación uniforme con resultados naturales y duraderos.",
      },
      {
        question: "¿Hidra Color daña el cabello?",
        answer:
          "Hidra Color cuenta con fórmulas nutritivas que protegen la fibra capilar durante el proceso de coloración. Sus ingredientes acondicionadores minimizan el daño y mantienen la hidratación.",
      },
      {
        question: "¿Dónde comprar Hidra Color?",
        answer:
          "Puedes comprar Hidra Color original en Distribuidora Sicarú, en nuestra tienda física o en línea con envío a todo México.",
      },
      {
        question: "¿Hidra Color tiene precios de mayoreo?",
        answer:
          "Sí, ofrecemos precios de mayoreo para Hidra Color a través de nuestro programa Salón Pro. Contáctanos por WhatsApp al +52 828 111 1023.",
      },
    ],
  },
  xiomara: {
    name: "Xiomara",
    handle: "xiomara",
    color: "#F59E0B",
    tagline: "Styling y fijación profesional para todo tipo de cabello",
    description:
      "Línea profesional de styling y fijación. Geles, ceras, sprays y protectores térmicos para todo tipo de cabello.",
    faqs: [
      {
        question: "¿Xiomara es buena marca de styling?",
        answer:
          "Sí, Xiomara es una línea profesional de styling y fijación reconocida por estilistas mexicanos. Ofrece geles, ceras, sprays y protectores térmicos de calidad profesional.",
      },
      {
        question: "¿Qué productos tiene Xiomara?",
        answer:
          "Xiomara ofrece una línea completa de styling: geles de diferentes fijaciones, ceras moldeadoras, sprays de acabado, protectores térmicos y productos de definición para todo tipo de cabello.",
      },
      {
        question: "¿Xiomara protege el cabello del calor?",
        answer:
          "Sí, Xiomara cuenta con protectores térmicos profesionales que protegen el cabello del daño causado por secadoras, planchas y tenazas.",
      },
      {
        question: "¿Dónde comprar Xiomara?",
        answer:
          "Compra productos Xiomara originales en Distribuidora Sicarú con envío a todo México. Somos distribuidores autorizados.",
      },
      {
        question: "¿Xiomara tiene precios de mayoreo?",
        answer:
          "Sí, ofrecemos precios especiales de mayoreo para profesionales a través de nuestro programa Salón Pro.",
      },
    ],
  },
  vitale: {
    name: "Vitale",
    handle: "vitale",
    color: "#10B981",
    tagline: "Especialistas en keratina y reconstrucción profunda",
    description:
      "Especialistas en keratina y tratamientos de reconstrucción profunda. Tecnología brasileña adaptada al mercado mexicano.",
    faqs: [
      {
        question: "¿Vitale es buena marca de keratina?",
        answer:
          "Sí, Vitale es reconocida como especialista en tratamientos de keratina y reconstrucción capilar. Utiliza tecnología brasileña adaptada al mercado mexicano para resultados profesionales.",
      },
      {
        question: "¿La keratina Vitale alisa el cabello?",
        answer:
          "Los tratamientos de keratina Vitale ayudan a controlar el frizz, alisar y reconstruir la fibra capilar. Los resultados varían según el tipo de cabello y la fórmula utilizada.",
      },
      {
        question: "¿Cuánto dura la keratina Vitale?",
        answer:
          "La duración del tratamiento de keratina Vitale varía entre 2 y 4 meses dependiendo del tipo de cabello y los cuidados posteriores. Se recomienda usar shampoo sin sulfatos.",
      },
      {
        question: "¿Dónde comprar Vitale?",
        answer:
          "Compra productos Vitale originales en Distribuidora Sicarú con envío a todo México. Somos distribuidores autorizados.",
      },
      {
        question: "¿Vitale tiene precios de mayoreo?",
        answer:
          "Sí, ofrecemos precios de mayoreo para Vitale a través de nuestro programa Salón Pro. Contáctanos por WhatsApp al +52 828 111 1023.",
      },
    ],
  },
  montis: {
    name: "Montis",
    handle: "montis",
    color: "#7f6d8a",
    tagline:
      "Belleza natural, hecha en México — 100% libre de químicos agresivos",
    description:
      "Marca mexicana artesanal con extractos 100% naturales. Libre de sulfatos, parabenos y siliconas. Para quienes buscan belleza consciente.",
    faqs: [
      {
        question: "¿Montis es buena marca natural?",
        answer:
          "Sí, Montis es una marca mexicana artesanal que utiliza extractos 100% naturales. Sus productos son libres de sulfatos, parabenos y siliconas, ideales para quienes buscan una rutina de belleza consciente.",
      },
      {
        question: "¿Los productos Montis son libres de sulfatos?",
        answer:
          "Sí, todos los productos Montis son formulados sin sulfatos, parabenos ni siliconas. Utilizan ingredientes naturales de origen mexicano que limpian y nutren el cabello sin dañarlo.",
      },
      {
        question: "¿Montis funciona en cabello teñido?",
        answer:
          "Sí, la fórmula libre de sulfatos de Montis es ideal para cabello teñido, ya que limpia suavemente sin remover el color. Sus ingredientes naturales ayudan a mantener la hidratación y el brillo.",
      },
      {
        question: "¿Dónde comprar Montis?",
        answer:
          "Compra productos Montis originales en Distribuidora Sicarú. Somos distribuidores autorizados con envío a todo México.",
      },
      {
        question: "¿Montis tiene precios de mayoreo?",
        answer:
          "Sí, ofrecemos precios de mayoreo para Montis a través de nuestro programa Salón Pro. Contáctanos por WhatsApp al +52 828 111 1023.",
      },
    ],
  },
}

export const BRAND_HANDLES = Object.keys(BRANDS)

export function getBrandData(handle: string): BrandData | undefined {
  return BRANDS[handle]
}
