import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * SICARÚ campaign hero — staging component, NOT imported by the public homepage.
 *
 * Enable only after the two original, cleaned and approved photographs are
 * checked into the paths below and responsive quality/accessibility QA passes.
 * Both photographs must contain NO embedded text, product packaging or logos.
 *
 * Desktop portrait is shown in a half-width panel; on a max-width 1440px home
 * it requires 1440 source pixels for a 2× density screen (we have 1774).
 * Mobile portrait fills the width up to 390px at 3× (1170 source pixels; we
 * have 1174). This is an assessment for the intended display, not proof that
 * these assets meet the separate 3000px / 1800px master-image requirement.
 */
export function CampaignHeroCandidate() {
  return (
    <section
      aria-labelledby="sicaru-campaign-title"
      className="isolate overflow-hidden bg-[#7F6D8A] text-white"
    >
      <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
        <div className="flex min-w-0 flex-col justify-center px-5 pb-6 pt-7 sm:px-8 sm:py-9 md:px-9 md:py-14 lg:px-12">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white">
            SICARÚ · Beauty Supply
          </p>
          <h1
            id="sicaru-campaign-title"
            className="font-heading mt-3 max-w-[20ch] text-[clamp(2.125rem,8.8vw,2.6875rem)] font-medium leading-[1.04] tracking-[-0.035em] text-white md:mt-5 md:max-w-[16ch] md:text-[clamp(2.5rem,4.6vw,4.75rem)]"
          >
            Belleza profesional para ti y tu salón.
          </h1>
          <p className="mt-4 max-w-[39ch] text-sm leading-6 text-white sm:text-base sm:leading-7">
            Coloración, cuidado capilar y herramientas para tu estilo y tu profesión.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/productos"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FAF8F5] px-6 py-3 text-sm font-semibold text-[#2E2B2B] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
            >
              Explorar productos <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/salon-pro"
              className="hidden min-h-11 items-center text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:inline-flex"
            >
              Para profesionales
            </Link>
          </div>
        </div>
        <div className="relative h-[298px] min-w-0 overflow-hidden bg-[#9B89A8] sm:h-[350px] md:h-auto md:min-h-[425px] lg:min-h-[455px]">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/images/campaign/sicaru-hero-mobile.webp"
              type="image/webp"
            />
            <img
              src="/images/campaign/sicaru-hero-desktop.webp"
              alt="Retrato conceptual de belleza con cabello rizado y sonrisa natural"
              width={1774}
              height={887}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center md:object-[60%_center]"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
