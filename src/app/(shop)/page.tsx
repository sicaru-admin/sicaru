import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <BrandsShowcase />
    <Suspense fallback={<ProductLoading />}><FeaturedProducts /></Suspense>
    <WhatsAppBanner />
    <div className="mx-auto max-w-[1400px] px-4 pb-6 sm:px-8 lg:px-10">
      <Link href="/nosotros#filosofia" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#7f6d8a] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f6d8a]">Conoce SICARÚ <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
    </div>
  </>;
}
