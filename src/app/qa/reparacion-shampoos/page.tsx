import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG_MODE } from "@/lib/catalog-mode";
import { ProductPhoto } from "@/components/products/ProductPhoto";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Revisión de reparación · Shampoos SICARÚ",
  robots: { index: false, follow: false },
};

type Candidate = {
  title: string;
  handle: string;
  original: string;
  prepared: string;
  notes: string;
};

const candidates: Candidate[] = [
  {
    title: "XIOMARA Shampoo Platinum 250 ml",
    handle: "xiomara-shampoo-platinum-250ml",
    original: "/images/products/xiomara-shampoo-platinum-250ml/01-principal.webp",
    prepared: "/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp",
    notes: "Mismo producto documentado, versión R3 transparente; asociación real en Medusa pendiente de verificar.",
  },
  {
    title: "XIOMARA Shampoo Platinum Libre de Sulfatos 250 ml",
    handle: "xiomara-shampoo-platinum-libre-sulfatos-250ml",
    original: "/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal.webp",
    prepared: "/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal-r3.webp",
    notes: "No confundir con Platinum regular. Tiene reverso R3 adicional disponible.",
  },
  {
    title: "NEKANE Morazul Shampoo Matizador 300 g",
    handle: "nekane-morazul-shampoo-matizador-300g",
    original: "/images/products/nekane-morazul-shampoo-matizador-300g/01-principal.webp",
    prepared: "/images/products/nekane-morazul-shampoo-matizador-300g/01-principal-r3.webp",
    notes: "Conservar presentación 300 g. Código de barras documental pendiente de conciliación.",
  },
];

function CompareImage({src, alt}: {src:string;alt:string}) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-[#FAF8F5]">
      <ProductPhoto src={src} alt={alt} />
    </div>
  );
}

export default function ShampoosRepairReview() {
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-8 text-[#2E2B2B] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 border-b border-[#e9e1dd] pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7F6D8A]">SICARÚ · Solo Preview / desarrollo</p>
          <h1 className="mt-3 font-heading text-3xl sm:text-4xl">Reparación de fotografías de shampoos</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6">
            Comparación de dos <strong>archivos del repositorio</strong> por producto: original y master R3.
            No son datos leídos hoy de Medusa. No cambian la ficha pública, el precio, las variantes ni la galería publicada.
          </p>
          <p className="mt-2 text-sm font-semibold text-[#7F6D8A]">
            La versión R3 es candidata visual, todavía no es una publicación ni una autorización para sustituir imágenes.
          </p>
        </header>

        <div className="space-y-12">
          {candidates.map((candidate) => (
            <section key={candidate.handle} aria-labelledby={candidate.handle} className="border-b border-[#e9e1dd] pb-8">
              <h2 id={candidate.handle} className="font-heading text-2xl">{candidate.title}</h2>
              <p className="mt-2 text-sm text-[#7F6D8A]">{candidate.notes}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-6 lg:max-w-4xl" data-testid={`compare-${candidate.handle}`}>
                <div className="min-w-0 rounded-xl border border-[#e9e1dd] p-2 sm:p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide">Original del repositorio</p>
                  <CompareImage src={candidate.original} alt={`Original · ${candidate.title}`} />
                </div>
                <div className="min-w-0 rounded-xl border border-[#9B89A8] p-2 sm:p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#7F6D8A]">Master R3 · candidato</p>
                  <CompareImage src={candidate.prepared} alt={`Master R3 · ${candidate.title}`} />
                </div>
              </div>
            </section>
          ))}

          <section className="rounded-xl border border-[#9B89A8] p-5" data-testid="montis-identity-review">
            <h2 className="font-heading text-2xl">MONTIS · identidad comercial a corregir</h2>
            <p className="mt-3 text-sm">Título observado en la web: <strong>Montis Shampoo Extracto Natural</strong>.</p>
            <p className="mt-2 text-sm">Título según Base Maestra (fila 580): <strong>Shampoo de Caballo Montis 650 ml</strong>.</p>
            <p className="mt-2 text-sm">ID maestro: <code>PRD-MONTIS-CABALLO-650</code>. La fotografía frontal y la correspondencia del registro en Medusa están <strong>pendientes de cotejo</strong>.</p>
            <div className="mt-4 flex aspect-[3/1] items-center justify-center rounded-lg bg-[#F5F1EB] p-5 text-center text-sm text-[#7F6D8A]">
              No se muestra fotografía hasta confirmar la botella exacta de 650 ml
            </div>
            <p className="mt-3 text-xs text-[#7F6D8A]">No trasladar automáticamente el precio de tienda a Medusa. No actualizar existencias.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
