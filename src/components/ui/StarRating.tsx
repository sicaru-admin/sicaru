import { Star, BadgeCheck } from "lucide-react";

type StarRatingProps = {
  rating?: number;
  showBadge?: boolean;
};

export function StarRating({ rating = 4.8, showBadge = true }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars
                ? "fill-sicaru-gold text-sicaru-gold"
                : i === fullStars && hasHalf
                  ? "fill-sicaru-gold/50 text-sicaru-gold"
                  : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-semibold text-sicaru-purple-900">
          {rating}
        </span>
      </div>
      {showBadge && (
        <span className="inline-flex items-center gap-1 rounded-full bg-sicaru-purple-50 px-2 py-0.5 text-[10px] font-semibold text-sicaru-purple-700">
          <BadgeCheck className="h-3 w-3" />
          Distribuidor Verificado
        </span>
      )}
    </div>
  );
}
