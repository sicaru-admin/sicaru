import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { HttpTypes } from "@medusajs/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, MessageCircle, Search } from "lucide-react";
import { CATALOG_MODE } from "@/lib/catalog-mode";
import { getProductByHandle } from "@/lib/data/products";
import { getApprovedPrice } from "@/lib/product-retail";
import { getProductWhatsAppHref } from "@/lib/product-inquiry";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "SICARÚ · Laboratorio comercial de cuidado capilar",
  robots: { index: false, follow: false },
};

const images = {
  voglia: "/images/products-hero/voglia-total-repair.webp",
  vitale: "/images/products-hero/vitale-bifase-pro-keratin.webp",
  hidra: "/images/products-hero/hidra-color-mask.webp",
  color: "/images/products-hero/voglia-color-fun.webp",
  xiomara: "/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp",
};

function Headline({ children }: { children: ReactNode }) {
  return <h2 className="text-[clamp(2.1rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.06em]">{children}</h2>;
}

function CategoryImage({
  image, alt, label, href, dark,
}: { image: string; alt: string; label: string; href: string; dark?: boolean }) {
  return (
    <Link href={href} className={`group relative isolate block min-h-[230px] min-w-[86%] shrink-0 snap-start overflow-hidden md:min-w-0 rounded-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7F6D8A] sm:min-h-[320px] ${dark ? "bg-[#2E2B2B] text-[#FAF8F5]" : "bg-[#9B89A8] text-[#2E2B2B]"}`}>
      <div aria-hidden="true" className="absolute -right-10 -top-10 h-[70%] w-[80%] rounded-full bg-[#FAF8F5]/15 blur-xl" />
      <Image src={image} alt={alt} fill sizes="(max-width: 639px) 100vw, 50vw" className="object-contain object-[85%_center] p-4 drop-shadow-[6px_10px_9px_rgba(22,16,25,0.18)] motion-safe:md:transition-transform motion-safe:md:duration-200 motion-safe:md:group-hover:scale-[1.025] sm:p-7" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2E2B2B]/55 via-transparent to-transparent" aria-hidden="true" />
      <div className="relative z-10 flex min-h-[230px] flex-col items-start justify-between p-5 text-[#FAF8F5] sm:min-h-[320px] sm:p-7">
        <span className="text-xs font-semibold uppercase tracking-[0.12em]">Explora SICARÚ</span>
        <div className="max-w-[60%]">
          <h3 className="text-2xl font-bold leading-none tracking-[-0.045em] sm:text-3xl">{label}</h3>
          <span className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FAF8F5] px-4 text-xs font-semibold text-[#2E2B2B]">Ver productos <ArrowUpRight size={15} aria-hidden="true" /></span>
        </div>
      </div>
    </Link>
  );
}

