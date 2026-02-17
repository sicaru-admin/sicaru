import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type BlogCategory =
  | "comparativas"
  | "guias"
  | "tendencias"
  | "salon-pro";

export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  category: BlogCategory;
  tags: string[];
  featuredBrands: string[];
  image: string;
  imageAlt: string;
  readTime: number;
};

export type BlogPost = BlogPostMeta & { content: string };

const BLOG_DIR = path.join(process.cwd(), "content/blog");

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  comparativas: "Comparativas",
  guias: "Guías",
  tendencias: "Tendencias",
  "salon-pro": "Salón Pro",
};

export function getCategoryLabel(category: BlogCategory): string {
  return CATEGORY_LABELS[category] || category;
}

function parseMdxFile(filePath: string): BlogPost | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const slug =
      data.slug || path.basename(filePath, ".mdx");
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      slug,
      title: data.title || "",
      excerpt: data.excerpt || "",
      publishedAt: data.publishedAt || "",
      updatedAt: data.updatedAt || data.publishedAt || "",
      author: data.author || "Equipo Sicarú",
      category: data.category || "guias",
      tags: data.tags || [],
      featuredBrands: data.featuredBrands || [],
      image: data.image || "",
      imageAlt: data.imageAlt || "",
      readTime,
      content,
    };
  } catch {
    return null;
  }
}

function getMdxFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(BLOG_DIR, f));
}

export function getAllPosts(): BlogPostMeta[] {
  return getMdxFiles()
    .map(parseMdxFile)
    .filter((p): p is BlogPost => p !== null)
    .map(({ content: _, ...meta }) => meta)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseMdxFile(filePath);
}

export function getPostsByCategory(category: BlogCategory): BlogPostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  const lower = tag.toLowerCase();
  return getAllPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === lower)
  );
}

export function getAllCategories(): { category: BlogCategory; label: string; count: number }[] {
  const posts = getAllPosts();
  const categories: BlogCategory[] = [
    "comparativas",
    "guias",
    "tendencias",
    "salon-pro",
  ];
  return categories
    .map((category) => ({
      category,
      label: getCategoryLabel(category),
      count: posts.filter((p) => p.category === category).length,
    }))
    .filter((c) => c.count > 0);
}

export function extractHeadings(
  content: string
): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    headings.push({ id, text, level });
  }

  return headings;
}
