"use client";

import { CardPayment } from "@mercadopago/sdk-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ensureMercadoPagoInit,
  hasMercadoPagoPublicKey,
} from "@/lib/mercadopago";

export type CardTokenData = {
  token: string;
  payment_method_id: string;
  installments: number;
};

type MercadoPagoCardFormProps = {
  amount: number;
  onTokenized: (data: CardTokenData) => void | Promise<void>;
  onError?: (error: string) => void;
};

export function MercadoPagoCardForm({
  amount,
  onTokenized,
  onError,
}: MercadoPagoCardFormProps) {
  const isConfigured = hasMercadoPagoPublicKey();
  const isSubmittingRef = useRef(false);
  const onErrorRef = useRef(onError);
  const onTokenizedRef = useRef(onTokenized);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);

  const initialization = useMemo(() => ({ amount }), [amount]);
  const customization = useMemo(
    () => ({
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
    }),
    []
  );

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    onTokenizedRef.current = onTokenized;
  }, [onTokenized]);

  useEffect(() => {
    if (!isConfigured) {
      onErrorRef.current?.(
        "Mercado Pago no está configurado para recibir pagos con tarjeta."
      );
      return;
    }

    const initialized = ensureMercadoPagoInit();
    if (!initialized) {
      onErrorRef.current?.(
        "No se pudo inicializar Mercado Pago. Revisa la configuración de pago."
      );
    }
  }, [isConfigured]);

  const handleReady = useCallback(() => {
    onErrorRef.current?.("");
  }, []);

  const handleSubmit = useCallback(
    async (formData: {
      token?: string;
      payment_method_id?: string;
      installments?: number;
    }) => {
      if (isSubmittingRef.current) return;

      isSubmittingRef.current = true;
      setIsPreparingPayment(true);

      try {
        const token = formData.token;
        const paymentMethodId = formData.payment_method_id;
        const installments = formData.installments ?? 1;

        if (!token) {
          throw new Error("No se pudo tokenizar la tarjeta. Intenta de nuevo.");
        }

        if (!paymentMethodId) {
          throw new Error(
            "Mercado Pago no devolvió el método de pago. Intenta de nuevo."
          );
        }

        await onTokenizedRef.current({
          token,
          payment_method_id: paymentMethodId,
          installments,
        });
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "Error al procesar la tarjeta. Intenta de nuevo.";
        onErrorRef.current?.(message);
        throw error;
      } finally {
        isSubmittingRef.current = false;
        setIsPreparingPayment(false);
      }
    },
    []
  );

  const handleBrickError = useCallback(
    (error: unknown) => {
      console.error("MercadoPago CardPayment error:", error);
      onErrorRef.current?.("Error en el formulario de pago. Intenta de nuevo.");
    },
    []
  );

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
        initialization={initialization}
        onReady={handleReady}
        onSubmit={handleSubmit}
        onError={handleBrickError}
        customization={customization}
      />
      {isPreparingPayment && (
        <p className="mt-3 text-sm text-gray-500">Preparando tu pago...</p>
      )}
    </div>
  );
}
