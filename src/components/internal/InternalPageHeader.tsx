import type { ReactNode } from "react";

type InternalPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  secondaryLine?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  visual?: ReactNode;
};

export function InternalPageHeader({
  eyebrow,
  title,
  description,
  secondaryLine,
  primaryAction,
  secondaryAction,
  visual,
}: InternalPageHeaderProps) {
  return (
    <section className="overflow-hidden border-b border-[#efe7dd] bg-[#f5f1eb]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:min-h-[560px] md:grid-cols-[minmax(0,0.86fr)_minmax(390px,1fr)] md:items-center md:gap-10 md:py-12 lg:min-h-[620px] lg:gap-14">
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7f6d8a]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.02] text-[#2e2b2b] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#2e2b2b]/70">
            {description}
          </p>
          {secondaryLine ? (
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7f6d8a]">
              {secondaryLine}
            </p>
          ) : null}

          {(primaryAction || secondaryAction) ? (
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              {primaryAction ? (
                <a
                  href={primaryAction.href}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#7f6d8a] bg-[#7f6d8a] px-5 text-sm font-semibold text-[#faf8f5] transition-[background-color,border-color] duration-200 hover:border-[#8e7a9e] hover:bg-[#8e7a9e] focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.22)]"
                >
                  {primaryAction.label}
                </a>
              ) : null}
              {secondaryAction ? (
                <a
                  href={secondaryAction.href}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#d8cedc] bg-[#faf8f5] px-5 text-sm font-semibold text-[#7f6d8a] transition-[border-color,background-color,color] duration-200 hover:border-[#9b89a8] hover:bg-[#efe7dd] hover:text-[#2e2b2b] focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.18)]"
                >
                  {secondaryAction.label}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        {visual ? <div className="min-w-0">{visual}</div> : null}
      </div>
    </section>
  );
}
