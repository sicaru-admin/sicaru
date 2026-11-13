import type { Metadata } from "next";
import type { HttpTypes } from "@medusajs/types";
import { notFound } from "next/navigation";
import { RetailProductCard } from "@/components/products/RetailProductCard";
import { ImageGallery } from "@/components/product/ImageGallery";
import { CATALOG_MODE } from "@/lib/catalog-mode";
import manifest from "../../../../docs/catalog/lote-web-01-r2/assets.json";
import fixture from "../../../../docs/catalog/lote-web-01-r2/fixture.json";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Revisión fotográfica R2 · Lote Web 01",
  robots: { index: false, follow: false },
};

export default function LoteWeb01PhotoReview() {
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) {
    notFound();
  }

  const products = fixture.products as unknown as HttpTypes.StoreProduct[];

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-5 py-8 text-[#2e2b2b] sm:px-8 lg:px-10">
      <header className="mx-auto mb-10 max-w-6xl border-b border-[#efe7dd] pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#7f6d8a]">SICARÚ · revisión visual</p>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl">Lote Web 01 · Actual / R2</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6">Cinco fotografías reales recortadas sobre transparente. Propuesta pendiente de aprobación visual; las imágenes productivas y Medusa permanecen sin cambios.</p>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-[#7f6d8a]">Las tarjetas y galerías son los componentes del storefront. Su diseño responde al ancho de esta página. Los datos son una captura de lectura; este comparativo no consulta ni modifica Medusa.</p>
      </header>

      <div className="mx-auto max-w-6xl space-y-14">
        {manifest.assets.map((asset, index) => {
          const product = products.find((p) => p.handle === asset.handle)!;
          const current = `/images/products/${asset.handle}/${asset.role}.webp`;
          const candidate = `/${asset.path.slice("public/".length)}`;
          const role = asset.role === "01-principal" ? "Frente" : "Reverso";
          const versions = [{ label: "ACTUAL", src: current }, { label: "R2 · TRANSPARENTE", src: candidate }];

          return (
            <section key={asset.path} id={`asset-${index + 1}`} aria-labelledby={`asset-heading-${index + 1}`} className="border-b border-[#efe7dd] pb-10">
              <h2 id={`asset-heading-${index + 1}`} className="font-heading text-2xl">{product.title} · {role}</h2>
              <p className="mt-2 text-xs text-[#7f6d8a]">Tarjeta cuadrada · mismo contenedor, padding, object-contain y drop-shadow del catálogo.</p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:max-w-[600px]" data-testid={`card-comparison-${index + 1}`}>
                {versions.map((version) => (
                  <div key={version.label} className="min-w-0" data-version={version.label}>
                    <p className="mb-2 text-[0.65rem] font-semibold tracking-wide text-[#7f6d8a]">{version.label}</p>
                    <RetailProductCard product={{ ...product, thumbnail: version.src }} />
                  </div>
                ))}
              </div>

              <details className="mt-6" data-testid={`gallery-comparison-${index + 1}`}>
                <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-[#7f6d8a] underline underline-offset-4">Comparar en galería grande de ficha</summary>
                <div className="mt-3 grid gap-6 md:grid-cols-2">
                  {versions.map((version) => (
                    <div key={version.label} className="min-w-0">
                      <p className="mb-2 text-xs font-semibold text-[#7f6d8a]">{version.label}</p>
                      <ImageGallery images={[{ id: `${asset.source.drive_id}-${version.label}`, url: version.src }]} title={`${product.title} · ${role}`} />
                    </div>
                  ))}
                </div>
              </details>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#7f6d8a]">
                <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={candidate} target="_blank" rel="noopener noreferrer">Abrir archivo R2 · 1600 × 1600</a>
                <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={`https://www.sicarubeauty.com/productos/${product.handle}`} target="_blank" rel="noopener noreferrer">Ver ficha productiva actual</a>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
