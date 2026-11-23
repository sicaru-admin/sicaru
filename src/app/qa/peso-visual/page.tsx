import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CATALOG_MODE } from "@/lib/catalog-mode";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Laboratorio visual de productos · SICARÚ",
  robots: { index: false, follow: false },
};

const products = [
  {
    name: "XIOMARA Shampoo Platinum 250 ml",
    presentation: "250 ml",
    handle: "xiomara-shampoo-platinum-250ml",
    front: "/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp",
    back: null,
  },
  {
    name: "XIOMARA Shampoo Platinum Libre de Sulfatos 250 ml",
    presentation: "250 ml",
    handle: "xiomara-shampoo-platinum-libre-sulfatos-250ml",
    front: "/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal-r3.webp",
    back: "/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/02-reverso-r3.webp",
  },
  {
    name: "NEKANE Morazul Shampoo Matizador 300 g",
    presentation: "300 g",
    handle: "nekane-morazul-shampoo-matizador-300g",
    front: "/images/products/nekane-morazul-shampoo-matizador-300g/01-principal-r3.webp",
    back: "/images/products/nekane-morazul-shampoo-matizador-300g/02-reverso-r3.webp",
  },
] as const;

type Sample = typeof products[number];

function SampleCard({ product, elevated }: { product: Sample; elevated: boolean }) {
  return (
    <article className={elevated
      ? "group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e8dedf] bg-[#faf8f5] shadow-[0_12px_30px_rgba(46,43,43,0.09)]"
      : "group flex min-w-0 flex-col rounded-xl border border-[#efe7dd] bg-[#faf8f5] p-2.5 sm:p-4"
    }>
      <div className={elevated
        ? "relative aspect-[4/5] overflow-hidden bg-[#f5f1eb]"
        : "relative aspect-square overflow-hidden rounded-lg bg-[#faf8f5]"
      }>
        <Image src={product.front} alt={product.name} fill sizes="(max-width: 639px) 45vw, 25vw" className={elevated
          ? "object-contain p-1.5 drop-shadow-[0_11px_9px_rgba(46,43,43,0.14)] sm:p-3"
          : "object-contain p-3 drop-shadow-[0_5px_7px_rgba(46,43,43,0.08)] sm:p-5"
        }/>
      </div>
      <div className={elevated ? "flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4" : "flex flex-1 flex-col pt-2.5"}>
        <div className="mb-1 text-[0.62rem] font-semibold uppercase tracking-[0.10em] text-[#7f6d8a]">
          {product.name.startsWith("NEKANE") ? "NEKANE" : "XIOMARA"}
        </div>
        <div className={elevated
          ? "min-h-11 text-[0.83rem] font-semibold leading-[1.35] text-[#2e2b2b] sm:text-sm"
          : "min-h-10 text-xs font-medium leading-5 text-[#2e2b2b] sm:text-sm"
        }>{product.name}</div>
        <div className="mt-1 text-xs text-[#2e2b2b]/65">{product.presentation}</div>
        <div className={elevated ? "mt-3 text-base font-bold text-[#7f6d8a]" : "mt-2 text-sm font-semibold text-[#7f6d8a]"}>
          Consultar precio
        </div>
        <div className="mt-auto pt-3">
          <div className="mb-2 text-[0.69rem] text-[#2e2b2b]/65">Disponibilidad por confirmar</div>
          <div className={elevated
            ? "flex min-h-11 items-center justify-center rounded-full bg-[#7f6d8a] px-2 text-center text-[0.71rem] font-semibold text-white"
            : "flex min-h-11 items-center justify-center rounded-full border border-[#7f6d8a] px-2 text-center text-[0.71rem] font-semibold text-[#7f6d8a]"
          }>
            Consultar por WhatsApp
          </div>
        </div>
      </div>
    </article>
  );
}

function IndividualSample({ product, elevated }: { product: Sample; elevated: boolean }) {
  return (
    <div className="min-w-0 rounded-xl border border-[#e8dedf] bg-[#faf8f5] p-2 sm:p-4">
      <div className={elevated ? "relative aspect-[4/5] overflow-hidden rounded-xl bg-[#f5f1eb]" : "relative aspect-[16/10] overflow-hidden bg-[#faf8f5]"}>
        <Image src={product.front} alt={product.name + " detalle"} fill sizes="(max-width: 639px) 45vw, 30vw" className={elevated ? "object-contain p-2 drop-shadow-[0_12px_12px_rgba(46,43,43,0.12)]" : "object-contain"}/>
      </div>
      <p className="mt-3 text-sm font-semibold text-[#2e2b2b]">{product.name}</p>
      <p className="mt-1 text-xs text-[#7f6d8a]">{elevated ? "Propuesta: galería vertical" : "Actual: galería horizontal"}</p>
    </div>
  );
}


