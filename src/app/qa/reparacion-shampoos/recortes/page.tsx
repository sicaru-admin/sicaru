import type { HttpTypes } from "@medusajs/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/product/ImageGallery";
import { RetailProductCard } from "@/components/products/RetailProductCard";
import { CATALOG_MODE } from "@/lib/catalog-mode";
import { getProductByHandle } from "@/lib/data/products";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "XIOMARA · Comparativa de recortes · Solo Preview",
  robots: { index: false, follow: false },
};

const references = [
  { handle: "xiomara-shampoo-platinum-250ml", id: "prod_01M79C6MFY2YPX504ZMDW9HJ0A", barcode: "7501846500905", label: "Platinum azul" },
  { handle: "xiomara-shampoo-platinum-libre-sulfatos-250ml", id: "prod_01M79C7BHA8D7GCZG4DTBM1Q68", barcode: "7501846505863", label: "Libre de Sulfatos morado" },
] as const;

export default async function OwnerCropsReview({ searchParams }: {
  searchParams: Promise<{ producto?: string }>;
}) {
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) notFound();
  const { producto } = await searchParams;
  const reference = references.find((item) => item.handle === (producto ?? references[0].handle));
  if (!reference) notFound();

  let product: HttpTypes.StoreProduct | null = null;
  try { product = await getProductByHandle(reference.handle); } catch { /* Explicit recovery below; never fabricate a commercial record. */ }
  const variant = product?.variants?.[0];
  const identityMatches = product?.id === reference.id && product.handle === reference.handle &&
    product.variants?.length === 1 && variant?.title === "250 ml" && variant.barcode === reference.barcode;
  const directory = `/images/products/${reference.handle}`;
  const original = product?.thumbnail || product?.images?.[0]?.url;
  // Compare only the known published front. Do not map a changed gallery or another product by similarity.
  const publishedFrontMatches = original === `https://www.sicarubeauty.com${directory}/01-principal.webp` || original === `${directory}/01-principal.webp`;
  const versions = [
    { key: "publicada", label: "Fotografía publicada · Store API", image: original },
    { key: "r3", label: "R3 anterior · candidato", image: `${directory}/01-principal-r3.webp` },
    { key: "propietaria", label: "Nuevo recorte de la propietaria · candidato", image: `${directory}/01-principal-recorte-propietaria-candidato.webp` },
  ];

  return <main className="min-h-screen bg-[#FAF8F5] px-4 py-8 text-[#2E2B2B] sm:px-8">
    <div className="mx-auto max-w-[1320px]">
      <p className="text-xs font-semibold uppercase tracking-wide">SICARÚ · Evaluación, no publicar</p>
      <h1 className="mt-3 font-heading text-3xl sm:text-4xl">XIOMARA · Tres fotografías, un mismo producto</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6">Datos actuales de Store API, solo lectura. Tarjetas y galerías reales, sin retocar archivos. Las candidatas sustituyen únicamente la imagen frontal en memoria para esta comparación; no cambian Medusa ni la fotografía publicada.</p>
      <nav aria-label="Producto a comparar" className="my-5 flex flex-wrap gap-3">
        {references.map((item) => <Link key={item.handle} href={`/qa/reparacion-shampoos/recortes?producto=${item.handle}`} aria-current={item.handle === reference.handle ? "page" : undefined} className="inline-flex min-h-11 items-center rounded-lg border border-[#7F6D8A] px-3 text-sm underline underline-offset-4">{item.label}</Link>)}
      </nav>
      {!product || !identityMatches || !publishedFrontMatches || (product.images?.length && product.images[0].url !== original) ? <p role="alert" className="rounded-lg border border-[#7F6D8A] p-5">Comparación bloqueada: no se pudo confirmar la ficha actual, su variante exacta o la fotografía frontal publicada. No se muestran datos sustitutos ni se modifican asociaciones.</p> : <>
        <h2 className="font-heading text-2xl">{product.title}</h2>
        <p className="mt-2 break-words text-xs">ID {product.id} · EAN {variant?.barcode} · Presentación {variant?.title} · SKU {variant?.sku || "no expuesto"}</p>
        <h2 className="mb-4 mt-8 text-xl font-semibold">Comparativa en tarjetas del catálogo</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" data-testid="owner-crops-cards">
          {versions.map((version) => <section key={version.key} className="min-w-0" aria-label={`Tarjeta ${version.key}`}>
            <h3 className="mb-3 min-h-12 text-xs font-semibold">{version.label}</h3>
            <RetailProductCard product={{ ...product, thumbnail: version.image ?? null }} disableVerifiedPhoto />
          </section>)}
        </div>
        <h2 className="mb-4 mt-10 text-xl font-semibold">Comparativa en galería de ficha</h2>
        <div className="space-y-8" data-testid="owner-crops-galleries">
          {versions.map((version) => {
            const images = product.images?.length ? product.images : [{ id: "published-thumbnail", url: original! }];
            return <section key={version.key} aria-label={`Galería ${version.key}`}>
              <h3 className="mb-3 text-sm font-semibold">{version.label}</h3>
              <div className="grid min-w-0 gap-4 lg:grid-cols-[56%_1fr]">
                <ImageGallery images={images.map((image) => ({ id: image.id, url: image.url === original ? version.image! : image.url }))} title={`${product.title} · ${version.label}`} />
                <div className="min-w-0 text-sm leading-6">
                  <p className="font-semibold">{product.title}</p>
                  <p>250 ml · {version.label}</p>
                  <p className="mt-2">Se conserva el resto de la galería recibida y sus identificadores. Selecciona las miniaturas para revisar el reverso cuando exista. La candidata es solo frontal: no se inventan otras vistas.</p>
                  <Link href={`/productos/${product.handle}`} className="mt-3 inline-flex min-h-11 items-center underline">Abrir ficha de esta Preview (R3 anterior)</Link>
                </div>
              </div>
            </section>;
          })}
        </div>
      </>}
      <p className="mt-8 text-sm font-semibold">Candidatos pendientes de evaluación de la propietaria. Sin autorización de sustitución ni publicación.</p>
    </div>
  </main>;
}
