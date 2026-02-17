"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

export function ViewerCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(Math.floor(Math.random() * 13) + 3);
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(3, Math.min(15, prev + delta));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      <Eye className="h-3.5 w-3.5 text-sicaru-purple-400" />
      <span>
        <span className="font-semibold text-sicaru-purple-700">{count}</span>{" "}
        personas viendo este producto
      </span>
    </div>
  );
}
