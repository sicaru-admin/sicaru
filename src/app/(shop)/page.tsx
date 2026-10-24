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
  </>;
}
