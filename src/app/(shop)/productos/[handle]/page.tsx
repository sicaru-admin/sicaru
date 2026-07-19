import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProductByHandle, getProducts } from "@/lib/data/products";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateProductFAQs,
} from "@/lib/schema";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const { products } = await getProducts();
    return products.map((product) => ({
      handle: product.handle,
    }));
  } catch {
    // Backend may not be available during build (e.g. Vercel)
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  try {
    const { handle } = await params;
    const product = await getProductByHandle(handle);

    if (!product) {
      return { title: "Producto no encontrado" };
    }

    const price = product.variants?.[0]?.calculated_price;
    const priceStr =
      price?.calculated_amount != null
        ? new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: price.currency_code || "MXN",
          }).format(price.calculated_amount)
        : undefined;

    const description =
      product.description ||
      `Compra ${product.title} en Distribuidora Sicarú`;

    return {
      title: product.title,
      description,
      openGraph: {
        title: `${product.title}${priceStr ? ` — ${priceStr}` : ""}`,
        description,
        images: product.thumbnail ? [{ url: product.thumbnail }] : undefined,
      },
      other: {
        "product:price:amount":
          price?.calculated_amount?.toString() ?? "",
        "product:price:currency": price?.currency_code || "MXN",
      },
    };
  } catch {
    return { title: "Producto — Distribuidora Sicarú" };
  }
}

function RelatedSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="mb-5 h-7 w-56 animate-pulse bg-[#efe7dd] md:mb-6" />
      <div className="-mx-5 overflow-hidden px-5 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:px-0 lg:grid-cols-4">
        <div className="flex gap-4 md:contents">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[78vw] max-w-[320px] flex-none overflow-hidden border border-[#efe7dd] bg-[#faf8f5] md:w-auto md:max-w-none md:flex-auto"
            >
              <div className="aspect-[4/3] animate-pulse bg-[#f5f1eb]" />
              <div className="p-4">
                <div className="h-4 w-3/4 animate-pulse bg-[#efe7dd]" />
                <div className="mt-2 h-4 w-1/2 animate-pulse bg-[#efe7dd]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  // Build image array from product images
  const images = (product.images ?? [])
    .filter((img) => !!img.url)
    .map((img) => ({ id: img.id, url: img.url as string }));

  // Fall back to thumbnail if no images
  if (images.length === 0 && product.thumbnail) {
    images.push({ id: "thumb", url: product.thumbnail });
  }

  const brandName = product.collection?.title;
  const collectionId = product.collection?.id;

  // JSON-LD structured data
  const productSchema = generateProductSchema(product);
  const breadcrumbItems = [
    { name: "Inicio", url: "/" },
    ...(brandName && product.collection?.handle
      ? [{ name: brandName, url: `/marcas/${product.collection.handle}` }]
      : []),
    { name: product.title ?? "", url: `/productos/${product.handle}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const faqSchema = generateFAQSchema(generateProductFAQs(product));

  return (
    <>
      <JsonLd schema={[productSchema, breadcrumbSchema, faqSchema]} />

      <div className="bg-[#faf8f5]">
      <div className="mx-auto max-w-[1400px] px-5 py-5 sm:px-8 md:py-8 lg:px-10 lg:py-9">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex min-w-0 items-center gap-1.5 text-xs text-[#7f6d8a] md:mb-7 md:text-sm"
        >
          <Link
            href="/"
            className="shrink-0 transition-colors hover:text-[#8e7a9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8]"
          >
            Inicio
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          {brandName && (
            <>
              <Link
                href={`/marcas/${product.collection?.handle || ""}`}
                className="truncate transition-colors hover:text-[#8e7a9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8]"
              >
                {brandName}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            </>
          )}
          <span className="truncate font-medium text-[#8e7a9e]">
            {product.title}
          </span>
        </nav>

        {/* Product grid */}
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.28fr)_minmax(360px,1fr)] lg:items-center lg:gap-10 xl:gap-12">
          {/* Left: Image gallery */}
          <div className="min-w-0">
            <ImageGallery images={images} title={product.title || ""} />
          </div>

          {/* Right: Product info */}
          <div className="min-w-0 border-t border-[#efe7dd] pt-6 lg:max-w-[520px] lg:border-t-0 lg:pt-0">
            {/* Brand badge */}
            {brandName && (
              <Link
                href={`/marcas/${product.collection?.handle || ""}`}
                className="mb-4 inline-flex min-h-9 items-center border border-[#efe7dd] bg-[#f5f1eb] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#7f6d8a] transition-colors hover:border-[#9b89a8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8]"
              >
                {brandName}
              </Link>
            )}

            {/* Title */}
            <h1 className="font-heading text-3xl font-medium leading-tight text-[#2E2B2B] md:text-4xl">
              {product.title}
            </h1>

            {/* Actions (price, variants, quantity, buttons, trust) */}
            <div className="mt-6 md:mt-8">
              <ProductActions product={product} />
            </div>
          </div>
        </div>

        {/* Below fold */}
        <div className="mt-8 space-y-10 md:mt-12 md:space-y-12 lg:mt-12 lg:space-y-12">
          {/* Tabs */}
          <ProductTabs
            description={product.description ?? null}
            material={product.material ?? null}
          />

          {/* Cross-sell: same brand */}
          {collectionId && (
            <Suspense fallback={<RelatedSkeleton />}>
              <RelatedProducts
                title="Completa Tu Rutina"
                collectionId={collectionId}
                excludeProductId={product.id}
                limit={4}
              />
            </Suspense>
          )}

          {/* Cross-sell: general without duplicating the same brand */}
          <Suspense fallback={<RelatedSkeleton />}>
            <RelatedProducts
              title="También Te Puede Gustar"
              excludeProductId={product.id}
              excludeCollectionId={collectionId}
              limit={4}
            />
          </Suspense>
        </div>
      </div>
      </div>
    </>
  );
}
