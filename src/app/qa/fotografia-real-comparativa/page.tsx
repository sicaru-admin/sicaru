import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowRight, Camera, Images } from "lucide-react";
import { CATALOG_MODE } from "@/lib/catalog-mode";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "SICARÚ · Comparativa de fotografía real — estudio A/B/C",
  robots: { index: false, follow: false },
};

const photos = {
  color: "/images/products-hero/voglia-color-fun.webp",
  care: "/images/products-hero/voglia-total-repair.webp",
  pro: "/images/products-hero/navaja-profesional.webp",
  vitale: "/images/products-hero/vitale-bifase-pro-keratin.webp",
  xiomara: "/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp",
};
const destinations = {
  color: "/categorias/color-y-tintes",
  care: "/categorias/tratamientos-y-mascarillas",
  pro: "/categorias/herramientas-pro",
};

function Product({src,alt,sizes,styleName=""}:{src:string;alt:string;sizes?:string;styleName?:string}) {
 return <Image src={src} alt={alt} fill sizes={sizes ?? "(max-width: 767px) 80vw, 30vw"} className={`object-contain ${styleName}`} />;
}

function Heading({variant,title,detail}:{variant:string;title:string;detail:string}) {
 return <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
   <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7F6D8A]">{variant} · Estudio sin aprobación</p>
   <h2 className="mt-2 text-2xl font-bold tracking-[-0.045em] text-[#2E2B2B] sm:text-3xl">{title}</h2></div>
   <p className="max-w-[42ch] text-sm leading-6 text-[#2E2B2B]/75">{detail}</p>
 </div>;
}

