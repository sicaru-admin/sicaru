import type { Metadata } from "next";
import { ShippingNotice } from "@/components/checkout/ShippingNotice";

export const metadata: Metadata = {
  title: { absolute: "Consulta de envíos | SICARÚ" },
  description: "Consulta por WhatsApp las opciones de envío, cobertura y costo a tu destino antes de confirmar tu pedido con SICARÚ.",
};

export default function EnviosPage() {
  return <div className="mx-auto max-w-2xl px-5 py-12 sm:py-20"><ShippingNotice /></div>;
}
