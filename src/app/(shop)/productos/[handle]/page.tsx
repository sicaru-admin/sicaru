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
import { ViewerCounter } from "@/components/ui/ViewerCounter";
import { StarRating } from "@/components/ui/StarRating";
import { StickyAddToCart } from "@/components/product/StickyAddToCart";
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
}

function RelatedSkeleton() {
  return (
    <div>
      <div className="mb-6 h-7 w-56 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="aspect-square animate-pulse bg-gray-200" />
            <div className="p-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
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

      <div className="mx-auto max-w-7xl px-4 py-6 md:py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1 text-sm text-gray-500"
        >
          <Link href="/" className="hover:text-sicaru-purple-600">
            Inicio
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {brandName && (
            <>
              <Link
                href={`/marcas/${product.collection?.handle || ""}`}
                className="hover:text-sicaru-purple-600"
              >
                {brandName}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="truncate text-sicaru-purple-900 font-medium">
            {product.title}
          </span>
        </nav>

        {/* Product grid — 60/40 split */}
        <div className="grid gap-8 md:grid-cols-5 lg:gap-12">
          {/* Left: Image gallery (3/5 = 60%) */}
          <div className="md:col-span-3">
            <ImageGallery images={images} title={product.title || ""} />
          </div>

          {/* Right: Product info (2/5 = 40%) */}
          <div className="md:col-span-2">
            {/* Brand badge */}
            {brandName && (
              <Link
                href={`/marcas/${product.collection?.handle || ""}`}
                className="mb-3 inline-block rounded-full bg-sicaru-purple-100 px-3 py-1 text-xs font-semibold text-sicaru-purple-700 transition-colors hover:bg-sicaru-purple-200"
              >
                {brandName}
              </Link>
            )}

            {/* Title */}
            <h1 className="font-heading text-2xl font-bold text-sicaru-purple-900 md:text-3xl">
              {product.title}
            </h1>

            {/* Star Rating & Viewer Counter */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <StarRating />
              <ViewerCounter />
            </div>

            {/* Short description */}
            {product.description && (
              <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                {product.description}
              </p>
            )}

            {/* Actions (price, variants, quantity, buttons, trust) */}
            <div className="mt-6">
              <ProductActions product={product} />
            </div>
          </div>
        </div>

        {/* Below fold */}
        <div className="mt-12 space-y-12 md:mt-16">
          {/* Tabs */}
          <ProductTabs
            description={product.description ?? null}
            material={product.material ?? null}
          />

          {/* Cross-sell: same brand */}
          <Suspense fallback={<RelatedSkeleton />}>
            <RelatedProducts
              title="Completa Tu Rutina"
              collectionId={collectionId}
              excludeProductId={product.id}
              limit={4}
            />
          </Suspense>

          {/* Cross-sell: same category / general */}
          <Suspense fallback={<RelatedSkeleton />}>
            <RelatedProducts
              title="También Te Puede Gustar"
              excludeProductId={product.id}
              limit={4}
            />
          </Suspense>
        </div>
      </div>

      <StickyAddToCart product={product} />
    </>
  );
}
