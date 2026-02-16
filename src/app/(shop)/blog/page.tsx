import type { Metadata } from "next";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryTabs } from "@/components/blog/CategoryTabs";

export const metadata: Metadata = {
  title: "Blog de Belleza Profesional",
  description:
    "Consejos, comparativas y guías de cuidado capilar profesional. Tips de expertos para salón y uso personal con productos mexicanos.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 font-heading text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Blog de Belleza
      </h1>
      <p className="mb-8 text-gray-500">
        Consejos, comparativas y guías de cuidado capilar profesional.
      </p>

      <CategoryTabs
        categories={categories}
        totalCount={posts.length}
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
            Próximamente: consejos y tendencias de belleza profesional.
          </p>
        </div>
      )}
    </div>
  );
}
