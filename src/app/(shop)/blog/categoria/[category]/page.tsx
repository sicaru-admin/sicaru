import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCategories,
  getAllPosts,
  getPostsByCategory,
  getCategoryLabel,
  type BlogCategory,
} from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryTabs } from "@/components/blog/CategoryTabs";

const VALID_CATEGORIES: BlogCategory[] = [
  "comparativas",
  "guias",
  "tendencias",
  "salon-pro",
];

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as BlogCategory)) return {};

  const label = getCategoryLabel(category as BlogCategory);
  return {
    title: `${label} — Blog de Belleza`,
    description: `Artículos sobre ${label.toLowerCase()} de productos capilares profesionales. Consejos de expertos para tu cabello.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as BlogCategory)) {
    notFound();
  }

  const typedCategory = category as BlogCategory;
  const posts = getPostsByCategory(typedCategory);
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const label = getCategoryLabel(typedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 font-heading text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        {label}
      </h1>
      <p className="mb-8 text-gray-500">
        Artículos sobre {label.toLowerCase()} de productos capilares
        profesionales.
      </p>

      <CategoryTabs
        categories={categories}
        activeCategory={typedCategory}
        totalCount={allPosts.length}
      />

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-lg text-gray-600">
            Aún no hay artículos en esta categoría.
          </p>
        </div>
      )}
    </div>
  );
}
