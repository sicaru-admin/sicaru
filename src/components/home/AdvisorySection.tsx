import Link from "next/link";
import { MessageCircle } from "lucide-react";

const HELP_TOPICS = [
  "Cabello seco",
  "Cabello dañado",
  "Cabello teñido",
  "Frizz",
  "Caída",
  "Rizos",
];

const WHATSAPP_MESSAGE =
  "Hola, quiero asesoría para elegir un producto Sicarú.";

export function AdvisorySection() {
  return (
    <section className="bg-[#efe7dd] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 border-y border-[#7f6d8a]/18 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="sicaru-eyebrow">07 · Asesoría personalizada</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-[#2e2b2b] md:text-5xl">
              ¿No sabes qué producto elegir?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#2e2b2b]/70">
              Cuéntanos qué necesita tu cabello y te ayudamos a encontrar una
              opción adecuada.
            </p>
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              {HELP_TOPICS.map((topic) => (
                <Link
                  key={topic}
                  href={`/productos?buscar=${encodeURIComponent(topic.toLowerCase())}`}
                  className="rounded-[6px] border border-[#7f6d8a]/28 bg-[#faf8f5] px-4 py-2 text-sm font-medium text-[#2e2b2b] transition-colors hover:border-[#7f6d8a] hover:text-[#7f6d8a]"
                >
                  {topic}
                </Link>
              ))}
            </div>
            <a
              href={`https://wa.me/528281111023?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sicaru-button-primary mt-6"
            >
              <MessageCircle className="h-4 w-4" />
              Hablar con Sicarú
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
