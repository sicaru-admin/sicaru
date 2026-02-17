"use client";

const STEPS = [
  { key: "contact", label: "Contacto" },
  { key: "shipping", label: "Dirección" },
  { key: "delivery", label: "Envío" },
  { key: "payment", label: "Pago" },
  { key: "review", label: "Confirmar" },
];

type CheckoutProgressProps = {
  activeStep: string;
  completedSteps: Set<string>;
};

export function CheckoutProgress({ activeStep, completedSteps }: CheckoutProgressProps) {
  const activeIdx = STEPS.findIndex((s) => s.key === activeStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isCompleted = completedSteps.has(step.key);
          const isActive = step.key === activeStep;

          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
                    isCompleted
                      ? "bg-sicaru-purple-600 text-white"
                      : isActive
                        ? "bg-sicaru-pink text-white ring-4 ring-sicaru-pink/20"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`mt-1 text-[10px] font-medium ${
                    isCompleted || isActive ? "text-sicaru-purple-900" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-1 h-0.5 flex-1 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-sicaru-purple-600 transition-all duration-700 ease-out"
                    style={{ width: i < activeIdx || isCompleted ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
