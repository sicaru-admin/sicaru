import { ComparisonTable } from "./ComparisonTable";
import { ProductEmbed } from "./ProductEmbed";
import { FAQSection } from "./FAQSection";
import { ProTip } from "./ProTip";
import { BeforeAfter } from "./BeforeAfter";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function createHeading(level: 2 | 3) {
  return function Heading({ children }: { children?: React.ReactNode }) {
    const text = typeof children === "string" ? children : "";
    const id = slugify(text);
    const Tag = `h${level}` as const;

    return (
      <Tag id={id} className="scroll-mt-24">
        {children}
      </Tag>
    );
  };
}

export const mdxComponents = {
  ComparisonTable,
  ProductEmbed,
  FAQSection,
  ProTip,
  BeforeAfter,
  h2: createHeading(2),
  h3: createHeading(3),
  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="text-sicaru-pink underline underline-offset-2 hover:text-sicaru-purple-700"
        {...props}
      >
        {children}
      </a>
    );
  },
  table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="bg-sicaru-purple-800 px-4 py-3 font-semibold text-white" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-t border-gray-100 px-4 py-3" {...props}>
      {children}
    </td>
  ),
  blockquote: ({ children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-4 border-sicaru-gold bg-amber-50 px-4 py-3 text-sm italic text-gray-700"
      {...props}
    >
      {children}
    </blockquote>
  ),
};
