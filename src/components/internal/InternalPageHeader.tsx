type InternalPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function InternalPageHeader({
  eyebrow,
  title,
  description,
}: InternalPageHeaderProps) {
  return (
    <section className="bg-[#f5f1eb] py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8e7a9e]">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl font-medium leading-tight text-[#2e2b2b] md:text-5xl lg:text-[3.5rem]">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#2e2b2b]/70 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
