"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { HttpTypes } from "@medusajs/types";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { useCart } from "@/components/cart/CartProvider";
import {
  getFullCart,
  updateCart,
  listShippingOptions,
  addShippingMethod,
  listPaymentProviders,
  initiatePaymentSession,
  completeCart,
} from "@/lib/data/checkout";
import { CheckoutStepSection } from "@/components/checkout/CheckoutStepSection";
import { ContactForm } from "@/components/checkout/ContactForm";
import { ShippingAddressForm } from "@/components/checkout/ShippingAddressForm";
import { ShippingMethodSelector } from "@/components/checkout/ShippingMethodSelector";
import { PaymentSelector } from "@/components/checkout/PaymentSelector";
import { OrderReview } from "@/components/checkout/OrderReview";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { MEXICAN_STATES } from "@/lib/constants/mexican-states";

export const dynamic = "force-dynamic";

type CheckoutStep =
  | "contact"
  | "shipping"
  | "delivery"
  | "payment"
  | "review";

const STEPS: CheckoutStep[] = [
  "contact",
  "shipping",
  "delivery",
  "payment",
  "review",
];

type Address = {
  first_name: string;
  last_name: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
};

const EMPTY_ADDRESS: Address = {
  first_name: "",
  last_name: "",
  phone: "",
  address_1: "",
  address_2: "",
  city: "",
  province: "",
  postal_code: "",
  country_code: "mx",
};

// ─── Stripe inner form (needs to be inside Elements) ────────────

type StripeInnerFormProps = {
  onReady: () => void;
};

const StripeInnerForm = ({
  onReady,
}: StripeInnerFormProps) => {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
      <PaymentElement onReady={onReady} options={{ layout: "tabs" }} />
    </div>
  );
};

// ─── Stripe wrapper that also exposes confirm via ref ────────────

