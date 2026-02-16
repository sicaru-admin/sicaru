"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  quantity: number;
  onChange: (qty: number) => void;
};

export function QuantitySelector({ quantity, onChange }: QuantitySelectorProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">Cantidad</p>
      <div className="inline-flex items-center rounded-full border border-gray-200">
        <button
          onClick={() => onChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          aria-label="Reducir cantidad"
          className="flex h-10 w-10 items-center justify-center rounded-l-full text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-sm font-semibold tabular-nums">
          {quantity}
        </span>
        <button
          onClick={() => onChange(Math.min(99, quantity + 1))}
          disabled={quantity >= 99}
          aria-label="Aumentar cantidad"
          className="flex h-10 w-10 items-center justify-center rounded-r-full text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
