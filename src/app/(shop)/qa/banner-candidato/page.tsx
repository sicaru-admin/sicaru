import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { CATALOG_MODE } from "@/lib/catalog-mode";
import { CampaignHeroCandidate } from "@/components/home/CampaignHeroCandidate";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { WhatsAppBanner } from "@/components/home/WhatsAppBanner";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "SICARÚ · Evaluación de banner · No publicado",
  robots: { index: false, follow: false },
};

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
      <WhatsAppBanner />
    </>
  );
}
