"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  items?: FAQItem[] | string;
};

function parseItems(items?: FAQItem[] | string): FAQItem[] {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  if (typeof items === "string") {
    try {
      return JSON.parse(items);
    } catch {
      return [];
    }
  }
  return [];
}

export function FAQSection({ items }: FAQSectionProps) {
  const faqItems = parseItems(items);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqItems.length === 0) return null;

  return (
    <div className="my-8">
      <h2
        id="preguntas-frecuentes"
        className="mb-4 font-heading text-2xl font-bold text-sicaru-purple-900"
      >
        Preguntas Frecuentes
      </h2>

      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
        {faqItems.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-sicaru-purple-900 hover:bg-sicaru-purple-50"
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
