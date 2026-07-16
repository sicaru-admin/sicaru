const whatsappHref =
  "https://wa.me/528281111023?text=Hola%2C%20quiero%20asesor%C3%ADa%20para%20elegir%20productos%20Sicar%C3%BA";

export function ProductsAdviceBlock() {
  return (
    <section className="flex flex-col gap-5 rounded-lg border border-[#d8cedc] bg-[#efe7dd] px-5 py-6 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-7">
      <div className="max-w-2xl">
        <h2 className="font-heading text-3xl font-semibold leading-tight text-[#2e2b2b]">
          ¿No sabes cuál elegir?
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#2e2b2b]/68">
          Cuéntanos qué necesita tu cabello y te ayudamos a encontrar una opción adecuada.
        </p>
      </div>
      <a
        href={whatsappHref}
        className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#7f6d8a] bg-[#7f6d8a] px-5 text-sm font-semibold text-[#faf8f5] transition-[background-color,border-color] duration-200 hover:border-[#8e7a9e] hover:bg-[#8e7a9e] focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.22)]"
      >
        Pedir asesoría por WhatsApp
      </a>
    </section>
  );
}
