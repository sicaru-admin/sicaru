import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";
import { getCategoryLabel } from "@/lib/blog";
import { Calendar, Clock, User } from "lucide-react";

type BlogHeaderProps = {
  post: BlogPostMeta;
};

export function BlogHeader({ post }: BlogHeaderProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="mb-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-400">
        <Link href="/blog" className="hover:text-sicaru-pink">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/blog/categoria/${post.category}`}
          className="hover:text-sicaru-pink"
        >
          {getCategoryLabel(post.category)}
        </Link>
      </nav>

      {/* Category badge + read time */}
      <div className="mb-3 flex items-center gap-3">
        <Link
          href={`/blog/categoria/${post.category}`}
          className="rounded-full bg-sicaru-purple-100 px-3 py-1 text-xs font-semibold text-sicaru-purple-700 hover:bg-sicaru-purple-200"
        >
          {getCategoryLabel(post.category)}
        </Link>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          {post.readTime} min de lectura
        </span>
      </div>

      {/* Title */}
      <h1 className="font-heading text-3xl font-bold leading-tight text-sicaru-purple-900 md:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      {/* Author + date */}
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          {post.author}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {formattedDate}
        </span>
      </div>
    </header>
  );
}