/** SICARÚ Retail Energy: high-impact commercial presentation, not editorial. */
function RetailEnergyCard({ product }: { product: Sample }) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#d9cddf] bg-[#FAF8F5] shadow-[0_10px_0_-6px_#c5b3ce,0_20px_38px_-17px_rgba(46,43,43,0.28)] transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none">
      <div className="relative isolate aspect-[4/5] overflow-hidden bg-[#9B89A8]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_25%,#e4d9e9_0%,#b6a5c3_41%,#7f6d8a_100%)]"/>
        <div aria-hidden="true" className="pointer-events-none absolute -right-[28%] -top-[21%] h-[65%] w-[95%] rotate-[-22deg] rounded-[45%] border-[15px] border-[#FAF8F5]/40 opacity-80"/>
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-[32%] -left-[30%] h-[75%] w-[110%] rotate-[24deg] rounded-[48%] border-[14px] border-[#2E2B2B]/10"/>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20160%20160%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%22.72%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%20opacity%3D%22.8%22/%3E%3C/svg%3E')]"/>
        <Image src={product.front} alt={product.name} fill sizes="(max-width: 639px) 46vw, 22vw" className="relative z-10 object-contain p-2 drop-shadow-[12px_18px_13px_rgba(24,16,30,0.34)] transition-transform duration-500 ease-out group-hover:scale-[1.055] group-hover:-rotate-[1deg] motion-reduce:transform-none motion-reduce:transition-none sm:p-3"/>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-14 bg-gradient-to-t from-[#2E2B2B]/20 to-transparent"/>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4">
        <span className="mb-1 text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-[#7F6D8A]">{product.name.startsWith("NEKANE") ? "NEKANE" : "XIOMARA"}</span>
        <p className="min-h-12 text-[0.8rem] font-bold leading-[1.35] text-[#2E2B2B] sm:text-sm">{product.name}</p>
        <p className="mt-1 text-xs text-[#2E2B2B]/70">{product.presentation}</p>
        <p className="mt-3 text-sm font-bold text-[#7F6D8A] sm:text-base">Consultar precio</p>
        <p className="mt-1 text-[0.7rem] text-[#2E2B2B]/70">Disponibilidad por confirmar</p>
        <div className="mt-auto pt-3">
          <div className="flex min-h-11 items-center justify-center rounded-full bg-[#2E2B2B] px-2 py-2 text-center text-[0.72rem] font-bold text-white transition-colors group-hover:bg-[#7F6D8A]">Consultar por WhatsApp</div>
        </div>
      </div>
    </article>
  );
}

