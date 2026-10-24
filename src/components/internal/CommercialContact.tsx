import { STORE } from "@/lib/constants/store";

export function CommercialContact({ message = "Hola, quisiera consultar productos y disponibilidad en SICARÚ.", label = "Escríbenos por WhatsApp" }: { message?: string; label?: string }) {
  return <a href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#7f6d8a] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[#8e7a9e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a]">{label}</a>;
}
