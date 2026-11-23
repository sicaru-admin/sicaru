import type { Metadata } from "next";
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

function Headline({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[clamp(2.1rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.06em]">{children}</h2>;
}

function CategoryImage({
  image, alt, label, href, dark,
}: { image: string; alt: string; label: string; href: string; dark?: boolean }) {
  return (
    <Link href={href} className={`group relative isolate block min-h-[230px] overflow-hidden rounded-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7F6D8A] sm:min-h-[320px] ${dark ? "bg-[#2E2B2B] text-[#FAF8F5]" : "bg-[#D9CCDE] text-[#2E2B2B]"}`}>
      <div aria-hidden="true" className="absolute -right-10 -top-10 h-[70%] w-[80%] rounded-full bg-[#FAF8F5]/15 blur-3xl" />
      <Image src={image} alt={alt} fill sizes="(max-width: 639px) 100vw, 50vw" className="object-contain object-[85%_center] p-4 drop-shadow-[13px_18px_13px_rgba(22,16,25,0.26)] transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none sm:p-7" />
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

  let product: Awaited<ReturnType<typeof getProductByHandle>> = null;
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

      <section className="overflow-hidden bg-[#F5F1EB]" aria-labelledby="lab-hero-title">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[0.94fr_1.06fr]">
          <div className="relative z-20 flex min-h-[270px] flex-col justify-center px-5 pb-4 pt-9 sm:px-9 sm:py-14 lg:pl-12">
            <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[#7F6D8A]">SICARÚ · Cuidado capilar</p>
            <h1 id="lab-hero-title" className="mt-4 max-w-[13ch] text-[clamp(2.8rem,7.2vw,6.4rem)] font-bold leading-[0.94] tracking-[-0.075em] text-[#2E2B2B] [text-shadow:0_8px_19px_rgba(46,43,43,0.10)]">Tu cabello. Tu estilo.</h1>
            <p className="mt-5 max-w-[33ch] text-sm leading-6 text-[#2E2B2B]/85 sm:text-base">Descubre tratamientos y productos profesionales para tu rutina.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/categorias/tratamientos-y-mascarillas" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#7F6D8A] px-5 py-3 text-xs font-semibold text-white shadow-[0_12px_22px_-11px_rgba(46,43,43,0.42)] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none sm:text-sm">
                Explorar tratamientos <ArrowUpRight size={17} aria-hidden="true"/>
              </Link>
              <Link href="/productos" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#7F6D8A] px-5 py-3 text-xs font-semibold text-[#2E2B2B] sm:text-sm">
                <Search size={16} aria-hidden="true"/> Buscar productos
              </Link>
            </div>
          </div>
          <div className="relative isolate min-h-[370px] overflow-hidden bg-[#9B89A8] sm:min-h-[480px] md:min-h-[530px]">
            <div className="noise-overlay pointer-events-none absolute inset-0 z-0 opacity-75" aria-hidden="true"/>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(250,248,245,0.45)_0%,rgba(155,137,168,0.28)_56%,rgba(127,109,138,0.28)_100%)]" aria-hidden="true"/>
            <div aria-hidden="true" className="absolute bottom-[4%] left-[20%] h-[12%] w-[64%] rounded-full bg-[#2E2B2B]/25 blur-[24px]"/>
            <div className="absolute -bottom-[9%] left-[-5%] h-[91%] w-[60%] -rotate-[8deg] drop-shadow-[14px_22px_16px_rgba(35,24,38,0.24)]">
              <Image src={images.voglia} alt="Voglia Total Repair, fotografía de producto SICARÚ" fill priority sizes="(max-width: 767px) 55vw, 32vw" className="object-contain"/>
            </div>
            <div className="absolute -bottom-[4%] right-[-5%] h-[90%] w-[60%] rotate-[7deg] drop-shadow-[14px_22px_16px_rgba(35,24,38,0.25)]">
              <Image src={images.vitale} alt="Vitale Bifase Pro-Keratin, fotografía de producto SICARÚ" fill priority sizes="(max-width: 767px) 55vw, 32vw" className="object-contain"/>
            </div>
            <div className="absolute bottom-[0%] left-[32%] h-[73%] w-[45%] drop-shadow-[15px_22px_18px_rgba(35,24,38,0.33)]">
              <Image src={images.hidra} alt="HIDRA Color Mask, fotografía de producto SICARÚ" fill priority sizes="(max-width: 767px) 47vw, 22vw" className="object-contain"/>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8 sm:py-14" aria-labelledby="category-lab-title">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7F6D8A]">Encuentra lo que buscas</p>
          <Headline>Explora por categoría.</Headline>
          <p className="mt-2 text-sm text-[#2E2B2B]/75">Fotografías auténticas, accesos directos y menos pasos para llegar al producto.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 md:gap-5">
          <CategoryImage image={images.voglia} alt="Voglia Total Repair" label="Tratamientos" href="/categorias/tratamientos-y-mascarillas" dark/>
          <CategoryImage image={images.color} alt="Voglia Color Fun" label="Coloración" href="/categorias/color-y-tintes" />
        </div>
      </section>

      <section className="bg-[#F5F1EB] py-12" aria-labelledby="product-lab-title">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7F6D8A]">Producto real · Ficha conectada</p>
          <Headline>Producto protagonista.</Headline>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#2E2B2B]/75">Un solo producto verificado para probar fotografía, claridad comercial y consulta real. No utilizamos las fotografías con errores pendientes.</p>
          {verifiedProduct && variant ? (
            <div className="mt-6 grid gap-0 overflow-hidden rounded-[24px] bg-[#FAF8F5] shadow-[0_20px_45px_-30px_rgba(46,43,43,0.31)] md:grid-cols-2">
              <div className="relative isolate min-h-[420px] overflow-hidden bg-[#D9CCDE] sm:min-h-[500px]">
                <div className="noise-overlay pointer-events-none absolute inset-0 opacity-40" aria-hidden="true"/>
                <div className="absolute bottom-[12%] left-[15%] h-[12%] w-[70%] rounded-full bg-[#2E2B2B]/20 blur-3xl" aria-hidden="true"/>
                <Image src={images.xiomara} alt={verifiedProduct.title + ", fotografía frontal real"} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-contain p-4 drop-shadow-[15px_22px_18px_rgba(46,43,43,0.24)] sm:p-6"/>
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
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">¿Buscas algo específico?</h2>
            <p className="mt-3 text-sm text-[#FAF8F5]/85">Dinos qué producto, presentación o tono necesitas. Te orientamos por WhatsApp.</p>
          </div>
          <a href="https://wa.me/528281136652" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FAF8F5] px-6 py-3 text-sm font-semibold text-[#2E2B2B]"><MessageCircle size={18} aria-hidden="true"/> Escribir por WhatsApp</a>
        </div>
        <p className="mt-5 text-xs text-[#2E2B2B]/65">Prueba de experiencia; fotografías existentes sin reetiquetar, sin modificaciones de precio, inventario, Medusa o checkout. El objetivo es evaluar una ruta comercial real, no aprobar un rediseño completo.</p>
      </section>
    </main>
  );
}
