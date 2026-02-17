type PremiumSkeletonProps = {
  className?: string;
};

export function PremiumSkeleton({ className = "" }: PremiumSkeletonProps) {
  return <div className={`premium-shimmer rounded ${className}`} />;
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="aspect-square premium-shimmer" />
          <div className="p-3 space-y-2">
            <div className="h-4 w-3/4 premium-shimmer rounded" />
            <div className="h-4 w-1/2 premium-shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
