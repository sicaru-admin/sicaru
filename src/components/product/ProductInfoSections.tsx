"use client";

import { useId, useState } from "react";

export type ProductInfoSection = {
  id: string;
  title: string;
  content: string | null;
};

type ProductInfoSectionsProps = {
  sections: ProductInfoSection[];
};

export function ProductInfoSections({ sections }: ProductInfoSectionsProps) {
  const realSections = sections.filter(
    (section) => section.content && section.content.trim().length > 0
  );
  const idBase = useId();
  const [openSections, setOpenSections] = useState<string[]>(() =>
    realSections[0] ? [realSections[0].id] : []
  );

  if (realSections.length === 0) return null;

  if (realSections.length === 1) {
    return (
      <section
        aria-labelledby="product-info-heading"
        className="border-y border-[#efe7dd] py-7 md:py-10"
      >
        <div className="max-w-3xl">
          <h2
            id="product-info-heading"
            className="font-heading text-2xl font-medium text-[#2E2B2B] md:text-3xl"
          >
            Sobre este producto
          </h2>
          <div className="mt-4 whitespace-pre-line text-sm leading-7 text-[#7F6D8A] md:text-base md:leading-8">
            {realSections[0].content}
          </div>
        </div>
      </section>
    );
  }

  const toggleSection = (id: string) => {
    setOpenSections((current) =>
      current.includes(id)
        ? current.filter((sectionId) => sectionId !== id)
        : [...current, id]
    );
  };

  return (
    <section
      aria-labelledby="product-info-heading"
      className="border-y border-[#efe7dd] py-7 md:py-10"
    >
      <div className="max-w-3xl">
        <h2
          id="product-info-heading"
          className="font-heading text-2xl font-medium text-[#2E2B2B] md:text-3xl"
        >
          Información del producto
        </h2>
        <div className="mt-5 divide-y divide-[#efe7dd] border-y border-[#efe7dd]">
          {realSections.map((section) => {
            const isOpen = openSections.includes(section.id);
            const buttonId = `${idBase}-${section.id}-button`;
            const panelId = `${idBase}-${section.id}-panel`;

            return (
              <div key={section.id}>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleSection(section.id)}
                  className="flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left text-sm font-semibold text-[#7f6d8a] transition-colors hover:text-[#8e7a9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8] md:text-base"
                >
                  <span>{section.title}</span>
                  <span aria-hidden="true" className="text-lg leading-none text-[#9b89a8]">
                    {isOpen ? "-" : "+"}
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-5 text-sm leading-7 text-[#7F6D8A] md:text-base md:leading-8"
                >
                  <div className="whitespace-pre-line">{section.content}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
