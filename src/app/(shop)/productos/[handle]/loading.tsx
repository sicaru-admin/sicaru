export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-12">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid gap-8 md:grid-cols-5 lg:gap-12">
        {/* Image */}
        <div className="md:col-span-3">
          <div className="aspect-square w-full animate-pulse rounded-xl bg-gray-200" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
          <div className="flex gap-2">
            <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
            <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
          </div>
          <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-14 w-full animate-pulse rounded-full bg-gray-200" />
          <div className="h-14 w-full animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
