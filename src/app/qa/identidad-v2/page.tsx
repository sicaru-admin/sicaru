import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CATALOG_MODE } from "@/lib/catalog-mode";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "SICARÚ · Identidad V2 · Fase 1",
  robots: { index: false, follow: false },
};

const front = "/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp";

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
function Label({ children }: { children: ReactNode }) {
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


/** Unbalanced editorial-free merchandising stage: overlap, loose placement, no enclosing card. */
function FluidComposition() {
  return (
    <div className="relative isolate overflow-hidden rounded-[1.65rem] bg-[#FAF8F5] shadow-[0_24px_45px_-30px_rgba(46,43,43,0.38)]">
      <Grain light />
      <div aria-hidden="true" className="pointer-events-none absolute -right-[16%] -top-[15%] h-[110%] w-[74%] rotate-[-12deg] rounded-[43%_57%_58%_42%/46%_37%_63%_54%] bg-[#8E7A9E] sm:right-[-8%] sm:w-[63%]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-[13%] h-[78%] w-[65%] rotate-[17deg] rounded-[57%_43%_32%_68%/60%_51%_49%_40%] border-[24px] border-[#9B89A8]/65 sm:border-[52px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[13%] left-[-10%] h-2 w-[63%] -rotate-[12deg] bg-[#7F6D8A]/35 sm:h-3" />
      <div className="relative z-10 min-h-[480px] px-5 pb-5 pt-8 sm:min-h-[590px] sm:px-10 sm:pt-14 lg:min-h-[520px] lg:px-16">
        <div className="relative z-20 max-w-[74%] sm:max-w-[58%]">
          <p className="text-[0.68rem] font-bold tracking-[0.09em] text-[#7F6D8A] sm:text-sm">SICARÚ · Belleza profesional</p>
          <h2 className="mt-4 font-sans text-[clamp(2.8rem,7.7vw,6.6rem)] font-bold leading-[0.83] tracking-[-0.085em] text-[#2E2B2B]">
            Belleza<br/><span className="relative ml-[4%] inline-block -rotate-[5deg] text-[#7F6D8A] [text-shadow:3px_5px_0_rgba(155,137,168,0.22)] sm:ml-[7%]">sin</span><br/>límites.
          </h2>
          <p className="mt-5 max-w-[20ch] text-xs font-medium leading-5 text-[#2E2B2B] sm:mt-7 sm:text-base sm:leading-6">Productos para crear tu propio estilo.</p>
        </div>
        <div className="pointer-events-none absolute bottom-[15%] right-[-11%] z-30 h-[64%] w-[62%] -rotate-[10deg] drop-shadow-[20px_26px_14px_rgba(46,43,43,0.28)] sm:bottom-[6%] sm:right-[-2%] sm:h-[83%] sm:w-[49%] sm:-rotate-[8deg]">
          <Image src={front} alt="XIOMARA Shampoo Platinum 250 ml, fotografía real de producto para prueba de composición" fill sizes="(max-width: 639px) 65vw, 45vw" className="object-contain" />
        </div>
        <div className="relative z-40 mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-[#2E2B2B] px-5 py-3 text-[0.72rem] font-semibold text-white shadow-[5px_7px_0_rgba(127,109,138,0.32)] sm:mt-12 sm:text-sm">
          Explorar productos <span className="ml-2" aria-hidden="true">↗</span>
        </div>
        <div className="absolute bottom-5 left-5 z-20 text-[0.62rem] font-semibold text-[#7F6D8A] sm:bottom-7 sm:left-10">COMPOSICIÓN EN PRUEBA · NO APROBADA</div>
      </div>
    </div>
  );
}


/** Phase 1B: the actual bottle creates visual weight, without graphic lines. */
function ProductFirstComposition() {
  return (
    <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-[#FAF8F5] shadow-[0_19px_42px_-25px_rgba(46,43,43,0.22)]">
      <Grain light />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-18%] right-[-26%] h-[98%] w-[112%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(155,137,168,0.48)_0%,rgba(142,122,158,0.15)_47%,transparent_73%)] blur-[25px] sm:bottom-[-34%] sm:right-[-13%] sm:h-[145%] sm:w-[76%] sm:blur-[38px]" />
      <div className="relative min-h-[610px] px-5 pb-9 pt-9 sm:min-h-[560px] sm:px-10 sm:pb-10 sm:pt-12 lg:px-14">
        <div className="relative z-30 max-w-[95%] sm:max-w-[56%]">
          <p className="text-[0.65rem] font-semibold tracking-[0.10em] text-[#7F6D8A] sm:text-sm">SICARÚ · Belleza profesional</p>
          <h2 className="mt-5 font-sans text-[clamp(3.25rem,7.2vw,6.1rem)] font-bold leading-[0.9] tracking-[-0.08em] text-[#2E2B2B] [text-shadow:0_7px_18px_rgba(46,43,43,0.14)]">
            Belleza<br/><span className="relative ml-[3%] inline-block -rotate-[4deg] text-[#7F6D8A] [text-shadow:0_8px_18px_rgba(127,109,138,0.24)]">sin</span><br/>límites.
          </h2>
          <p className="mt-5 max-w-[19ch] text-sm font-medium leading-6 text-[#2E2B2B] sm:mt-7 sm:text-base">Productos para crear tu propio estilo.</p>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute bottom-[6%] right-[3%] z-10 h-[13%] w-[72%] rounded-full bg-[#2E2B2B]/20 blur-[22px] sm:bottom-[8%] sm:right-[5%] sm:h-[12%] sm:w-[48%] sm:blur-[30px]" />
        <div className="pointer-events-none absolute bottom-[3%] right-[-12%] z-20 h-[66%] w-[91%] -rotate-[6deg] drop-shadow-[16px_22px_17px_rgba(35,26,40,0.24)] sm:bottom-[1%] sm:right-[-6%] sm:h-[105%] sm:w-[65%] sm:-rotate-[5deg]">
          <Image src={front} alt="Fotografía real de XIOMARA Shampoo Platinum 250 ml; prueba de mayor protagonismo del envase" fill sizes="(max-width: 639px) 95vw, 65vw" className="object-contain" />
        </div>
        <div className="absolute bottom-8 left-5 z-40 sm:bottom-11 sm:left-10 lg:left-14">
          <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7F6D8A] px-5 py-3 text-xs font-semibold text-white shadow-[0_10px_20px_-9px_rgba(46,43,43,0.38)] sm:text-sm">
            Explorar productos <span className="ml-2" aria-hidden="true">↗</span>
          </span>
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
          <p className="mt-3 max-w-3xl text-sm leading-6">Las primeras variantes A–C quedaron como contraste histórico: no están aprobadas. Comparamos color, tipografía, sombra tipográfica, grain y una nueva composición libre y asimétrica. Se usa una fotografía real existente de XIOMARA Platinum 250 ml, sin alterar su empaque.</p>
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
        <section aria-labelledby="lab-fluid" className="mt-12">
          <div className="mb-4">
            <p className="text-xs font-bold tracking-[0.12em] text-[#7F6D8A]">D · NUEVA PRUEBA PARA CORREGIR LA RIGIDEZ</p>
            <h2 id="lab-fluid" className="mt-2 text-2xl font-bold tracking-[-0.05em] sm:text-3xl">Más natural. Más atrevida. Más movimiento.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6">Sin caja alrededor del producto, sin titulares todos iguales y sin dividir la pantalla en mitades rígidas. Aquí la fotografía cruza las formas, el texto tiene ritmo y el peso visual viene de una composición asimétrica.</p>
          </div>
          <FluidComposition />
        </section>
        <section aria-labelledby="lab-product-first" className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7F6D8A]">E · FASE 1B — CORRECCIÓN PEDIDA</p>
          <h2 id="lab-product-first" className="mt-2 text-2xl font-bold tracking-[-0.05em] sm:text-3xl">Menos líneas. Más producto.</h2>
          <p className="mb-4 mt-2 max-w-3xl text-sm leading-6">Conservamos la tipografía que te gustó, pero la sombra del texto ahora se difumina. Eliminamos las formas y líneas protagonistas. El envase real ocupa más espacio, con sombra ambiental y un apoyo de color desenfocado que no compite con él. Prueba visual, todavía no aprobada.</p>
          <ProductFirstComposition />
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
