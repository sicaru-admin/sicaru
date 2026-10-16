import { Eye } from "lucide-react";

type ViewerCounterProps = {
  count?: number;
};

export function ViewerCounter({ count }: ViewerCounterProps = {}) {
  // Show a count only when a real source supplies one.
  if (count == null || !Number.isSafeInteger(count) || count <= 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      <Eye className="h-3.5 w-3.5 text-sicaru-purple-400" />
      <span>
        <span className="font-semibold text-sicaru-purple-700">{count}</span>{" "}
        {count === 1 ? "persona viendo este producto" : "personas viendo este producto"}
      </span>
    </div>
  );
}
