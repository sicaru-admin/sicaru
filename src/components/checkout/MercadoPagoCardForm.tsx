"use client";

import { CardPayment } from "@mercadopago/sdk-react";

export type CardTokenData = {
  token: string;
  payment_method_id: string;
  installments: number;
};

type MercadoPagoCardFormProps = {
  amount: number;
  onTokenized: (data: CardTokenData) => void;
  onError?: (error: string) => void;
};

export function MercadoPagoCardForm({
  amount,
  onTokenized,
  onError,
}: MercadoPagoCardFormProps) {
  return (
    <div className="mt-4">
      <CardPayment
        initialization={{ amount }}
        onSubmit={async (formData) => {
          try {
            const token = formData.token;
            const paymentMethodId = formData.payment_method_id;
            const installments = formData.installments ?? 1;

            if (!token) {
              onError?.("No se pudo tokenizar la tarjeta. Intenta de nuevo.");
              return;
            }

            onTokenized({
              token,
              payment_method_id: paymentMethodId,
              installments,
            });
          } catch {
            onError?.("Error al procesar la tarjeta. Intenta de nuevo.");
          }
        }}
        onError={(error) => {
          console.error("MercadoPago CardPayment error:", error);
          onError?.("Error en el formulario de pago. Intenta de nuevo.");
        }}
        customization={{
          visual: {
            texts: {
              formSubmit: "Continuar",
            },
            style: {
              customVariables: {
                formBackgroundColor: "transparent",
                baseColor: "#8e7a9e",
              },
            },
          },
        }}
      />
    </div>
  );
}
