import type { BlogPostMeta } from "@/lib/blog";
import { BlogCard } from "./BlogCard";

type RelatedPostsProps = {
  posts: BlogPostMeta[];
};

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-10">
      <h2 className="mb-6 font-heading text-2xl font-bold text-sicaru-purple-900">
        Artículos Relacionados
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
