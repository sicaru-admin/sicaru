"use client";
const STEPS = ["Contacto y dirección", "Envío y pago", "Confirmación"];
export function CheckoutProgress({activeStep, completedSteps}: {activeStep: string; completedSteps: Set<string>}) {
  const current = ["contact", "shipping"].includes(activeStep) ? 0 : 1;
  return <nav aria-label="Pasos de compra" className="mb-6">
    <ol className="grid grid-cols-3 gap-2">
      {STEPS.map((label, index) => <li key={label} aria-current={index === current ? "step" : undefined} className="flex flex-col items-center gap-2 text-center">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${index === current ? "bg-sicaru-purple-700 text-white" : "bg-sicaru-purple-50 text-sicaru-purple-900"}`}>{index === 0 && completedSteps.has("shipping") ? "✓" : index + 1}</span>
        <span className="text-xs font-medium text-sicaru-purple-900">{label}</span>
      </li>)}
    </ol>
  </nav>;
}