export default async function CommerceExperienceLab() {
  // This route never exists in production. No checkout/payment features are enabled.
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) notFound();

  let product: HttpTypes.StoreProduct | null = null;
  try {
    product = await getProductByHandle("xiomara-shampoo-platinum-250ml");
  } catch {
    // Maintain a truthful catalog fallback on backend outages.
  }
  const identityMatches = product?.id === "prod_01M79C6MFY2YPX504ZMDW9HJ0A"
    && product?.handle === "xiomara-shampoo-platinum-250ml"
    && product.variants?.length === 1
    && product.variants[0]?.title === "250 ml"
    && product.variants[0]?.barcode === "7501846500905";
  const verifiedProduct = identityMatches ? product : null;
  const variant = verifiedProduct?.variants?.[0];
  const approvedPrice = verifiedProduct && variant ? getApprovedPrice(verifiedProduct, variant) : null;
  const priceText = approvedPrice
    ? new Intl.NumberFormat("es-MX", { style: "currency", currency: approvedPrice.currency_code || "MXN" }).format(approvedPrice.calculated_amount)
    : "Consultar precio";

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#2E2B2B]">
      <div className="mx-auto max-w-[1400px] px-4 pb-4 pt-7 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[#7F6D8A]">Laboratorio privado · experiencia comercial real · no aprobado</p>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-[#2E2B2B]/75">Esta página prueba el recorrido completo: descubrir una categoría → conocer un producto real → consultar su variante por WhatsApp. No simula pagos, existencias ni envíos automáticos.</p>
      </div>

      <div className="border-y border-[#9B89A8]/25 bg-[#FAF8F5] px-4 py-2 text-center text-xs font-medium text-[#7F6D8A] sm:px-8">
        Variante de rendimiento: menos filtros y un deslizamiento más libre. Todavía es una prueba, no una mejora medida.
      </div>

      <section className="relative isolate overflow-hidden bg-[#F5F1EB]" aria-labelledby="lab-hero-title">
        <div className="pointer-events-none absolute inset-0 opacity-20 noise-overlay" aria-hidden="true" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-[24%] top-[-18%] h-[115%] w-[100%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(155,137,168,0.38)_0%,rgba(155,137,168,0.17)_43%,transparent_72%)] blur-xl sm:-right-[8%] sm:w-[65%]" />
        <div className="relative mx-auto max-w-[1400px] px-5 pb-9 pt-11 sm:px-9 sm:py-16 lg:px-12">
          <div className="relative z-20 flex min-h-[555px] flex-col justify-start md:min-h-[510px] md:justify-center">
            <div className="relative z-20 max-w-[75%] md:max-w-[51%]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#7F6D8A] sm:text-xs">SICARÚ · Belleza profesional para ti y tu salón</p>
              <h1 id="lab-hero-title" className="mt-4 max-w-[12ch] text-[clamp(2.9rem,7.1vw,6rem)] font-bold leading-[0.96] tracking-[-0.072em] text-[#2E2B2B] [text-shadow:0_7px_18px_rgba(46,43,43,0.09)]">Tu belleza.<br/><span className="text-[#7F6D8A]">A tu manera.</span></h1>
              <p className="mt-5 max-w-[30ch] text-sm leading-6 text-[#2E2B2B]/85 sm:text-base">Para quien cuida su cabello y para quien hace de la belleza su profesión. Encuentra el producto adecuado para lo que necesitas.</p>
              <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/categorias/tratamientos-y-mascarillas" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#7F6D8A] px-5 py-3 text-xs font-semibold text-white shadow-[0_12px_20px_-10px_rgba(46,43,43,0.33)] motion-safe:md:transition-transform motion-safe:md:hover:-translate-y-0.5 sm:text-sm">
                  Encontrar mi tratamiento <ArrowUpRight size={17} aria-hidden="true"/>
                </Link>
                <Link href="/productos" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#7F6D8A] bg-[#FAF8F5]/75 px-5 py-3 text-xs font-semibold text-[#2E2B2B] sm:text-sm">
                  <Search size={16} aria-hidden="true"/> Buscar productos
                </Link>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute bottom-[6%] right-[4%] z-0 h-[8%] w-[66%] rounded-full bg-[#2E2B2B]/16 blur-[16px] md:bottom-[12%] md:right-[5%] md:w-[39%] md:blur-[18px]" />
          <div className="pointer-events-none absolute bottom-[0%] right-[-20%] z-10 h-[69%] w-[94%] drop-shadow-[7px_11px_10px_rgba(35,24,38,0.18)] sm:right-[-8%] sm:h-[78%] sm:w-[65%] md:bottom-[-8%] md:right-[0%] md:h-[113%] md:w-[52%]">
            <Image src={images.voglia} alt="Voglia Total Repair, fotografía real de tratamiento capilar SICARÚ" fill priority sizes="(max-width: 767px) 85vw, 50vw" className="object-contain" />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute bottom-3 left-5 z-10 text-[0.65rem] font-semibold tracking-[0.1em] text-[#7F6D8A]/80 sm:left-9 lg:left-12">SICARÚ · BELLEZA PROFESIONAL EN NUEVO LEÓN</div>
        </div>
      </section>

      <section className="relative border-b border-[#8E7A9E]/20 bg-[#FAF8F5] py-9 sm:py-12" aria-labelledby="choose-goal-title">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7F6D8A]">La belleza comienza con una buena elección</p>
          <div className="mt-2 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <h2 id="choose-goal-title" className="max-w-[16ch] text-[clamp(2.15rem,4.5vw,3.9rem)] font-bold leading-[0.98] tracking-[-0.06em]">¿Qué quieres lograr?</h2>
            <p className="max-w-xl text-sm leading-6 text-[#2E2B2B]/80 sm:text-base">No necesitas conocer todos los productos para empezar. Elige tu objetivo y explora una selección de productos profesionales.</p>
          </div>
          <p id="goals-swipe-hint" className="mt-5 text-xs font-medium text-[#7F6D8A] sm:hidden">Desliza para explorar las opciones →</p>
          <div role="region" aria-label="Explora según lo que necesitas" aria-describedby="goals-swipe-hint" tabIndex={0} className="mt-3 flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain pb-3 pr-[16%] [-webkit-overflow-scrolling:touch] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A] sm:mt-7 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pr-0">
            <Link href="/categorias/tratamientos-y-mascarillas" className="group flex min-h-[160px] min-w-[82%] shrink-0 snap-start flex-col justify-between rounded-[18px] bg-[#F5F1EB] p-5 motion-safe:md:transition-transform motion-safe:md:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A] motion-reduce:transform-none sm:min-w-0">
              <span className="text-xs font-semibold text-[#7F6D8A]">01 · Cuidado capilar</span>
              <span className="flex items-end justify-between gap-3 text-lg font-bold leading-tight">Cuidar y tratar mi cabello <ArrowUpRight className="shrink-0 text-[#7F6D8A]" size={20} aria-hidden="true"/></span>
            </Link>
            <Link href="/categorias/color-y-tintes" className="group flex min-h-[160px] min-w-[82%] shrink-0 snap-start flex-col justify-between rounded-[18px] bg-[#9B89A8]/50 p-5 motion-safe:md:transition-transform motion-safe:md:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A] motion-reduce:transform-none sm:min-w-0">
              <span className="text-xs font-semibold text-[#6C5C76]">02 · Coloración</span>
              <span className="flex items-end justify-between gap-3 text-lg font-bold leading-tight">Encontrar mi tono y color <ArrowUpRight className="shrink-0 text-[#7F6D8A]" size={20} aria-hidden="true"/></span>
            </Link>
            <Link href="/salon-pro" className="group flex min-h-[160px] min-w-[82%] shrink-0 snap-start flex-col justify-between rounded-[18px] bg-[#2E2B2B] p-5 text-[#FAF8F5] motion-safe:md:transition-transform motion-safe:md:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B89A8] motion-reduce:transform-none sm:min-w-0">
              <span className="text-xs font-semibold text-[#D9CCDE]">03 · Para profesionales</span>
              <span className="flex items-end justify-between gap-3 text-lg font-bold leading-tight">Productos para mi trabajo <ArrowUpRight className="shrink-0 text-[#D9CCDE]" size={20} aria-hidden="true"/></span>
            </Link>
          </div>
          <p className="mt-4 text-xs text-[#2E2B2B]/65">¿Tienes dudas sobre el producto o la presentación? En cada ficha puedes consultarnos por WhatsApp antes de decidir.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8 sm:py-14" aria-labelledby="category-lab-title">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7F6D8A]">Encuentra lo que buscas</p>
          <Headline>Explora por categoría.</Headline>
          <p className="mt-2 text-sm text-[#2E2B2B]/75">Explora productos de belleza profesional para uso personal y para tu trabajo.</p>
        </div>
        <p id="category-swipe-hint" className="mb-3 text-xs font-medium text-[#7F6D8A] md:hidden">Desliza para ver las categorías →</p>
        <div role="region" aria-label="Categorías de belleza SICARÚ" aria-describedby="category-swipe-hint" tabIndex={0} className="flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain pb-4 pr-[12%] [-webkit-overflow-scrolling:touch] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A] md:grid md:grid-cols-2 md:overflow-visible md:pr-0 md:gap-5">
          <CategoryImage image={images.voglia} alt="Voglia Total Repair" label="Tratamientos" href="/categorias/tratamientos-y-mascarillas" dark/>
          <CategoryImage image={images.color} alt="Voglia Color Fun" label="Coloración" href="/categorias/color-y-tintes" />
        </div>
      </section>

      <section className="bg-[#F5F1EB] py-12" aria-labelledby="product-lab-title">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7F6D8A]">Producto real · Ficha conectada</p>
          <Headline>Producto protagonista.</Headline>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#2E2B2B]/75">Revisa la presentación y consulta precio y disponibilidad antes de pedir. No utilizamos fotografías con errores pendientes.</p>
          {verifiedProduct && variant ? (
            <div className="mt-6 grid gap-0 overflow-hidden rounded-[24px] bg-[#FAF8F5] shadow-[0_20px_45px_-30px_rgba(46,43,43,0.31)] md:grid-cols-2">
              <div className="relative isolate min-h-[420px] overflow-hidden bg-[#9B89A8]/55 sm:min-h-[500px]">
                <div className="noise-overlay pointer-events-none absolute inset-0 opacity-20" aria-hidden="true"/>
                <div className="absolute bottom-[12%] left-[15%] h-[12%] w-[70%] rounded-full bg-[#2E2B2B]/20 blur-xl" aria-hidden="true"/>
                <Image src={images.xiomara} alt={verifiedProduct.title + ", fotografía frontal real"} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-contain p-4 drop-shadow-[7px_11px_10px_rgba(46,43,43,0.18)] sm:p-6"/>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7F6D8A]">XIOMARA</p>
                <h3 className="mt-3 text-2xl font-bold leading-[1.12] tracking-[-0.04em] sm:text-4xl">{verifiedProduct.title}</h3>
                <p className="mt-3 text-sm text-[#2E2B2B]/80">Presentación: {variant.title}</p>
                <p className="mt-6 text-2xl font-bold text-[#7F6D8A]">{priceText}</p>
                <p className="mt-2 text-xs text-[#2E2B2B]/70">Disponibilidad por confirmar</p>
                <a href={getProductWhatsAppHref(verifiedProduct,variant.id)} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#7F6D8A] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#6C5C76] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A]">
                  <MessageCircle size={19} aria-hidden="true"/> Consultar esta presentación por WhatsApp
                </a>
                <Link href={`/productos/${verifiedProduct.handle}`} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-[#2E2B2B] underline underline-offset-4">Ver ficha completa <ArrowUpRight size={16} aria-hidden="true"/></Link>
                <p className="mt-3 text-xs leading-5 text-[#2E2B2B]/60">No se realiza pago online. El envío se cotiza por WhatsApp.</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-[#7F6D8A]/30 bg-[#FAF8F5] p-6">
              <p className="font-semibold">Esta ficha no puede mostrarse con seguridad.</p>
              <p className="mt-2 text-sm text-[#2E2B2B]/75">El producto no respondió o sus datos no coincidieron exactamente con el registro verificado. No mostramos un precio o variante supuestos.</p>
              <Link href="/productos" className="mt-3 inline-flex min-h-11 items-center font-semibold text-[#7F6D8A] underline">Explorar catálogo</Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-11 sm:px-8" aria-label="Asesoría y siguiente paso">
        <div className="grid gap-5 rounded-[22px] bg-[#2E2B2B] px-6 py-8 text-[#FAF8F5] md:grid-cols-[1fr_auto] md:items-center md:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#D9CCDE]">Atención SICARÚ</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">¿No sabes cuál elegir?</h2>
            <p className="mt-3 text-sm text-[#FAF8F5]/85">Cuéntanos qué necesitas para tu cabello o tu trabajo. Te ayudamos a identificar el producto y la presentación antes de pedir.</p>
          </div>
          <a href="https://wa.me/528281136652" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FAF8F5] px-6 py-3 text-sm font-semibold text-[#2E2B2B]"><MessageCircle size={18} aria-hidden="true"/> Escribir por WhatsApp</a>
        </div>
        <p className="mt-5 text-xs text-[#2E2B2B]/65">Prueba de experiencia; fotografías existentes sin reetiquetar, sin modificaciones de precio, inventario, Medusa o checkout. El objetivo es evaluar una ruta comercial real, no aprobar un rediseño completo.</p>
      </section>
    </main>
  );
}
