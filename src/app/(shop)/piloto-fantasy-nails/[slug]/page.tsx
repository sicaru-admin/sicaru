import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fantasyPilotProducts,
  findFantasyPilotProduct,
  fantasyInquiryHref,
} from "@/lib/fantasy-pilot";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return fantasyPilotProducts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findFantasyPilotProduct(slug);
  if (!product) return { title: "Producto no encontrado", robots: { index: false, follow: false } };

  return {
    title: `${product.title} · Vista previa SICARÚ`,
    description: product.shortDescription,
    // La revisión no equivale a publicar una ficha comercial ni a verificar stock.
    robots: { index: false, follow: false },
  };
}

export default async function FantasyPilotPage({ params }: PageProps) {
  const { slug } = await params;
  const product = findFantasyPilotProduct(slug);
  if (!product) notFound();

  const whatsappHref = fantasyInquiryHref(product);

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#2E2B2B]">
      <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 lg:px-10">
        <Link href="/piloto-unas-profesionales" className="text-sm font-semibold text-[#7F6D8A] underline underline-offset-4">
          Volver a Uñas profesionales
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#7F6D8A]">
          SICARÚ · Piloto Fantasy Nails · Vista previa interna
        </p>
        <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-[#EFE7DD] bg-[#FAF8F5] shadow-[0_8px_30px_rgba(46,43,43,0.06)]">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                unoptimized
                preload
              />
            ) : (
              <p className="max-w-xs px-8 text-center text-sm leading-6 text-[#7F6D8A]">
                Fotografía original en preparación. No sustituir por imágenes generadas.
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8E7A9E]">
              Fantasy Nails · SKU {product.sku}
            </p>
            <h1 className="mt-3 font-heading text-3xl font-medium leading-tight md:text-4xl">
              {product.title}
            </h1>
            <p className="mt-5 text-sm leading-7 text-[#2E2B2B]/80">
              {product.shortDescription}
            </p>
            <p className="mt-6 text-2xl font-semibold text-[#7F6D8A]">
              {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(product.approvedPublicPrice)}
            </p>
            <p className="mt-1 text-xs text-[#7F6D8A]">
              Precio público aprobado · Confirmar precio aplicado en caja.
            </p>
            <p className="mt-4 text-sm font-medium text-[#7F6D8A]">
              Disponibilidad por confirmar.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-12 items-center justify-center bg-[#7F6D8A] px-7 py-3 text-sm font-semibold text-[#FAF8F5] transition-colors hover:bg-[#8E7A9E]"
            >
              Consultar por WhatsApp
            </a>
            <p className="mt-5 text-xs leading-5 text-[#2E2B2B]/60">
              Ficha preliminar no habilitada para pagos, reservas ni compras en línea.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
