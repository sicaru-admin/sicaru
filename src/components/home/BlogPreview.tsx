import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { getCategoryLabel } from "@/lib/blog";

export function BlogPreview() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
          Blog — Consejos de Cuidado Capilar
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image or gradient placeholder */}
              {post.image ? (
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="h-44 bg-gradient-to-br from-sicaru-purple-600 to-sicaru-pink" />
              )}

              <div className="p-5">
                <div className="mb-2">
                  <span className="rounded-full bg-sicaru-purple-100 px-2.5 py-0.5 text-xs font-medium text-sicaru-purple-700">
                    {getCategoryLabel(post.category)}
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold leading-snug text-sicaru-purple-900 group-hover:text-sicaru-pink md:text-lg">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {post.excerpt}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-sicaru-pink">
                  Leer M&aacute;s &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-block rounded-full border-2 border-sicaru-purple-700 px-6 py-2 text-sm font-bold text-sicaru-purple-700 transition-colors hover:bg-sicaru-purple-700 hover:text-white"
          >
            Ver Todos los Artículos
          </Link>
        </div>
      </div>
    </section>
  );
}
