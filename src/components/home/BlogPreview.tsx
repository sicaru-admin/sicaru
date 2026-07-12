import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { getCategoryLabel } from "@/lib/blog";
import { ArrowRight } from "lucide-react";

export function BlogPreview() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section className="bg-[#faf8f5] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="sicaru-eyebrow">08 · Contenido educativo</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-[#2e2b2b] md:text-4xl">
              Guías para cuidar mejor tu cabello
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7f6d8a] transition-colors hover:text-[#2e2b2b]"
          >
            Ver guías
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden border border-[#efe7dd] bg-white transition-colors hover:border-[#9b89a8]"
            >
              {post.image ? (
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                </div>
              ) : (
                <div className="h-44 bg-[#efe7dd]" />
              )}

              <div className="p-5">
                <div className="mb-2">
                  <span className="bg-[#f5f1eb] px-2.5 py-0.5 text-xs font-medium text-[#7f6d8a]">
                    {getCategoryLabel(post.category)}
                  </span>
                </div>
                <h3 className="font-heading text-base font-semibold leading-snug text-[#2e2b2b] group-hover:text-[#7f6d8a] md:text-lg">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#2e2b2b]/60">
                  {post.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#7f6d8a]">
                  Leer más
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
