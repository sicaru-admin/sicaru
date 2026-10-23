import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BrandsShowcase } from "@/components/home/BrandsShowcase";
import { WhatsAppBanner } from "@/components/home/WhatsAppBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateWebSiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "SICARÚ — Belleza profesional para ti y tu salón",
  description: "Explora coloración, tratamientos, herramientas y marcas profesionales en SICARÚ. Encuentra productos para ti y tu salón con atención cercana.",
};
export const revalidate = 900;

function ProductLoading() {
  return <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 px-4 py-5 sm:px-8 lg:grid-cols-4 lg:px-10" aria-label="Cargando productos destacados" aria-busy="true">{[0, 1, 2, 3].map((index) => <div key={index} className="h-56 animate-pulse rounded-xl bg-[#f5f1eb] motion-reduce:animate-none" />)}</div>;
}

export default function HomePage() {
  return <>
    <JsonLd schema={generateWebSiteSchema()} />
    <HeroSection />
    <CategoriesGrid />
    <Suspense fallback={<ProductLoading />}><FeaturedProducts /></Suspense>
    <BrandsShowcase />
    <WhatsAppBanner />
  </>;
}
