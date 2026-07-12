export function BrandBadge({ name }: { name: string }) {
  return (
    <span className="inline-block rounded-[6px] border border-[#7f6d8a]/25 bg-[#faf8f5]/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7f6d8a] backdrop-blur-sm">
      {name}
    </span>
  );
}
