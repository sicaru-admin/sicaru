import Link from "next/link";

export function ShippingInquiryHint({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm leading-6 text-[#7f6d8a] ${className}`}>
      Envíos por DHL a México ·{" "}
      <Link href="/envios" className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f6d8a]">
        Cotizamos tu envío por WhatsApp
      </Link>
    </p>
  );
}
