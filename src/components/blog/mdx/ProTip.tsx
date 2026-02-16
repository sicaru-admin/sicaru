import { Lightbulb } from "lucide-react";

type ProTipProps = {
  children: React.ReactNode;
};

export function ProTip({ children }: ProTipProps) {
  return (
    <div className="my-6 rounded-lg border-l-4 border-sicaru-purple-500 bg-sicaru-purple-50 p-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-sicaru-purple-600" />
        <div className="text-sm leading-relaxed text-sicaru-purple-900">
          <span className="font-bold">Tip Profesional:</span>{" "}
          {children}
        </div>
      </div>
    </div>
  );
}
