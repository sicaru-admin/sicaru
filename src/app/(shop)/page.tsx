import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { BrandsShowcase } from "@/components/home/BrandsShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { MontisFeature } from "@/components/home/MontisFeature";
import { BlogPreview } from "@/components/home/BlogPreview";
import { SalonCTA } from "@/components/home/SalonCTA";
import { WhatsAppBanner } from "@/components/home/WhatsAppBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateWebSiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Distribuidora Sicarú — Productos de Belleza Profesional",
  description:
    "Distribuidora autorizada de productos de belleza profesional en México. Küül, Voglia, Nekane, Hidra Color, Xiomara, Vitale y Montis con envío a todo el país.",
};

export const revalidate = 900;

function FeaturedProductsFallback() {
  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex justify-center">
          <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <div className="aspect-square animate-pulse bg-gray-200" />
              <div className="p-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd schema={generateWebSiteSchema()} />
      <HeroSection />
      <TrustBar />
      <BrandsShowcase />
      <Suspense fallback={<FeaturedProductsFallback />}>
        <FeaturedProducts />
      </Suspense>
      <CategoriesGrid />
      <MontisFeature />
      <BlogPreview />
      <SalonCTA />
      <WhatsAppBanner />
    </>
  );
}
