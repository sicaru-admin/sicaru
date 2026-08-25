"use client";

import { CardPayment } from "@mercadopago/sdk-react";
import { useEffect } from "react";
import {
  ensureMercadoPagoInit,
  hasMercadoPagoPublicKey,
} from "@/lib/mercadopago";

export type CardTokenData = {
  token: string;
  payment_method_id: string;
  installments: number;
  issuer_id?: string;
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
  const isConfigured = hasMercadoPagoPublicKey();

  useEffect(() => {
    if (!isConfigured) {
      onError?.(
        "Mercado Pago no está configurado para recibir pagos con tarjeta."
      );
      return;
    }

    const initialized = ensureMercadoPagoInit();
    if (!initialized) {
      onError?.(
        "No se pudo inicializar Mercado Pago. Revisa la configuración de pago."
      );
    }
  }, [isConfigured, onError]);

  if (!isConfigured) {
    return (
      <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        Mercado Pago no está configurado para recibir pagos con tarjeta.
      </div>
    );
  }

  if (amount <= 0) {
    return (
      <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        No se pudo preparar el formulario de pago porque el total no es válido.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <CardPayment
        initialization={{ amount }}
        onReady={() => {
          onError?.("");
        }}
        onSubmit={async (formData) => {
          try {
            const token = formData.token;
            const paymentMethodId = formData.payment_method_id;
            const installments = formData.installments ?? 1;
            const issuerId = (formData as { issuer_id?: string }).issuer_id;

            if (!token) {
              onError?.("No se pudo tokenizar la tarjeta. Intenta de nuevo.");
              return;
            }

            if (!paymentMethodId) {
              onError?.(
                "Mercado Pago no devolvió el método de pago. Intenta de nuevo."
              );
              return;
            }

            onTokenized({
              token,
              payment_method_id: paymentMethodId,
              installments,
              ...(issuerId ? { issuer_id: issuerId } : {}),
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
