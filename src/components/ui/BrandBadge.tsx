export function BrandBadge({ name }: { name: string }) {
  return (
    <span className="inline-block rounded-full bg-sicaru-purple-900/80 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
      {name}
    </span>
  );
}
