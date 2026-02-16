"use client";

import { Check, ChevronDown } from "lucide-react";

type CheckoutStepSectionProps = {
  stepNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  isDisabled: boolean;
  summary?: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
};

export function CheckoutStepSection({
  stepNumber,
  title,
  isActive,
  isCompleted,
  isDisabled,
  summary,
  onEdit,
  children,
}: CheckoutStepSectionProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg border bg-white transition-colors ${
        isActive
          ? "border-sicaru-purple-300 shadow-sm"
          : isCompleted
            ? "border-gray-200"
            : "border-gray-100"
      } ${isDisabled ? "opacity-50" : ""}`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={isCompleted && !isActive ? onEdit : undefined}
        disabled={isDisabled || isActive}
        className={`flex w-full items-center justify-between px-5 py-4 text-left ${
          isCompleted && !isActive ? "cursor-pointer hover:bg-gray-50" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
              isCompleted
                ? "bg-green-100 text-green-700"
                : isActive
                  ? "bg-sicaru-purple-600 text-white"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
          </span>
          <span
            className={`text-sm font-semibold ${
              isActive
                ? "text-sicaru-purple-900"
                : isCompleted
                  ? "text-gray-900"
                  : "text-gray-400"
            }`}
          >
            {title}
          </span>
        </div>

        {isCompleted && !isActive && (
          <span className="text-xs font-medium text-sicaru-purple-600">
            Editar
          </span>
        )}
        {isActive && <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      {/* Completed summary */}
      {isCompleted && !isActive && summary && (
        <div className="border-t px-5 py-3 text-sm text-gray-600">
          {summary}
        </div>
      )}

      {/* Active content */}
      {isActive && <div className="border-t px-5 py-5">{children}</div>}
    </div>
  );
}
