"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FAQAccordionProps {
  items: { question: string; answer: string }[]
  title?: string
  className?: string
}

export function FAQAccordion({
  items,
  title = "Preguntas Frecuentes",
  className = "",
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={className}>
      <h2 className="mb-6 font-heading text-2xl font-bold text-sicaru-purple-900 md:text-3xl">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="pr-4 text-sm font-semibold text-sicaru-purple-900 md:text-base">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="border-t border-gray-100 px-5 py-4">
                <p className="text-sm leading-relaxed text-gray-600">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
