import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
  extractHeadings,
} from "@/lib/blog";
import { generateBlogPostSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { mdxComponents } from "@/components/blog/mdx";
import { MessageCircle } from "lucide-react";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const relatedPosts = getPostsByCategory(post.category)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const blogSchema = generateBlogPostSchema({
    title: post.title,
    slug: post.slug,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    authorName: post.author,
    image: post.image,
  });

  return (
    <>
      <JsonLd schema={blogSchema} />

      <article className="mx-auto max-w-7xl px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <BlogHeader post={post} />

          {/* Featured image */}
          {post.image && (
            <div className="mb-8 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Content area with ToC sidebar */}
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
          <TableOfContents headings={headings} />

          <div className="mx-auto max-w-3xl">
            {/* MDX Content with prose styling */}
            <div className="prose prose-gray max-w-none prose-headings:font-heading prose-headings:text-sicaru-purple-900 prose-p:leading-relaxed prose-p:text-gray-600 prose-strong:text-sicaru-purple-900 prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:text-gray-600">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
              />
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-10 rounded-xl bg-gradient-to-r from-sicaru-purple-700 to-sicaru-purple-900 p-6 text-white">
              <div className="flex items-center gap-4">
                <MessageCircle className="h-10 w-10 flex-shrink-0" />
                <div>
                  <h3 className="font-heading text-lg font-bold">
                    ¿Tienes preguntas sobre este tema?
                  </h3>
                  <p className="mt-1 text-sm text-sicaru-purple-200">
                    Nuestro equipo de expertos está listo para ayudarte.
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/528281111023"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full bg-white px-6 py-2 text-sm font-bold text-sicaru-purple-700 transition-colors hover:bg-sicaru-purple-50"
              >
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Related posts */}
        <div className="mx-auto max-w-4xl">
          <RelatedPosts posts={relatedPosts} />
        </div>
      </article>
    </>
  );
}