export default function ProductVisualLab() {
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) notFound();

  return (
    <main className="min-h-screen bg-[#faf8f5] px-3 py-8 text-[#2e2b2b] sm:px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 border-b border-[#e8dedf] pb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f6d8a]">SICARÚ · Laboratorio privado · Solo Preview</p>
          <h1 className="mt-3 font-heading text-3xl sm:text-4xl">Retail Energy: fuerza visual en cada producto.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6">Compara tres propuestas con las mismas fotografías reales: A (actual), B (producto ampliado) y C (Retail Energy: grain, profundidad, contraste, capas y movimiento al pasar el cursor). Es una demostración visual sin pedidos ni cambios en Medusa.</p>
          <p className="mt-2 text-sm font-semibold text-[#7f6d8a]">NEKANE Morazul y XIOMARA Libre de Sulfatos conservan observaciones visuales pendientes: este laboratorio NO implica que esas fotografías estén corregidas o aprobadas de nuevo.</p>
        </header>

        <section className="mb-12">
          <div className="mb-4 grid grid-cols-2 gap-3 text-center text-sm font-semibold">
            <div className="rounded-md border border-[#efe7dd] px-3 py-2">A · Densidad actual</div>
            <div className="rounded-md bg-[#7f6d8a] px-3 py-2 text-white">B · Impacto comercial</div>
          </div>
          <div className="space-y-8">
            {products.map(product => (
              <div key={product.handle} className="grid grid-cols-2 gap-3 sm:gap-6">
                <SampleCard product={product} elevated={false}/>
                <SampleCard product={product} elevated/>
              </div>
            ))}
          </div>
        </section>


        <section className="mb-12 border-t border-[#e8dedf] pt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[0.69rem] font-extrabold uppercase tracking-[0.17em] text-[#7F6D8A]">Dirección C · Retail Energy</p>
              <h2 className="mt-1 text-2xl font-bold text-[#2E2B2B]">Grain, volumen y movimiento. Sin estética editorial.</h2>
            </div>
            <span className="rounded-full bg-[#7F6D8A] px-3 py-2 text-[0.69rem] font-bold text-white">NUEVA PRUEBA</span>
          </div>
          <p className="mb-5 max-w-3xl text-sm leading-6">Probamos profundidad en todos los productos: fondo morado con capas, textura grain sutil, sombra de separación del envase, más contraste en textos y un movimiento mínimo al interactuar. El envase, su etiqueta y proporciones no se alteran. Reducir movimiento está respetado. Todo este bloque es una propuesta, no el catálogo real.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {products.map(product => <RetailEnergyCard key={product.handle} product={product}/>)}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5">
            <div className="relative isolate overflow-hidden rounded-2xl bg-[#2E2B2B] px-4 py-7 text-white shadow-[0_13px_24px_-12px_rgba(46,43,43,0.4)] sm:px-6">
              <span aria-hidden="true" className="absolute -right-8 -top-8 h-36 w-36 rounded-full border-[22px] border-[#9B89A8]/60"/>
              <p className="relative text-[0.62rem] font-bold uppercase tracking-[0.13em]">SICARÚ</p>
              <p className="relative mt-3 text-xl font-extrabold leading-tight sm:text-3xl">COLOR CON ACTITUD</p>
              <p className="relative mt-2 text-xs text-white/85 sm:text-sm">Ejemplo de acceso rápido a coloración</p>
              <div className="relative mt-5 inline-flex rounded-full bg-[#FAF8F5] px-4 py-2.5 text-xs font-bold text-[#2E2B2B]">Explorar coloración</div>
            </div>
            <div className="relative isolate overflow-hidden rounded-2xl bg-[#9B89A8] px-4 py-7 text-[#2E2B2B] shadow-[0_13px_24px_-12px_rgba(46,43,43,0.25)] sm:px-6">
              <span aria-hidden="true" className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full border-[24px] border-[#FAF8F5]/65"/>
              <p className="relative text-[0.62rem] font-bold uppercase tracking-[0.13em]">SICARÚ</p>
              <p className="relative mt-3 text-xl font-extrabold leading-tight sm:text-3xl">TU RUTINA, TU ESTILO</p>
              <p className="relative mt-2 text-xs sm:text-sm">Ejemplo de acceso rápido a tratamientos</p>
              <div className="relative mt-5 inline-flex rounded-full bg-[#2E2B2B] px-4 py-2.5 text-xs font-bold text-white">Explorar tratamientos</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#7F6D8A]">Los botones de esta demostración son ilustrativos y no realizan compras. Los dos bloques representan jerarquía y energía comercial; no son propuestas de eslóganes aprobados.</p>
        </section>
        <section className="border-t border-[#e8dedf] py-10">
          <h2 className="font-heading text-2xl">Ficha individual · prueba de encuadre</h2>
          <p className="mb-5 mt-2 max-w-2xl text-sm">Mismo producto y fotografía; una galería vertical dedica más altura a la botella. Evaluar junto al espacio que queda para las variantes y WhatsApp en pantallas pequeñas.</p>
          <div className="grid grid-cols-2 gap-3 sm:max-w-4xl sm:gap-6">
            <IndividualSample product={products[0]} elevated={false}/>
            <IndividualSample product={products[0]} elevated/>
          </div>
        </section>

        <section className="rounded-xl bg-[#f5f1eb] px-5 py-6">
          <h2 className="font-heading text-xl">Qué evaluamos</h2>
          <p className="mt-2 text-sm leading-6">Legibilidad del envase, balance entre producto y texto, reconocimiento de marca, espacio vertical de scroll, claridad del CTA y contraste real en 320, 375 y 390 px. Los precios quedan intencionalmente sin cifra para no inventar información comercial.</p>
          <p className="mt-3 text-xs text-[#7f6d8a]">La muestra es una comparación de diseño aislada; no es la tarjeta interactiva de producción. No fusionar por aprobar únicamente una maqueta.</p>
        </section>
      </div>
    </main>
  );
}
