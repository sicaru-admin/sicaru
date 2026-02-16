"use client";

import { useState } from "react";
import { List, X } from "lucide-react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  headings: Heading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (headings.length === 0) return null;

  const list = (
    <nav>
      <ul className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${h.id}`}
              className="block text-gray-500 transition-colors hover:text-sicaru-purple-700"
              onClick={() => setMobileOpen(false)}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-sicaru-purple-400">
            Contenido
          </h4>
          {list}
        </div>
      </aside>

      {/* Mobile: toggle button + overlay */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-sicaru-purple-700"
        >
          <List className="h-4 w-4" />
          Contenido
        </button>

        {mobileOpen && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sicaru-purple-400">
                Contenido
              </h4>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            {list}
          </div>
        )}
      </div>
    </>
  );
}
