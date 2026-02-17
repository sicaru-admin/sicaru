import type { Metadata } from "next";
import Image from "next/image";
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
    <>
    <section className="relative bg-gradient-to-br from-sicaru-purple-900 to-sicaru-purple-700 py-12 text-white overflow-hidden">
      <Image
        src="/images/salon-mezcla-tintes-profesional.jpg"
        alt="Vista cenital de mezclas de tintes profesionales de diferentes colores con brochas y herramientas de colorista"
        fill
        className="object-cover opacity-20"
        priority
        sizes="100vw"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">
          Blog de Belleza
        </h1>
        <p className="mt-3 text-white/80">
          Consejos, comparativas y guías de cuidado capilar profesional.
        </p>
      </div>
    </section>
    <div className="mx-auto max-w-7xl px-4 py-12">

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
    </>
  );
}
