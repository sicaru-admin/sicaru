import Link from "next/link";

type BrandWordmarkProps = {
  variant?: "light" | "dark";
  className?: string;
};

export function BrandWordmark({
  variant = "dark",
  className = "",
}: BrandWordmarkProps) {
  return (
    <Link
      href="/"
      aria-label="Sicarú, inicio"
      className={`sicaru-wordmark ${variant === "light" ? "sicaru-wordmark-light" : "sicaru-wordmark-dark"} ${className}`}
      style={variant === "dark" ? { color: "#2E2B2B" } : undefined}
    >
      SICARÚ
    </Link>
  );
}
