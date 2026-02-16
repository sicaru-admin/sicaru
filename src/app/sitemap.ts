import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data/products";
import { getCollections } from "@/lib/data/collections";
import { getCategories } from "@/lib/data/categories";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sicaru.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marcas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/salon-pro`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const { products } = await getProducts({ limit: 500 });
    productPages = products.map((product) => ({
      url: `${baseUrl}/productos/${product.handle}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch {
    // Backend may not be available during build
  }

  let collectionPages: MetadataRoute.Sitemap = [];
  try {
    const { collections } = await getCollections({ limit: 100 });
    collectionPages = collections.map((collection) => ({
      url: `${baseUrl}/marcas/${collection.handle}`,
      lastModified: collection.updated_at ? new Date(collection.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Backend may not be available during build
  }

  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const { categories } = await getCategories({ limit: 100 });
    categoryPages = categories.map((category) => ({
      url: `${baseUrl}/categorias/${category.handle}`,
      lastModified: category.updated_at
        ? new Date(category.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Backend may not be available during build
  }

  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...collectionPages,
    ...categoryPages,
    ...blogPosts,
  ];
}
