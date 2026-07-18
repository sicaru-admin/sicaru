"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  quantity: number;
  onChange: (qty: number) => void;
};

export function QuantitySelector({ quantity, onChange }: QuantitySelectorProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-[#7f6d8a]">Cantidad</p>
      <div className="inline-flex items-center border border-[#efe7dd] bg-[#faf8f5]">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          aria-label="Reducir cantidad"
          className="flex h-11 w-11 items-center justify-center text-[#7f6d8a] transition-colors hover:bg-[#f5f1eb] disabled:text-[#9b89a8]/45 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8]"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-11 text-center text-sm font-semibold tabular-nums text-[#8e7a9e]">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(99, quantity + 1))}
          disabled={quantity >= 99}
          aria-label="Aumentar cantidad"
          className="flex h-11 w-11 items-center justify-center text-[#7f6d8a] transition-colors hover:bg-[#f5f1eb] disabled:text-[#9b89a8]/45 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8]"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
