type EyebrowTextProps = {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
};

export function EyebrowText({ children, className = "", light = false }: EyebrowTextProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`h-px w-6 ${light ? "bg-white/40" : "bg-sicaru-gold"}`} />
      <span
        className={`text-xs font-semibold uppercase tracking-widest ${
          light ? "text-white/70" : "text-sicaru-gold"
        }`}
      >
        {children}
      </span>
    </div>
  );
}
