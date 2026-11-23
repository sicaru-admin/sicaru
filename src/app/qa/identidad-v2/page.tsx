import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CATALOG_MODE } from "@/lib/catalog-mode";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "SICARÚ · Identidad V2 · Fase 1",
  robots: { index: false, follow: false },
};

const front = "/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp";
const purple = "#7F6D8A";
const offwhite = "#FAF8F5";
const ink = "#2E2B2B";

/** No external network images; uses the existing unaltered XIOMARA product photo. */
function Bottle({ mode }: { mode: "dark" | "purple" | "light" }) {
  return (
    <div className="pointer-events-none relative z-10 h-[240px] w-[42%] min-w-0 sm:h-[310px] md:h-[360px]">
      <div aria-hidden="true" className={`absolute bottom-[12%] left-[16%] h-[12%] w-[65%] -skew-x-12 rounded-full blur-lg ${mode === "light" ? "bg-[#2E2B2B]/20" : "bg-black/35"}`} />
      <Image src={front} alt="Fotografía real de XIOMARA Shampoo Platinum 250 ml" fill priority sizes="(max-width: 639px) 180px, 330px" className="relative z-10 object-contain drop-shadow-[13px_18px_12px_rgba(16,10,19,0.28)]" />
    </div>
  );
}
function Grain({ light = false }: { light?: boolean }) {
  return <div aria-hidden="true" className={`noise-overlay pointer-events-none absolute inset-0 z-0 ${light ? "opacity-50" : "opacity-100"}`} />;
}
function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[0.64rem] font-bold uppercase tracking-[0.14em] sm:text-xs">{children}</span>;
}
function Visual({ variant }: { variant: "light" | "purple" | "dark" }) {
  const isLight = variant === "light";
  const isPurple = variant === "purple";
  const surface = isLight ? "bg-[#FAF8F5] text-[#2E2B2B]" : isPurple ? "bg-[#7F6D8A] text-[#FFFFFF]" : "bg-[#2E2B2B] text-[#FAF8F5]";
  const kicker = isLight ? "text-[#7F6D8A]" : "text-[#FAF8F5]";
  const accent = isLight ? "bg-[#7F6D8A] text-white" : isPurple ? "bg-[#FAF8F5] text-[#2E2B2B]" : "bg-[#9B89A8] text-[#2E2B2B]";
  const shadow = isLight ? "[text-shadow:3px_3px_0_rgba(155,137,168,0.34)]" : isPurple ? "[text-shadow:4px_4px_0_rgba(46,43,43,0.40)]" : "[text-shadow:4px_4px_0_rgba(127,109,138,0.95)]";
  return (
    <div className={`relative isolate overflow-hidden rounded-[20px] border border-[#9B89A8]/25 ${surface} shadow-[0_16px_28px_-16px_rgba(46,43,43,0.27)]`}>
      <Grain light={isLight} />
      <div aria-hidden="true" className={`absolute -left-8 top-[14%] h-4 w-[55%] -rotate-[8deg] ${isLight ? "bg-[#9B89A8]/35" : "bg-[#FAF8F5]/15"}`} />
      <div aria-hidden="true" className={`absolute -right-10 bottom-[15%] h-3 w-[65%] rotate-[9deg] ${isLight ? "bg-[#7F6D8A]/20" : "bg-[#FAF8F5]/15"}`} />
      <div className="relative z-10 flex min-h-[290px] items-center gap-0 pl-4 pr-1 sm:min-h-[360px] sm:pl-7">
        <div className="relative z-20 w-[58%] min-w-0 py-5">
          <div className={kicker}><Label>SICARÚ · BEAUTY SUPPLY</Label></div>
          <h2 className={`mt-3 max-w-[10ch] font-sans text-[clamp(1.65rem,4.2vw,3.35rem)] font-bold uppercase leading-[0.96] tracking-[-0.055em] ${shadow}`}>COLOR CON PRESENCIA.</h2>
          <p className="mt-3 max-w-[20ch] text-xs font-medium leading-5 sm:text-sm">Coloración y cuidado profesional en un solo lugar.</p>
          <span className={`mt-5 inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-[0.7rem] font-bold sm:text-xs ${accent}`}>Explorar productos</span>
        </div>
        <Bottle mode={variant} />
      </div>
    </div>
  );
}