export default function RealPhotosDirectionStudy() {
 if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) notFound();
 return <>
 <Navbar />
 <main className="min-h-screen bg-[#FAF8F5] text-[#2E2B2B]">
  <div className="border-b border-[#8E7A9E]/20 bg-[#F5F1EB] px-4 py-2 text-center text-xs font-semibold text-[#7F6D8A]">LABORATORIO DE DIRECCIÓN DE ARTE · TRES RUTAS CON FOTOS REALES · NO APROBADO</div>
  <header className="mx-auto max-w-[1400px] px-4 pb-7 pt-10 sm:px-8 sm:pb-12 sm:pt-14">
   <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7F6D8A]">SICARÚ · Identidad y conversión</p>
   <h1 className="mt-3 max-w-[18ch] text-[clamp(2.3rem,5.1vw,4.9rem)] font-bold leading-[1.02] tracking-[-0.065em]">El producto debe tener presencia.</h1>
   <p className="mt-4 max-w-[74ch] text-sm leading-6 sm:text-base">Tres maneras de presentar productos auténticos sin inventar envases. Comparamos escala, jerarquía, color y categorías. Las imágenes no están alteradas y la propuesta no está aprobada para producción.</p>
  </header>

  <div className="mx-auto max-w-[1400px] space-y-14 px-4 pb-16 sm:space-y-20 sm:px-8">
   <section aria-labelledby="board-a">
    <Heading variant="A" title="Campaña de producto" detail="Un solo producto con mayor peso visual, mensaje claro y fotografía auténtica. Sin nubes ni filtros alrededor del envase." />
    <div className="grid min-h-[460px] overflow-hidden rounded-[22px] bg-[#7F6D8A] text-[#FAF8F5] md:grid-cols-[0.90fr_1.10fr]">
     <div className="flex flex-col justify-center px-6 py-10 sm:px-10">
      <span className="text-xs font-bold uppercase tracking-[0.16em]">SICARÚ · Belleza profesional</span>
      <h3 id="board-a" className="mt-5 text-[clamp(2.6rem,5vw,4.9rem)] font-bold leading-[0.96] tracking-[-0.07em]">Que se note tu estilo.</h3>
      <p className="mt-5 max-w-[31ch] text-sm leading-6">Explora coloración y productos profesionales para crear tu propia rutina.</p>
      <Link href={destinations.color} className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#FAF8F5] px-5 py-3 text-sm font-semibold text-[#2E2B2B]">Explorar coloración <ArrowUpRight size={17} aria-hidden="true" /></Link>
     </div>
     <div className="relative min-h-[340px] bg-[#8E7A9E] sm:min-h-[470px]">
       <div className="absolute inset-[3%] border border-[#FAF8F5]/15" aria-hidden="true" />
       <Product src={photos.color} alt="Fotografía real de Voglia Color Fun" sizes="(max-width: 767px) 90vw, 42vw" styleName="p-4 sm:p-3" />
     </div>
    </div>
    <p className="mt-3 text-xs text-[#7F6D8A]">Ventaja: el producto domina. Riesgo: no expresa todo el universo de SICARÚ por sí solo.</p>
   </section>

   <section aria-labelledby="board-b">
    <Heading variant="B" title="Universos profesionales" detail="Tres categorías con composiciones distintas: tonalidad intensa, tratamiento y herramienta. Fotografía clara, sin banda negra inferior."/>
    <h3 id="board-b" className="sr-only">Tres universos de SICARÚ</h3>
    <div className="grid gap-4 lg:grid-cols-[1.12fr_1fr_1fr]">
      <Link href={destinations.color} className="group relative flex min-h-[430px] flex-col overflow-hidden rounded-[20px] bg-[#7F6D8A] text-[#FAF8F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E2B2B]">
       <div className="flex items-center justify-between p-6 text-xs font-bold uppercase tracking-[0.12em]"><span>01 · Coloración</span><ArrowUpRight size={18}/></div>
       <div className="relative min-h-[290px] flex-1"><Product src={photos.color} alt="Voglia Color Fun, fotografía auténtica" styleName="p-1" /></div>
       <div className="p-6"><strong className="text-3xl leading-tight tracking-[-0.05em]">Encuentra tu color.</strong><p className="mt-2 text-sm">Ver coloración y tintes</p></div>
      </Link>
      <Link href={destinations.care} className="group relative flex min-h-[430px] flex-col overflow-hidden rounded-[20px] border border-[#8E7A9E]/20 bg-[#F5F1EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A]">
       <div className="p-6 text-xs font-bold uppercase tracking-[0.12em] text-[#7F6D8A]">02 · Cuidado capilar</div>
       <div className="relative min-h-[290px] flex-1"><Product src={photos.care} alt="Voglia Total Repair, fotografía auténtica" styleName="p-1"/></div>
       <div className="flex items-end justify-between gap-2 p-6"><div><strong className="text-2xl leading-tight tracking-[-0.05em]">Tu rutina, tu cuidado.</strong><p className="mt-2 text-sm">Explorar tratamientos</p></div><ArrowUpRight size={20}/></div>
      </Link>
      <Link href={destinations.pro} className="group relative flex min-h-[430px] flex-col overflow-hidden rounded-[20px] bg-[#9B89A8] text-[#2E2B2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A]">
       <div className="flex items-center justify-between p-6 text-xs font-bold uppercase tracking-[0.12em]"><span>03 · Para profesionales</span><ArrowUpRight size={18}/></div>
       <div className="relative min-h-[290px] flex-1"><Product src={photos.pro} alt="Navaja profesional para barbería, fotografía auténtica" styleName="p-2"/></div>
       <div className="p-6"><strong className="text-2xl leading-tight tracking-[-0.05em]">Herramientas para tu trabajo.</strong><p className="mt-2 text-sm">Explorar herramientas</p></div>
      </Link>
    </div>
    <p className="mt-3 text-xs text-[#7F6D8A]">Ventaja: las categorías se reconocen por producto y necesidad. Pendiente: fotografías de contexto con cabello, textura y profesionales reales.</p>
   </section>

   <section aria-labelledby="board-c">
    <Heading variant="C" title="Descubrimiento comercial" detail="Composición asimétrica de tienda: una categoría protagonista y accesos secundarios, todos con productos reales."/>
    <h3 id="board-c" className="sr-only">Descubrimiento comercial SICARÚ</h3>
    <div className="grid gap-3 lg:grid-cols-[1.18fr_0.82fr]">
     <Link href={destinations.care} className="group relative flex min-h-[470px] flex-col overflow-hidden rounded-[20px] bg-[#F5F1EB] sm:min-h-[550px]">
      <div className="relative z-10 max-w-[65%] p-7 sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7F6D8A]">Cuidado capilar</p><p className="mt-4 text-[clamp(2.3rem,4.5vw,4rem)] font-bold leading-[0.98] tracking-[-0.07em]">Cuida lo que te hace única.</p><span className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#7F6D8A] px-5 text-sm font-semibold text-white">Descubrir tratamientos <ArrowUpRight size={16}/></span></div>
      <div className="absolute bottom-[-3%] right-[-8%] h-[70%] w-[75%] sm:h-[89%] sm:w-[62%]"><Product src={photos.care} alt="Voglia Total Repair, producto real" styleName="p-1"/></div>
     </Link>
     <div className="grid gap-3">
      <Link href={destinations.color} className="group flex min-h-[220px] overflow-hidden rounded-[20px] bg-[#8E7A9E] text-[#FAF8F5] sm:min-h-[260px]"><div className="z-10 flex w-[55%] flex-col justify-between p-6"><p className="text-xs font-bold uppercase tracking-[0.12em]">Coloración</p><p className="text-2xl font-bold tracking-[-0.05em]">Descubre tu tono.</p><ArrowRight size={20}/></div><div className="relative w-[45%]"><Product src={photos.color} alt="Voglia Color Fun, producto real" styleName="p-1" /></div></Link>
      <Link href={destinations.pro} className="group flex min-h-[220px] overflow-hidden rounded-[20px] bg-[#2E2B2B] text-[#FAF8F5] sm:min-h-[260px]"><div className="z-10 flex w-[55%] flex-col justify-between p-6"><p className="text-xs font-bold uppercase tracking-[0.12em]">Profesionales</p><p className="text-2xl font-bold tracking-[-0.05em]">Equipa tu trabajo.</p><ArrowRight size={20}/></div><div className="relative w-[45%]"><Product src={photos.pro} alt="Navaja profesional para barbería, producto real" styleName="p-1"/></div></Link>
     </div>
    </div>
    <p className="mt-3 text-xs text-[#7F6D8A]">Ventaja: ritmo de tienda y jerarquía asimétrica. Riesgo: debemos vigilar la legibilidad y escala en móvil.</p>
   </section>

   <section aria-labelledby="assets-title" className="rounded-[20px] border border-[#8E7A9E]/25 bg-[#F5F1EB] p-6 sm:p-9">
    <div className="flex flex-wrap items-center gap-3"><Images size={22} color="#7F6D8A"/><h2 id="assets-title" className="text-xl font-bold tracking-[-0.04em]">Activos auténticos verificados en GitHub</h2></div>
    <p className="mt-3 max-w-[74ch] text-sm leading-6">Los cinco archivos siguientes existen en el repositorio. Son imágenes de producto; no equivalen por sí solos a una fotografía de campaña con contexto, personas o texturas. Su identificación comercial debe validarse antes de llevar esta prueba a producción.</p>
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
      {[
        {src:photos.color,name:"Voglia Color Fun"},
        {src:photos.care,name:"Voglia Total Repair"},
        {src:photos.vitale,name:"Vitale Bifase Pro-Keratin"},
        {src:photos.pro,name:"Navaja profesional"},
        {src:photos.xiomara,name:"XIOMARA Platinum 250 ml"},
      ].map(p=><div key={p.name} className="rounded-xl bg-[#FAF8F5] p-2"><div className="relative aspect-square"><Product src={p.src} alt={p.name} sizes="(max-width: 639px) 45vw, 20vw" styleName="p-2"/></div><p className="px-1 pb-2 text-center text-xs font-semibold">{p.name}</p></div>)}
    </div>
   </section>

   <div className="border-t border-[#8E7A9E]/20 pt-6 text-sm text-[#2E2B2B]/75"><Camera size={18} className="mr-2 inline" aria-hidden="true"/>Esto es un laboratorio fotográfico de composición, no una propuesta para producción. No hay modelos ni empaques generados, ni cambios a catálogo, pagos, precios o inventario.</div>
  </div>
 </main>
 <Footer />
 </>;
}
