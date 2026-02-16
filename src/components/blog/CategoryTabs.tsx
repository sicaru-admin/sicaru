import Link from "next/link";
import type { BlogCategory } from "@/lib/blog";
import { getCategoryLabel } from "@/lib/blog";

type CategoryTabsProps = {
  categories: { category: BlogCategory; label: string; count: number }[];
  activeCategory?: BlogCategory;
  totalCount: number;
};

export function CategoryTabs({
  categories,
  activeCategory,
  totalCount,
}: CategoryTabsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          !activeCategory
            ? "bg-sicaru-purple-700 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-sicaru-purple-100 hover:text-sicaru-purple-700"
        }`}
      >
        Todas ({totalCount})
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.category}
          href={`/blog/categoria/${cat.category}`}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === cat.category
              ? "bg-sicaru-purple-700 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-sicaru-purple-100 hover:text-sicaru-purple-700"
          }`}
        >
          {getCategoryLabel(cat.category)} ({cat.count})
        </Link>
      ))}
    </div>
  );
}
