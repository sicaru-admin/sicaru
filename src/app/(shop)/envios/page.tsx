import type { Metadata } from "next";
import { ShippingNotice } from "@/components/checkout/ShippingNotice";

export const metadata: Metadata = {
  title: { absolute: "Envíos con DHL | SICARÚ" },
  description: "Envíos por DHL desde Cadereyta Jiménez, Nuevo León. Cotiza según destino, peso, volumen y cobertura, y confirma tu pedido por WhatsApp.",
};

export default function EnviosPage() {
  return <div className="mx-auto max-w-2xl px-5 py-12 sm:py-20"><ShippingNotice /></div>;
}
