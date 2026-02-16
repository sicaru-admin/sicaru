"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";

export type StripeFormHandle = {
  confirmPayment: (returnUrl: string) => Promise<{ error?: string }>;
};

type StripeCardFormProps = {
  clientSecret: string;
};

const StripePaymentForm = forwardRef<StripeFormHandle>(
  function StripePaymentForm(_props, ref) {
    const stripe = useStripe();
    const elements = useElements();
    const [isReady, setIsReady] = useState(false);

    useImperativeHandle(ref, () => ({
      confirmPayment: async (returnUrl: string) => {
        if (!stripe || !elements) {
          return { error: "Stripe no está listo" };
        }

        const { error: submitError } = await elements.submit();
        if (submitError) {
          return { error: submitError.message ?? "Error de validación" };
        }

        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: { return_url: returnUrl },
          redirect: "if_required",
        });

        if (error) {
          return { error: error.message ?? "Error al procesar el pago" };
        }

        return {};
      },
    }));

    return (
      <div className="mt-4 space-y-3">
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: "tabs",
          }}
        />
        {!isReady && (
          <div className="flex items-center justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-sicaru-purple-600" />
          </div>
        )}
      </div>
    );
  }
);

export function StripeCardForm({ clientSecret }: StripeCardFormProps) {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret,
        locale: "es",
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#6B3FA0",
            borderRadius: "8px",
          },
        },
      }}
    >
      <StripePaymentFormWrapper />
    </Elements>
  );
}

// Internal wrapper — the ref is managed by the parent checkout page via a different pattern
function StripePaymentFormWrapper() {
  return <StripePaymentForm />;
}

// Re-export the inner form for use with ref from parent
export { StripePaymentForm };