function TypeAndTexture() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="relative isolate overflow-hidden rounded-[20px] bg-[#FAF8F5] p-6 shadow-[0_10px_32px_rgba(46,43,43,0.09)] sm:p-8">
        <Grain light />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7F6D8A]">Prueba de tipografía</p>
          <h3 className="mt-3 font-sans text-4xl font-bold uppercase leading-[0.98] tracking-[-0.055em] text-[#2E2B2B] [text-shadow:3px_3px_0_rgba(155,137,168,0.38)] sm:text-5xl">MÁS FUERZA.<br/>MÁS SICARÚ.</h3>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#2E2B2B]">Titulares Poppins de gran escala; la sombra desplaza volumen detrás del texto. Nunca bajo textos descriptivos o precios.</p>
        </div>
      </div>
      <div className="relative isolate overflow-hidden rounded-[20px] bg-[#7F6D8A] p-6 text-white shadow-[0_10px_32px_rgba(46,43,43,0.15)] sm:p-8">
        <Grain />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.12em]">Prueba de textura</p>
          <h3 className="mt-3 text-4xl font-bold uppercase leading-[0.98] tracking-[-0.05em] [text-shadow:3px_4px_0_rgba(46,43,43,0.45)] sm:text-5xl">UNA MARCA<br/>QUE SE NOTA.</h3>
          <p className="mt-4 max-w-sm text-sm leading-6">Grain muy suave en superficies gráficas, sombra tipográfica solo en titulares y fotografía real que mantiene todo su protagonismo.</p>
        </div>
      </div>
    </div>
  );
}

export default function IdentityLab() {
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) notFound();
  return (
    <main className="min-h-screen bg-[#F5F1EB] px-3 py-8 text-[#2E2B2B] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7F6D8A]">SICARÚ · Laboratorio independiente · Fase 1</p>
          <h1 className="mt-3 text-3xl font-bold uppercase tracking-[-0.045em] sm:text-5xl">Identidad con fuerza.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6">Esta prueba NO adopta la dirección editorial ni Retail Energy anteriores. Comparamos únicamente color, tipografía, sombra tipográfica, grain y presencia fotográfica. Se usa una fotografía real existente de XIOMARA Platinum 250 ml, sin alterar su empaque.</p>
          <p className="mt-2 text-xs font-semibold text-[#7F6D8A]">Los titulares son demostraciones, no textos comerciales aprobados. Los botones son ilustrativos; no generan pedidos ni consultas.</p>
        </header>
        <section aria-labelledby="lab-variants" className="space-y-4">
          <h2 id="lab-variants" className="text-xl font-bold">Tres tratamientos con la paleta actual</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.1em]">A · Marfil + sombra lavanda</p><Visual variant="light"/></div>
            <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.1em]">B · Morado SICARÚ + alto contraste</p><Visual variant="purple"/></div>
          </div>
          <div className="lg:max-w-[calc(50%-8px)]"><p className="mb-2 text-xs font-bold uppercase tracking-[0.1em]">C · Carbón + acento morado</p><Visual variant="dark"/></div>
        </section>
        <section aria-labelledby="lab-type" className="mt-12">
          <h2 id="lab-type" className="mb-3 text-xl font-bold">Tipografía, textura y volumen</h2>
          <TypeAndTexture/>
        </section>
        <section className="mt-10 rounded-2xl border border-[#9B89A8]/45 bg-[#FAF8F5] p-5 text-sm leading-6">
          <h2 className="text-lg font-bold">Criterios para aprobar esta fase</h2>
          <p className="mt-2">1. La marca se reconoce sin cambiar sus colores. 2. El titular destaca sin perder legibilidad. 3. El grain aporta materialidad sin ensuciar el producto. 4. La sombra de texto se usa solo como recurso de campaña. 5. La fotografía se ve auténtica, sin etiquetas inventadas. 6. El botón y la navegación siguen claros en móvil.</p>
          <p className="mt-3 text-xs font-semibold text-[#7F6D8A]">Próximas fases: fondos y apoyo fotográfico, composición de categorías, microcopy y psicología de ventas, y flujo de consulta por WhatsApp. Ninguna está aprobada en esta prueba.</p>
        </section>
      </div>
    </main>
  );
}
