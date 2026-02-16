import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";
import { getCategoryLabel } from "@/lib/blog";

type BlogCardProps = {
  post: BlogPostMeta;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image or gradient placeholder */}
      {post.image ? (
        <div className="relative h-44 overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-sicaru-purple-600 to-sicaru-pink" />
      )}

      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-sicaru-purple-100 px-2.5 py-0.5 text-xs font-medium text-sicaru-purple-700">
            {getCategoryLabel(post.category)}
          </span>
          <span className="text-xs text-gray-400">
            {post.readTime} min de lectura
          </span>
        </div>

        <h3 className="font-heading text-base font-bold leading-snug text-sicaru-purple-900 group-hover:text-sicaru-pink md:text-lg">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {post.excerpt}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString("es-MX", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-sm font-semibold text-sicaru-pink">
            Leer Más &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
