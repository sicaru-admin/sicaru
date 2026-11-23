import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

export default function ProductVisualLab() {
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) notFound();

  return (
    <main className="min-h-screen bg-[#faf8f5] px-3 py-8 text-[#2e2b2b] sm:px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 border-b border-[#e8dedf] pb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f6d8a]">SICARÚ · Laboratorio privado · Solo Preview</p>
          <h1 className="mt-3 font-heading text-3xl sm:text-4xl">Más presencia. Menos página plana.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6">Compara dos composiciones con las mismas fotografías R3 reales. Solo cambian el encuadre, el espacio, el contraste y la jerarquía comercial. Ninguna tarjeta de esta página genera pedidos ni modifica Medusa.</p>
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
          <Link href="/qa/reparacion-shampoos" className="mt-3 inline-block text-xs font-semibold text-[#7f6d8a] underline">Diagnóstico anterior de fotografías (si está disponible en esta rama)</Link>
        </section>
      </div>
    </main>
  );
}
