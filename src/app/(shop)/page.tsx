import {Suspense} from "react";
import Link from "next/link";
import type {Metadata} from "next";
import {HeroSection} from "@/components/home/HeroSection";
import {FeaturedProducts} from "@/components/home/FeaturedProducts";
import {CategoriesGrid} from "@/components/home/CategoriesGrid";
import {STORE} from "@/lib/constants/store";
import {JsonLd} from "@/components/seo/JsonLd";
import {generateWebSiteSchema} from "@/lib/schema";
export const metadata: Metadata = {
  title: "Distribuidora Sicarú — Productos de Belleza Profesional",
  description:
    "Sicarú es una tienda de productos profesionales de belleza en Cadereyta Jiménez, Nuevo León. Encuentra coloración, tratamientos capilares, herramientas, depilación y atención personalizada.",
};

export const revalidate = 900;

export default function HomePage(){return <>
  <JsonLd schema={generateWebSiteSchema()}/><HeroSection/><CategoriesGrid/>
  <Suspense fallback={<p className="p-6 text-sm text-gray-500">Cargando destacados…</p>}><FeaturedProducts/></Suspense>
  <section className="mx-auto max-w-7xl border-t border-sicaru-purple-200 px-4 py-7"><h2 className="text-2xl">También te esperamos en tienda</h2><p className="mt-2 text-sm text-gray-600">{STORE.address.full}</p><p className="mt-1 text-sm text-gray-600">{STORE.hours}</p><Link href="/contacto" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-sicaru-purple-700 underline">Cómo llegar</Link></section>
</>;}