function StripeConfirmButton({
  onConfirmResult,
  isSubmitting,
  children,
}: {
  onConfirmResult: (result: { error?: string }) => void;
  isSubmitting: boolean;
  children: React.ReactNode;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleConfirm = async () => {
    if (!stripe || !elements) {
      onConfirmResult({ error: "Stripe no está listo" });
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      onConfirmResult({
        error: submitError.message ?? "Error de validación",
      });
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirmacion`,
      },
      redirect: "if_required",
    });

    if (error) {
      onConfirmResult({
        error: error.message ?? "Error al procesar el pago",
      });
      return;
    }

    onConfirmResult({});
  };

  return (
    <button
      type="button"
      onClick={handleConfirm}
      disabled={isSubmitting || !stripe}
      className="w-full rounded-full bg-sicaru-purple-900 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-sicaru-purple-800 disabled:opacity-50"
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// ─── Main Checkout Page ──────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { cartId, clearCart, totalItems } = useCart();

  // Full Medusa cart
  const [fullCart, setFullCart] = useState<HttpTypes.StoreCart | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Step management
  const [activeStep, setActiveStep] = useState<CheckoutStep>("contact");
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(
    new Set()
  );

  // Form state
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] =
    useState<Address>(EMPTY_ADDRESS);
  const [shippingOptions, setShippingOptions] = useState<
    HttpTypes.StoreCartShippingOption[]
  >([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(
    null
  );
  const [paymentProviders, setPaymentProviders] = useState<
    HttpTypes.StorePaymentProvider[]
  >([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(
    null
  );

  // UI state
  const [stepLoading, setStepLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);

  // Initialize: fetch full cart
  useEffect(() => {
    if (!cartId) return;
    let cancelled = false;

    async function init() {
      try {
        const cart = await getFullCart(cartId!);
        if (cancelled) return;
        setFullCart(cart);

        // Pre-fill from existing cart data
        if (cart.email) setEmail(cart.email);
        if (cart.shipping_address) {
          const addr = cart.shipping_address;
          setShippingAddress({
            first_name: addr.first_name ?? "",
            last_name: addr.last_name ?? "",
            phone: addr.phone ?? "",
            address_1: addr.address_1 ?? "",
            address_2: addr.address_2 ?? "",
            city: addr.city ?? "",
            province: addr.province ?? "",
            postal_code: addr.postal_code ?? "",
            country_code: addr.country_code ?? "mx",
          });
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [cartId]);

  // Redirect if no cart or empty
  useEffect(() => {
    if (!isInitializing && (!cartId || totalItems === 0)) {
      router.replace("/carrito");
    }
  }, [isInitializing, cartId, totalItems, router]);

  // ─── Step handlers ─────────────────────────────────────────────

  const completeStep = (step: CheckoutStep) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
    const nextIdx = STEPS.indexOf(step) + 1;
    if (nextIdx < STEPS.length) {
      setActiveStep(STEPS[nextIdx]);
    }
  };

  const editStep = (step: CheckoutStep) => {
    setActiveStep(step);
    // Invalidate subsequent steps
    const stepIdx = STEPS.indexOf(step);
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      for (let i = stepIdx; i < STEPS.length; i++) {
        next.delete(STEPS[i]);
      }
      return next;
    });
    // Reset downstream state
    if (step === "shipping" || step === "contact") {
      setShippingOptions([]);
      setSelectedShippingId(null);
      setPaymentProviders([]);
      setSelectedPaymentId(null);
      setStripeClientSecret(null);
    }
    if (step === "delivery") {
      setPaymentProviders([]);
      setSelectedPaymentId(null);
      setStripeClientSecret(null);
    }
  };

  const handleContactSubmit = async () => {
    if (!cartId) return;
    setStepLoading(true);
    try {
      const cart = await updateCart(cartId, { email });
      setFullCart(cart);
      completeStep("contact");
    } catch {
      setSubmitError("Error al guardar el correo. Intenta de nuevo.");
    } finally {
      setStepLoading(false);
    }
  };

  const handleShippingSubmit = async () => {
    if (!cartId) return;
    setStepLoading(true);
    try {
      const cart = await updateCart(cartId, {
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
      });
      setFullCart(cart);

      // Fetch shipping options
      const options = await listShippingOptions(cartId);
      setShippingOptions(options as HttpTypes.StoreCartShippingOption[]);

      // Auto-select if only one option
      if (options.length === 1) {
        setSelectedShippingId(options[0].id);
      }

      completeStep("shipping");
    } catch {
      setSubmitError("Error al guardar la dirección. Intenta de nuevo.");
    } finally {
      setStepLoading(false);
    }
  };

  const handleDeliverySubmit = async () => {
    if (!cartId || !selectedShippingId) return;
    setStepLoading(true);
    try {
      const cart = await addShippingMethod(cartId, selectedShippingId);
      setFullCart(cart);

      // Fetch payment providers
      if (cart.region_id) {
        const providers = await listPaymentProviders(cart.region_id);
        setPaymentProviders(providers);

        // Auto-select if only one provider
        if (providers.length === 1) {
          setSelectedPaymentId(providers[0].id);
        }
      }

      completeStep("delivery");
    } catch {
      setSubmitError(
        "Error al seleccionar el método de envío. Intenta de nuevo."
      );
    } finally {
      setStepLoading(false);
    }
  };

  const handlePaymentSelect = async (providerId: string) => {
    setSelectedPaymentId(providerId);
    setStripeClientSecret(null);
    setStripeReady(false);

    if (!fullCart) return;

    try {
      const paymentCollection = await initiatePaymentSession(
        fullCart,
        providerId
      );

      // Refresh cart to get updated payment collection
      if (cartId) {
        const refreshed = await getFullCart(cartId);
        setFullCart(refreshed);
      }

      // Extract Stripe client secret if applicable
      if (providerId === "pp_stripe_stripe" && paymentCollection) {
        const session = paymentCollection.payment_sessions?.find(
          (s: { provider_id: string }) => s.provider_id === "pp_stripe_stripe"
        );
        if (session?.data?.client_secret) {
          setStripeClientSecret(session.data.client_secret as string);
        }
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPaymentId) return;

    // For Stripe, just check the form is ready
    if (
      selectedPaymentId === "pp_stripe_stripe" &&
      !stripeClientSecret
    ) {
      setSubmitError("Esperando la carga del formulario de pago...");
      return;
    }

    completeStep("payment");
  };

  const handleOrderConfirm = async () => {
    if (!cartId) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await completeCart(cartId);

      if (result.type === "order") {
        // Store order for confirmation page
        sessionStorage.setItem(
          "sicaru_last_order",
          JSON.stringify(result.order)
        );
        clearCart();
        router.push("/checkout/confirmacion");
      } else {
        setSubmitError(
          result.error?.message ?? "Error al completar el pedido."
        );
      }
    } catch {
      setSubmitError("Error al procesar el pedido. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStripeConfirmAndComplete = async () => {
    // This is called from within the Stripe Elements context
    // The StripeConfirmButton handles stripe.confirmPayment
    // Then we complete the cart
  };

  const onStripeResult = useCallback(async (result: { error?: string }) => {
    if (result.error) {
      setSubmitError(result.error);
      setIsSubmitting(false);
      return;
    }

    // Stripe payment confirmed, now complete the cart
    if (!cartId) return;
    try {
      const cartResult = await completeCart(cartId);
      if (cartResult.type === "order") {
        sessionStorage.setItem(
          "sicaru_last_order",
          JSON.stringify(cartResult.order)
        );
        clearCart();
        router.push("/checkout/confirmacion");
      } else {
        setSubmitError(
          cartResult.error?.message ?? "Error al completar el pedido."
        );
      }
    } catch {
      setSubmitError("Error al completar el pedido. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }, [cartId, clearCart, router]);

  // ─── Summaries for completed steps ─────────────────────────────

  const contactSummary = email;

  const addressSummary = shippingAddress.first_name
    ? `${shippingAddress.first_name} ${shippingAddress.last_name}, ${shippingAddress.address_1}, ${shippingAddress.city}, ${MEXICAN_STATES.find((s) => s.value === shippingAddress.province)?.label ?? shippingAddress.province} ${shippingAddress.postal_code}`
    : null;

  const shippingMethodName =
    shippingOptions.find((o) => o.id === selectedShippingId)?.name ??
    "Envío estándar";

  const paymentMethodName =
    selectedPaymentId === "pp_stripe_stripe"
      ? "Tarjeta de crédito / débito"
      : selectedPaymentId === "pp_system_default"
        ? "OXXO Pay / Transferencia"
        : "Método de pago";

  // ─── Loading state ─────────────────────────────────────────────

  if (isInitializing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-sicaru-purple-600" />
          <p className="mt-3 text-sm text-gray-500">
            Cargando tu carrito...
          </p>
        </div>
      </div>
    );
  }

  // ─── Review step with Stripe Elements wrapping ────────────────

  const isStripePayment = selectedPaymentId === "pp_stripe_stripe";
  const reviewContent = fullCart ? (
    <div className="space-y-5">
      <OrderReview
        cart={fullCart}
        email={email}
        shippingAddress={shippingAddress}
        shippingMethodName={shippingMethodName}
        paymentMethodName={paymentMethodName}
        onConfirm={
          isStripePayment
            ? async () => {
                setIsSubmitting(true);
              }
            : handleOrderConfirm
        }
        isSubmitting={isSubmitting}
        error={submitError}
      />
    </div>
  ) : null;

  // ─── Render ────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
      <h1 className="mb-6 text-2xl font-bold text-sicaru-purple-900 lg:mb-8 lg:text-3xl">
        Checkout
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left: Steps */}
        <div className="space-y-4 lg:col-span-7">
          {/* Step 1: Contact */}
          <CheckoutStepSection
            stepNumber={1}
            title="Contacto"
            isActive={activeStep === "contact"}
            isCompleted={completedSteps.has("contact")}
            isDisabled={false}
            summary={contactSummary}
            onEdit={() => editStep("contact")}
          >
            <ContactForm
              email={email}
              onEmailChange={setEmail}
              onSubmit={handleContactSubmit}
              isLoading={stepLoading}
            />
          </CheckoutStepSection>

          {/* Step 2: Shipping Address */}
          <CheckoutStepSection
            stepNumber={2}
            title="Dirección de envío"
            isActive={activeStep === "shipping"}
            isCompleted={completedSteps.has("shipping")}
            isDisabled={!completedSteps.has("contact")}
            summary={addressSummary}
            onEdit={() => editStep("shipping")}
          >
            <ShippingAddressForm
              address={shippingAddress}
              onAddressChange={setShippingAddress}
              onSubmit={handleShippingSubmit}
              isLoading={stepLoading}
            />
          </CheckoutStepSection>

          {/* Step 3: Shipping Method */}
          <CheckoutStepSection
            stepNumber={3}
            title="Método de envío"
            isActive={activeStep === "delivery"}
            isCompleted={completedSteps.has("delivery")}
            isDisabled={!completedSteps.has("shipping")}
            summary={shippingMethodName}
            onEdit={() => editStep("delivery")}
          >
            <ShippingMethodSelector
              options={shippingOptions}
              selectedId={selectedShippingId}
              onSelect={setSelectedShippingId}
              onSubmit={handleDeliverySubmit}
              isLoading={stepLoading}
            />
          </CheckoutStepSection>

          {/* Step 4: Payment */}
          <CheckoutStepSection
            stepNumber={4}
            title="Pago"
            isActive={activeStep === "payment"}
            isCompleted={completedSteps.has("payment")}
            isDisabled={!completedSteps.has("delivery")}
            summary={paymentMethodName}
            onEdit={() => editStep("payment")}
          >
            <PaymentSelector
              providers={paymentProviders}
              selectedProviderId={selectedPaymentId}
              onSelect={handlePaymentSelect}
              onSubmit={handlePaymentSubmit}
              isLoading={stepLoading}
              stripeClientSecret={stripeClientSecret}
              stripeFormSlot={
                stripeClientSecret ? (
                  <Elements
                    stripe={getStripe()}
                    options={{
                      clientSecret: stripeClientSecret,
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
                    <StripeInnerForm onReady={() => setStripeReady(true)} />
                  </Elements>
                ) : undefined
              }
            />
          </CheckoutStepSection>

          {/* Step 5: Review & Confirm */}
          <CheckoutStepSection
            stepNumber={5}
            title="Confirmar pedido"
            isActive={activeStep === "review"}
            isCompleted={false}
            isDisabled={!completedSteps.has("payment")}
            onEdit={() => {}}
          >
            {fullCart && (
              <>
                {/* Summary blocks */}
                <OrderReview
                  cart={fullCart}
                  email={email}
                  shippingAddress={shippingAddress}
                  shippingMethodName={shippingMethodName}
                  paymentMethodName={paymentMethodName}
                  onConfirm={
                    isStripePayment
                      ? () => {
                          setIsSubmitting(true);
                          return Promise.resolve();
                        }
                      : handleOrderConfirm
                  }
                  isSubmitting={isSubmitting}
                  error={submitError}
                />

                {/* For Stripe: wrap the confirm button in Elements so it can call stripe.confirmPayment */}
                {isStripePayment && stripeClientSecret && isSubmitting && (
                  <Elements
                    stripe={getStripe()}
                    options={{
                      clientSecret: stripeClientSecret,
                      locale: "es",
                    }}
                  >
                    <StripeAutoConfirm onResult={onStripeResult} />
                  </Elements>
                )}
              </>
            )}
          </CheckoutStepSection>
        </div>

        {/* Right: Order Summary */}
        <div className="mt-6 lg:col-span-5 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            <OrderSummary cart={fullCart} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Auto-confirm Stripe component ──────────────────────────────

function StripeAutoConfirm({
  onResult,
}: {
  onResult: (result: { error?: string }) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!stripe || !elements || hasRun.current) return;
    hasRun.current = true;

    async function confirm() {
      const { error: submitError } = await elements!.submit();
      if (submitError) {
        onResult({ error: submitError.message ?? "Error de validación" });
        return;
      }

      const { error } = await stripe!.confirmPayment({
        elements: elements!,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmacion`,
        },
        redirect: "if_required",
      });

      if (error) {
        onResult({
          error: error.message ?? "Error al procesar el pago",
        });
        return;
      }

      onResult({});
    }

    confirm();
  }, [stripe, elements, onResult]);

  return null;
}
