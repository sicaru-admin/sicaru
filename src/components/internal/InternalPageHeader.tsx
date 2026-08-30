type InternalPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function InternalPageHeader({
  eyebrow,
  title,
  description,
}: InternalPageHeaderProps) {
  return (
    <section className="bg-[#f5f1eb]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7f6d8a]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.08] text-[#2e2b2b] md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#2e2b2b]/70 md:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
