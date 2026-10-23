import type { Metadata } from "next";
import { ShippingNotice } from "@/components/checkout/ShippingNotice";

export const metadata: Metadata = {
  title: "Envíos online próximamente",
  description: "Consulta productos y disponibilidad con SICARÚ por WhatsApp. Los envíos y pagos online aún no están habilitados.",
};

export default function EnviosPage() {
  return <div className="mx-auto max-w-2xl px-5 py-12 sm:py-20"><ShippingNotice /></div>;
}
