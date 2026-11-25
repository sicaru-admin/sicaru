import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { CATALOG_MODE } from "@/lib/catalog-mode";
import { CampaignHeroCandidate } from "@/components/home/CampaignHeroCandidate";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { BrandsShowcase } from "@/components/home/BrandsShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhatsAppBanner } from "@/components/home/WhatsAppBanner";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "SICARÚ · Evaluación de portada completa · No publicado",
  robots: { index: false, follow: false },
};

function ProductLoading() {
  return <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 px-4 py-5 sm:px-8 lg:grid-cols-4 lg:px-10" aria-label="Cargando productos destacados" aria-busy="true">{[0, 1, 2, 3].map((index) => <div key={index} className="h-56 animate-pulse rounded-xl bg-[#f5f1eb] motion-reduce:animate-none" />)}</div>;
}

function availablePhotoAssets() {
  return ["sicaru-hero-desktop.webp", "sicaru-hero-mobile.webp"].every((filename) =>
    existsSync(join(process.cwd(), "public", "images", "campaign", filename))
  );
}

function MissingPhotos() {
  return (
    <section className="bg-[#7F6D8A] px-5 py-12 text-white sm:px-8 sm:py-16" aria-labelledby="banner-photo-pending">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em]">SICARÚ · Laboratorio visual</p>
        <h1 id="banner-photo-pending" className="font-heading mt-4 max-w-[18ch] text-4xl leading-tight sm:text-5xl">
          Belleza profesional para ti y tu salón.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7">
          La fotografía de evaluación todavía no se ha incorporado a esta rama.
          El banner definitivo permanece desactivado para evitar imágenes rotas.
        </p>
        <p className="mt-5 text-sm">Colores aprobados: #7F6D8A y #9B89A8.</p>
      </div>
    </section>
  );
}

export default function BannerCandidateLabPage() {
  // This page is strictly a protected Preview/development laboratory, not a public feature.
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) {
    notFound();
  }

  return (
    <>
      <div className="bg-[#2E2B2B] px-4 py-2 text-center text-xs leading-5 text-white">
        Evaluación de SICARÚ · Fotografía conceptual, no aprobada para producción
      </div>
      {availablePhotoAssets() ? <CampaignHeroCandidate /> : <MissingPhotos />}
      <CategoriesGrid />
      <BrandsShowcase />
      <Suspense fallback={<ProductLoading />}><FeaturedProducts /></Suspense>
      <section aria-labelledby="belleza-identidad" className="bg-[#faf8f5] px-4 py-7 sm:px-8 md:py-9 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[0.65rem] font-semibold uppercase leading-5 tracking-[0.14em] text-[#2e2b2b] sm:text-xs">SICARÚ · BELLEZA CON IDENTIDAD</p>
          <h2 id="belleza-identidad" className="mt-3 font-heading text-[1.75rem] font-medium leading-tight text-[#2e2b2b] sm:text-3xl md:text-4xl">La belleza tiene muchas formas.</h2>
          <p className="mt-3 text-sm leading-6 text-[#2e2b2b]/80 sm:text-base">Cada cabello es diferente. Su cuidado también.</p>
          <Link href="/productos" className="mt-3 inline-flex min-h-11 items-center px-2 text-sm font-medium text-[#2e2b2b] underline decoration-[#8e7a9e] underline-offset-4 hover:decoration-[#7f6d8a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f6d8a]">Explorar productos</Link>
        </div>
      </section>
      <WhatsAppBanner />
      <div className="mx-auto max-w-[1400px] px-4 pb-6 sm:px-8 lg:px-10">
        <Link href="/nosotros" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#7f6d8a] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f6d8a]">Conoce SICARÚ <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>

    </>
  );
}
