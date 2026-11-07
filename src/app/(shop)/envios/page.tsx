import type { Metadata } from "next";
import { ShippingNotice } from "@/components/checkout/ShippingNotice";

export const metadata: Metadata = {
  title: { absolute: "Envíos nacionales por DHL | SICARÚ" },
  description: "SICARÚ realiza envíos nacionales por DHL. Consulta tarifas para pedidos de hasta 2 kg y 5 kg y confirma tu envío por WhatsApp.",
};

export default function EnviosPage() {
  return <div className="mx-auto max-w-2xl px-5 py-12 sm:py-20"><ShippingNotice /></div>;
}
