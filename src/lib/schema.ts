import type { HttpTypes } from "@medusajs/types";
import { BRANDS } from "@/lib/constants/brands";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sicarubeauty.com";

// ─── Shared types ───────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPostData {
  title: string;
  slug: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}

// ─── 1. Organization / Store ────────────────────────────────────

export function generateOrganizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    "@id": `${BASE_URL}/#organization`,
    name: "Distribuidora Sicarú",
    description:
      "Sicarú es una tienda de productos profesionales de belleza en Cadereyta Jiménez, Nuevo León. Encuentra coloración, tratamientos capilares, herramientas, depilación y atención personalizada.",
    url: BASE_URL,
    telephone: "+528281111023",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cadereyta Jiménez",
      addressRegion: "Nuevo León",
      addressCountry: "MX",
    },
    areaServed: [
      { "@type": "City", name: "Cadereyta Jiménez" },
      { "@type": "State", name: "Nuevo León" },
    ],
    brand: [
      {
        "@type": "Brand",
        name: "Küül",
        sameAs: "https://www.henkel.mx/marcas-y-negocios/kuul-857124",
      },
      { "@type": "Brand", name: "Voglia", sameAs: "https://voglia.com.mx" },
      {
        "@type": "Brand",
        name: "Nekane Capilar",
        sameAs: "https://nekane.mx",
      },
      { "@type": "Brand", name: "Hidra Color" },
      { "@type": "Brand", name: "Xiomara" },
      { "@type": "Brand", name: "Vitale" },
      { "@type": "Brand", name: "Montis" },
    ],
    currenciesAccepted: "MXN",
    priceRange: "$",
    sameAs: ["https://wa.me/528281111023"],
  };
}

// ─── 2. WebSite + SearchAction ──────────────────────────────────

export function generateWebSiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "Distribuidora Sicarú",
    url: BASE_URL,
    inLanguage: "es-MX",
    publisher: { "@id": `${BASE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/productos?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── 3. Product ─────────────────────────────────────────────────

export function generateProductSchema(
  product: HttpTypes.StoreProduct
): Record<string, unknown> {
  const variant = product.variants?.[0];
  const price = variant?.calculated_price;
  const brandName = product.collection?.title;
  const images = (product.images ?? [])
    .filter((img) => !!img.url)
    .map((img) => img.url);
  const imageUrl = images[0] ?? product.thumbnail;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE_URL}/productos/${product.handle}`,
    name: product.title,
    description:
      product.description ?? `${product.title} — Distribuidora Sicarú`,
    url: `${BASE_URL}/productos/${product.handle}`,
    image: images.length > 0 ? images : imageUrl,
    sku: variant?.sku ?? product.id,
    mpn: variant?.barcode ?? undefined,
    brand: brandName
      ? { "@type": "Brand", name: brandName }
      : { "@type": "Brand", name: "Distribuidora Sicarú" },
  };

  if (price?.calculated_amount != null) {
    schema.offers = {
      "@type": "Offer",
      url: `${BASE_URL}/productos/${product.handle}`,
      price: price.calculated_amount,
      priceCurrency: price.currency_code?.toUpperCase() || "MXN",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Distribuidora Sicarú",
      },
    };
  }

  return schema;
}

// ─── 4. Breadcrumbs ─────────────────────────────────────────────

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

// ─── 5. FAQ ─────────────────────────────────────────────────────

export function generateFAQSchema(
  faqs: FAQItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── 6. Auto-generated product FAQs ────────────────────────────

export function generateProductFAQs(
  product: HttpTypes.StoreProduct
): FAQItem[] {
  const brandName = product.collection?.title ?? "Distribuidora Sicarú";
  const price = product.variants?.[0]?.calculated_price;
  const priceStr =
    price?.calculated_amount != null
      ? new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: price.currency_code || "MXN",
        }).format(price.calculated_amount)
      : null;

  return [
    {
      question: `¿Cuánto cuesta ${product.title}?`,
      answer: priceStr
        ? `${product.title} de ${brandName} tiene un precio de ${priceStr} MXN en Distribuidora Sicarú. Los precios pueden variar según promociones vigentes.`
        : `Consulta el precio actual de ${product.title} de ${brandName} por WhatsApp o en tienda.`,
    },
    {
      question: `¿${product.title} es un producto original?`,
      answer: `Consulta disponibilidad e información de ${product.title} de ${brandName} directamente con Sicarú.`,
    },
    {
      question: `¿Cómo puedo comprar ${product.title}?`,
      answer: `Puedes consultar disponibilidad y opciones de compra de ${product.title} por WhatsApp o en la tienda física de Sicarú en Cadereyta Jiménez, Nuevo León.`,
    },
  ];
}

// ─── 7. Auto-generated brand FAQs ──────────────────────────────

export function generateBrandFAQs(
  brandName: string,
  handle?: string
): FAQItem[] {
  // Use brand-specific FAQs from constants if available
  if (handle) {
    const brand = BRANDS[handle];
    if (brand?.faqs?.length) {
      return brand.faqs;
    }
  }

  // Check by name match
  const brandByName = Object.values(BRANDS).find(
    (b) => b.name === brandName
  );
  if (brandByName?.faqs?.length) {
    return brandByName.faqs;
  }

  // Fallback to generic FAQs
  return [
    {
      question: `¿Dónde puedo comprar productos ${brandName} originales?`,
      answer: `Consulta productos ${brandName} en Sicarú, tienda de productos profesionales de belleza en Cadereyta Jiménez, Nuevo León.`,
    },
    {
      question: `¿Los productos ${brandName} son para uso profesional?`,
      answer: `Sicarú trabaja con productos profesionales para estilistas, salones de belleza y cuidado en casa. Consulta recomendaciones según tu necesidad.`,
    },
    {
      question: `¿Puedo recibir asesoría sobre productos ${brandName}?`,
      answer: `Sí, puedes consultar disponibilidad y recomendaciones por WhatsApp al +52 828 111 1023.`,
    },
  ];
}

// ─── 8. CollectionPage ──────────────────────────────────────────

export function generateCollectionPageSchema(opts: {
  name: string;
  description?: string;
  url: string;
  image?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description:
      opts.description ?? `Productos de ${opts.name} en Distribuidora Sicarú`,
    url: opts.url.startsWith("http") ? opts.url : `${BASE_URL}${opts.url}`,
    image: opts.image,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    provider: { "@id": `${BASE_URL}/#organization` },
  };
}

// ─── 9. BlogPosting ─────────────────────────────────────────────

export function generateBlogPostSchema(
  post: BlogPostData
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/blog/${post.slug}`,
    image: post.image,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    author: {
      "@type": "Organization",
      name: post.authorName ?? "Distribuidora Sicarú",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Distribuidora Sicarú",
      "@id": `${BASE_URL}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
    inLanguage: "es-MX",
  };
}
