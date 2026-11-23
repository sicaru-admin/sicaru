import type { Metadata } from "next";
import type { HttpTypes } from "@medusajs/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, MessageCircle, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrandWordmark } from "@/components/layout/BrandWordmark";
import { CATALOG_MODE } from "@/lib/catalog-mode";
import { getProductByHandle } from "@/lib/data/products";
import { getApprovedPrice } from "@/lib/product-retail";
import { getProductWhatsAppHref } from "@/lib/product-inquiry";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "SICARÚ · Identidad y conversión V5 · prueba privada",
  robots: { index: false, follow: false },
};

const portfolio = [
  { title: "Coloración", detail: "Encuentra productos y tonos", href: "/categorias/color-y-tintes", photo: "/images/products-hero/voglia-color-fun.webp" },
  { title: "Cuidado capilar", detail: "Tratamientos para tu rutina", href: "/categorias/tratamientos-y-mascarillas", photo: "/images/products-hero/voglia-total-repair.webp" },
  { title: "Tu trabajo", detail: "Productos para profesionales", href: "/salon-pro", photo: "/images/products-hero/vitale-bifase-pro-keratin.webp" },
] as const;

export default async function IdentidadConversionV5() {
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) notFound();

  let product: HttpTypes.StoreProduct | null = null;
  try { product = await getProductByHandle("xiomara-shampoo-platinum-250ml"); }
  catch { /* Explicitly show truthful fallback when Medusa is unavailable. */ }

  const verified = product?.id === "prod_01M79C6MFY2YPX504ZMDW9HJ0A"
    && product.handle === "xiomara-shampoo-platinum-250ml"
    && product.variants?.length === 1
    && product.variants[0]?.title === "250 ml"
    && product.variants[0]?.barcode === "7501846500905"
    ? product : null;
  const variant = verified?.variants?.[0];
  const approvedPrice = verified && variant ? getApprovedPrice(verified,variant) : null;
  const priceLabel = approvedPrice
    ? new Intl.NumberFormat("es-MX",{style:"currency",currency:approvedPrice.currency_code || "MXN"}).format(approvedPrice.calculated_amount)
    : "Consultar precio";

  return (
    <>
      <Navbar />
      <main className="bg-[#FAF8F5] text-[#2E2B2B]">
        <div className="bg-[#F5F1EB] px-4 py-2 text-center text-[0.67rem] font-semibold tracking-[0.09em] text-[#7F6D8A]">LABORATORIO V5 · EN REVISIÓN · NO APROBADO</div>
        <section aria-labelledby="v5-hero" className="relative isolate overflow-hidden bg-[#7F6D8A] text-[#FAF8F5]">
          <div className="mx-auto grid max-w-[1500px] lg:min-h-[660px] lg:grid-cols-[1.03fr_0.97fr]">
            <div className="relative z-10 flex flex-col justify-center px-5 pb-10 pt-11 sm:px-10 sm:py-14 lg:pl-16">
              <div className="w-fit border-b border-[#FAF8F5]/55 pb-3"><BrandWordmark variant="light" /></div>
              <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#FAF8F5]/95">Belleza profesional para ti y tu salón</p>
              <h1 id="v5-hero" className="mt-5 max-w-[12ch] text-[clamp(3.1rem,6.5vw,6.7rem)] font-bold leading-[0.95] tracking-[-0.07em]">Belleza que se siente tuya.</h1>
              <p className="mt-6 max-w-[36ch] text-sm leading-6 text-[#FAF8F5]/95 sm:text-base">Color, cuidado y herramientas para expresar tu estilo y acompañar tu trabajo.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="#v5-explora" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#FAF8F5] px-6 py-3 text-sm font-bold text-[#2E2B2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Descubre SICARÚ <ArrowUpRight size={17} aria-hidden="true"/></Link>
                <Link href="/productos" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#FAF8F5]/80 px-6 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Ver productos</Link>
              </div>
              <p className="mt-6 text-xs font-semibold text-[#FAF8F5]/85">Productos de belleza profesional · Atención cercana en Nuevo León</p>
            </div>
            <div className="relative min-h-[370px] overflow-hidden bg-[#2E2B2B] sm:min-h-[480px] lg:min-h-[660px]">
              <div className="absolute inset-0 bg-cover bg-[position:50%_36%]" role="img" aria-label="Fotografía humana provisional de referencia de campaña, no afiliada a SICARÚ" style={{backgroundImage:'url("https://images.unsplash.com/photo-1634340368273-18c340620941?auto=format&fit=crop&w=1200&q=75")'}} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E2B2B]/55 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#7F6D8A]/40 lg:via-transparent lg:to-transparent" />
              <div className="absolute bottom-5 left-5 border-l-2 border-[#FAF8F5] pl-3 text-xs font-semibold tracking-[0.12em] text-[#FAF8F5] sm:bottom-8 sm:left-8">PARA TODAS LAS FORMAS DE BELLEZA</div>
            </div>
          </div>
        </section>
        <p className="bg-[#F5F1EB] px-5 py-2 text-center text-[0.66rem] leading-5 text-[#7F6D8A]">Foto humana externa temporal de referencia, no aprobada ni vinculada con SICARÚ. La fotografía de campaña definitiva está pendiente.</p>

        <section id="v5-explora" aria-labelledby="v5-discover-title" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7F6D8A]">SICARÚ · Encuentra tu camino</p>
              <h2 id="v5-discover-title" className="mt-2 max-w-[19ch] text-[clamp(2.2rem,4.6vw,4.2rem)] font-bold leading-[0.99] tracking-[-0.06em]">¿Qué necesitas hoy?</h2>
            </div>
            <Link href="/productos" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#7F6D8A]">Todo el catálogo <ArrowUpRight size={16} aria-hidden="true"/></Link>
          </div>
          <p id="v5-swipe-hint" className="mt-5 text-xs font-medium text-[#7F6D8A] md:hidden">Desliza para explorar →</p>
          <div role="region" aria-label="Explorar según tu objetivo" aria-describedby="v5-swipe-hint" tabIndex={0} className="mt-4 flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain pb-5 pr-[17%] [-webkit-overflow-scrolling:touch] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pr-0">
            {portfolio.map((item,idx)=>(
              <Link key={item.title} href={item.href} className="group relative flex min-h-[395px] min-w-[83%] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border border-[#8E7A9E]/15 bg-[#F5F1EB] shadow-[0_14px_30px_-25px_rgba(46,43,43,0.23)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A] md:min-w-0">
                <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{background:idx===0 ? "radial-gradient(ellipse 90% 80% at 66% 30%,rgba(142,122,158,0.46),transparent 75%),linear-gradient(140deg,#FAF8F5,#F5F1EB)" : idx===1 ? "radial-gradient(ellipse 90% 80% at 66% 30%,rgba(155,137,168,0.23),transparent 76%),linear-gradient(140deg,#FAF8F5,#F5F1EB)" : "radial-gradient(ellipse 90% 80% at 65% 30%,rgba(127,109,138,0.35),transparent 75%),linear-gradient(140deg,#FAF8F5,#F5F1EB)"}} />
                <div className="noise-overlay pointer-events-none absolute inset-0 z-10" aria-hidden="true" />
                <div className="relative z-0 h-[270px] flex-1">
                  <div aria-hidden="true" className="absolute bottom-[9%] left-[22%] h-5 w-[56%] rounded-full bg-[#2E2B2B]/10 blur-[13px]" />
                  <Image src={item.photo} alt={item.title + " · fotografía real de producto"} fill sizes="(max-width: 767px) 85vw, 33vw" className="object-contain p-1 drop-shadow-[5px_9px_9px_rgba(46,43,43,0.13)] motion-safe:md:transition-transform motion-safe:md:duration-200 motion-safe:md:group-hover:scale-[1.045]" />
                </div>
                <div className="relative z-20 min-h-[122px] px-5 pb-5 pt-1 text-[#2E2B2B] sm:px-6 sm:pb-6">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.09em] text-[#7F6D8A]">{item.detail}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <h3 className="text-[clamp(1.35rem,2vw,1.75rem)] font-bold leading-tight tracking-[-0.045em]">{item.title}</h3>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#7F6D8A]/35 bg-[#FAF8F5] text-[#7F6D8A] transition-colors group-hover:bg-[#7F6D8A] group-hover:text-[#FAF8F5] motion-reduce:transition-none"><ChevronRight size={19} aria-hidden="true"/></span>
                  </div>
                </div>
              </Link>
            ))}         </div>
        </section>

        <section aria-labelledby="v5-product-title" className="bg-[#F5F1EB] py-12 sm:py-16">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#7F6D8A]">Productos reales · Información verificada</p>
            <h2 id="v5-product-title" className="mt-3 max-w-[18ch] text-[clamp(2.1rem,4.6vw,3.9rem)] font-bold leading-[1.02] tracking-[-0.06em]">Conoce el producto antes de elegir.</h2>
            {verified && variant ? (
              <div className="mt-7 grid overflow-hidden rounded-[22px] bg-[#FAF8F5] shadow-[0_15px_30px_-25px_rgba(46,43,43,0.35)] md:grid-cols-2">
                <div className="relative min-h-[350px] bg-[#9B89A8]/35 sm:min-h-[460px]">
                  <Image src="/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp" alt={verified.title + " - fotografía frontal real"} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-contain p-6" />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-10">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7F6D8A]">XIOMARA · Producto de catálogo</p>
                  <h3 className="mt-3 text-2xl font-bold leading-tight tracking-[-0.04em] sm:text-3xl">{verified.title}</h3>
                  <p className="mt-4 text-sm">Presentación: {variant.title}</p>
                  <p className="mt-5 text-xl font-bold text-[#7F6D8A]">{priceLabel}</p>
                  <p className="mt-2 text-xs text-[#2E2B2B]/75">Disponibilidad por confirmar</p>
                  <a href={getProductWhatsAppHref(verified,variant.id)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#7F6D8A] px-5 py-3 text-center text-sm font-bold text-white"><MessageCircle size={18} aria-hidden="true"/> Consultar esta presentación</a>
                  <Link href={`/productos/${verified.handle}`} className="mt-3 inline-flex min-h-11 items-center justify-center text-sm font-semibold text-[#7F6D8A] underline underline-offset-4">Ver ficha completa</Link>
                  <p className="mt-3 text-xs text-[#2E2B2B]/65">Sin pago online. El envío se cotiza por WhatsApp.</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-[#FAF8F5] p-6 text-sm">
                <p className="font-bold">La ficha no pudo verificarse en Medusa.</p>
                <p className="mt-2">No mostramos datos, precios ni variantes que no se hayan confirmado.</p>
                <Link href="/productos" className="mt-4 inline-flex min-h-11 items-center font-semibold text-[#7F6D8A] underline">Explorar productos</Link>
              </div>
            )}
          </div>
        </section>
        <section aria-label="Atención SICARÚ" className="bg-[#2E2B2B] px-5 py-11 text-[#FAF8F5] sm:px-10">
          <div className="mx-auto flex max-w-[1250px] flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9B89A8]">Te orientamos en tu compra</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">¿Buscas un producto o tono específico?</h2>
              <p className="mt-3 max-w-[48ch] text-sm leading-6">Dinos qué necesitas y te ayudamos a identificar el producto y su presentación.</p>
            </div>
            <a href="https://wa.me/528281136652" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#FAF8F5] px-6 py-3 text-sm font-bold text-[#2E2B2B]"><MessageCircle size={18} aria-hidden="true"/> Consultar por WhatsApp</a>
          </div>
        </section>
        <p className="bg-[#FAF8F5] px-4 py-4 text-center text-xs text-[#7F6D8A]">V5 · Propuesta no aprobada · Sin modificar producción, inventario, precios ni pagos.</p>
      </main>
      <Footer />
    </>
  );
}
