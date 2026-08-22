"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { HttpTypes } from "@medusajs/types";
import { ensureMercadoPagoInit } from "@/lib/mercadopago";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { listAddresses } from "@/lib/data/customer";
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
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { ContactForm } from "@/components/checkout/ContactForm";
import { ShippingAddressForm } from "@/components/checkout/ShippingAddressForm";
import { ShippingMethodSelector } from "@/components/checkout/ShippingMethodSelector";
import {
  PaymentSelector,
  type PaymentMethod,
} from "@/components/checkout/PaymentSelector";
import { OrderReview } from "@/components/checkout/OrderReview";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { MEXICAN_STATES } from "@/lib/constants/mexican-states";
import type { CardTokenData } from "@/components/checkout/MercadoPagoCardForm";

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

type PaymentSessionStatus =
  | "authorized"
  | "captured"
  | "pending"
  | "requires_more"
  | "error"
  | "canceled"
  | "pending_authorization";

type PaymentSessionLike = {
  id?: string;
  status?: PaymentSessionStatus | "rejected" | "failed" | string;
};

type PaymentCollectionLike = {
  status?: "not_paid" | "awaiting" | "authorized" | "partially_authorized" | "canceled" | "completed" | "failed" | string;
  payment_sessions?: PaymentSessionLike[];
};

type CartWithPaymentSessions = HttpTypes.StoreCart & {
  payment_collection?: PaymentCollectionLike | null;
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

const PAYMENT_RETRY_MESSAGE =
  "No pudimos aprobar tu pago. Vuelve a ingresar tus datos o elige otro método de pago.";
const PAYMENT_PROCESSING_MESSAGE =
  "No pudimos procesar el pago. Vuelve a ingresar tus datos o elige otro método de pago.";
const CART_PREPARATION_ERROR =
  "No pudimos preparar tu carrito. Revisa tu conexión e inténtalo nuevamente.";
const TECHNICAL_PAYMENT_SESSION_ERROR =
  "payment sessions are required to complete cart";
const USABLE_PAYMENT_SESSION_STATUSES = new Set<PaymentSessionStatus>([
  "authorized",
  "captured",
  "pending",
  "requires_more",
  "pending_authorization",
]);

// ─── Main Checkout Page ──────────────────────────────────────────

function getCheckoutErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return fallback;
}

function getSafeCheckoutErrorMessage(error: unknown, fallback: string) {
  const message = getCheckoutErrorMessage(error, fallback);
  return message.toLowerCase().includes(TECHNICAL_PAYMENT_SESSION_ERROR)
    ? PAYMENT_PROCESSING_MESSAGE
    : message;
}

function findMercadoPagoProvider(
  providers: HttpTypes.StorePaymentProvider[]
) {
  return providers.find((provider) => {
    const id = provider.id.toLowerCase();
    return id.includes("mercadopago") || id.includes("mercado_pago");
  });
}

function hasUsablePaymentSession(cart: HttpTypes.StoreCart | null) {
  const paymentCollection = (cart as CartWithPaymentSessions | null)
    ?.payment_collection;

  if (!paymentCollection) return false;
  if (["canceled", "failed"].includes(paymentCollection.status ?? "")) {
    return false;
  }

  const sessions = paymentCollection.payment_sessions ?? [];
  if (sessions.length === 0) return false;

  return sessions.some((session) => {
    if (!session.id) return false;
    if (!session.status) return false;
    return USABLE_PAYMENT_SESSION_STATUSES.has(
      session.status as PaymentSessionStatus
    );
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartId,
    clearCart,
    totalItems,
    isInitializingCart,
    cartError,
    retryInitializeCart,
  } = useCart();
  const { customer, isAuthenticated } = useAuth();

  // Full Medusa cart
  const [fullCart, setFullCart] = useState<HttpTypes.StoreCart | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [fullCartError, setFullCartError] = useState<string | null>(null);
  const [fullCartRetryCount, setFullCartRetryCount] = useState(0);

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

  // MercadoPago payment state
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [cardTokenData, setCardTokenData] = useState<CardTokenData | null>(
    null
  );

  // UI state
  const [stepLoading, setStepLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingPayment, setIsValidatingPayment] = useState(false);
  const orderSubmissionLockRef = useRef(false);

  // Initialize MercadoPago SDK
  useEffect(() => {
    ensureMercadoPagoInit();
  }, []);

  // Initialize: fetch full cart
  useEffect(() => {
    if (isInitializingCart) return;

    if (!cartId) {
      const timer = window.setTimeout(() => {
        setFullCart(null);
        setIsInitializing(false);
      }, 0);

      return () => window.clearTimeout(timer);
    }

    let cancelled = false;

    async function init() {
      setIsInitializing(true);
      setFullCartError(null);

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
        if (!cancelled) {
          setFullCartError(CART_PREPARATION_ERROR);
        }
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [cartId, fullCartRetryCount, isInitializingCart]);

  // Pre-fill from customer profile when logged in
  useEffect(() => {
    if (!isAuthenticated || !customer || isInitializing) return;

    // Pre-fill email if not already set
    if (customer.email && !email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(customer.email);
    }

    // Pre-fill address from customer's first saved address
    if (shippingAddress.first_name === "") {
      listAddresses()
        .then((addresses) => {
          if (addresses && addresses.length > 0) {
            const addr = addresses[0];
            setShippingAddress({
              first_name: addr.first_name || customer.first_name || "",
              last_name: addr.last_name || customer.last_name || "",
              phone: addr.phone || customer.phone || "",
              address_1: addr.address_1 || "",
              address_2: addr.address_2 || "",
              city: addr.city || "",
              province: addr.province || "",
              postal_code: addr.postal_code || "",
              country_code: addr.country_code || "mx",
            });
          } else if (customer.first_name) {
            // No saved addresses, but pre-fill name
            setShippingAddress((prev) => ({
              ...prev,
              first_name: customer.first_name || "",
              last_name: customer.last_name || "",
              phone: customer.phone || "",
            }));
          }
        })
        .catch(() => {
          // Ignore - just don't pre-fill
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, customer, isInitializing]);

  // Redirect if no cart or empty
  useEffect(() => {
    if (
      !isInitializingCart &&
      !isInitializing &&
      !cartError &&
      !fullCartError &&
      cartId &&
      totalItems === 0
    ) {
      router.replace("/carrito");
    }
  }, [
    cartError,
    cartId,
    fullCartError,
    isInitializing,
    isInitializingCart,
    router,
    totalItems,
  ]);

  // ─── Step handlers ─────────────────────────────────────────────

  const completeStep = (step: CheckoutStep) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
    const nextIdx = STEPS.indexOf(step) + 1;
    if (nextIdx < STEPS.length) {
      setActiveStep(STEPS[nextIdx]);
    }
  };

  const invalidatePaymentStep = useCallback((message: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.delete("payment");
      next.delete("review");
      return next;
    });
    setActiveStep("payment");
    setCardTokenData(null);
    setSubmitError(message);
  }, []);

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
      setSelectedMethod(null);
      setCardTokenData(null);
    }
    if (step === "delivery") {
      setPaymentProviders([]);
      setSelectedMethod(null);
      setCardTokenData(null);
    }
    if (step === "payment") {
      setSelectedMethod(null);
      setCardTokenData(null);
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setCardTokenData(null);
    setSubmitError(null);
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.delete("payment");
      next.delete("review");
      return next;
    });
  };

  const handleContactSubmit = async () => {
    if (!cartId) return;
    setStepLoading(true);
    try {
      const cart = await updateCart(cartId, { email });
      setFullCart(cart);
      completeStep("contact");
    } catch (error) {
      setSubmitError(
        getCheckoutErrorMessage(
          error,
          "Error al guardar el correo. Intenta de nuevo."
        )
      );
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
    } catch (error) {
      setSubmitError(
        getCheckoutErrorMessage(
          error,
          "Error al guardar la dirección. Intenta de nuevo."
        )
      );
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

      // Fetch payment providers (to verify mercadopago is available)
      if (cart.region_id) {
        const providers = await listPaymentProviders(cart.region_id);
        setPaymentProviders(providers);
      }

      completeStep("delivery");
    } catch (error) {
      setSubmitError(
        getCheckoutErrorMessage(
          error,
          "Error al seleccionar el método de envío. Intenta de nuevo."
        )
      );
    } finally {
      setStepLoading(false);
    }
  };

  const preparePaymentSession = useCallback(
    async (method: PaymentMethod, tokenData?: CardTokenData) => {
      if (!fullCart) {
        throw new Error("No se pudo cargar el carrito para preparar el pago.");
      }

      const mpProvider = findMercadoPagoProvider(paymentProviders);
      if (!mpProvider) {
        throw new Error(
          "Mercado Pago no está disponible para esta región. Intenta de nuevo más tarde."
        );
      }

      const paymentData: Record<string, unknown> =
        method === "card" && tokenData
          ? {
              token: tokenData.token,
              payment_method_id: tokenData.payment_method_id,
              installments: tokenData.installments,
              ...(tokenData.issuer_id
                ? { issuer_id: tokenData.issuer_id }
                : {}),
              payer_email: email,
            }
          : {
              payment_method_id: "oxxo",
              payer_email: email,
            };

      const paymentCollection = await initiatePaymentSession(
        fullCart,
        mpProvider.id,
        paymentData
      );

      setFullCart((current) =>
        current
          ? {
              ...current,
              payment_collection: paymentCollection,
            }
          : current
      );

      if (
        !hasUsablePaymentSession({
          ...fullCart,
          payment_collection: paymentCollection,
        } as HttpTypes.StoreCart)
      ) {
        throw new Error(PAYMENT_PROCESSING_MESSAGE);
      }
    },
    [email, fullCart, paymentProviders]
  );

  // Card: MP brick tokenized the card → create Medusa payment session
  const handleCardTokenized = useCallback(
    async (data: CardTokenData) => {
      setStepLoading(true);
      setSubmitError(null);

      try {
        await preparePaymentSession("card", data);
        setCardTokenData(data);
        setSelectedMethod("card");
        completeStep("payment");
      } catch (error) {
        setSubmitError(
          getCheckoutErrorMessage(
            error,
            "Error al preparar el pago con tarjeta. Intenta de nuevo."
          )
        );
      } finally {
        setStepLoading(false);
      }
    },
    [preparePaymentSession]
  );

  // OXXO: create Medusa payment session before review
  const handleOxxoSubmit = useCallback(async () => {
    setStepLoading(true);
    setSubmitError(null);

    try {
      await preparePaymentSession("oxxo");
      setCardTokenData(null);
      setSelectedMethod("oxxo");
      completeStep("payment");
    } catch (error) {
      setSubmitError(
        getCheckoutErrorMessage(
          error,
          "Error al preparar el pago en OXXO. Intenta de nuevo."
        )
      );
    } finally {
      setStepLoading(false);
    }
  }, [preparePaymentSession]);

  // Review step: complete cart after a valid payment session exists
  const handleOrderConfirm = async () => {
    if (orderSubmissionLockRef.current) return;
    orderSubmissionLockRef.current = true;

    try {
      if (!cartId || !fullCart || !selectedMethod) return;

      setIsSubmitting(true);
      setIsValidatingPayment(true);
      setSubmitError(null);

      if (selectedMethod === "card" && !cardTokenData) {
        invalidatePaymentStep("Ingresa los datos de tu tarjeta para continuar.");
        return;
      }

      const refreshedCart = await getFullCart(cartId);
      setFullCart(refreshedCart);

      if (!hasUsablePaymentSession(refreshedCart)) {
        invalidatePaymentStep(PAYMENT_RETRY_MESSAGE);
        return;
      }

      // Complete the cart → creates the order
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
          getSafeCheckoutErrorMessage(
            result.error,
            "Error al completar el pedido."
          )
        );
      }
    } catch (error) {
      setSubmitError(
        getSafeCheckoutErrorMessage(
          error,
          "Error al procesar el pedido. Intenta de nuevo."
        )
      );
    } finally {
      orderSubmissionLockRef.current = false;
      setIsValidatingPayment(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const shouldReconcilePayment =
      completedSteps.has("payment") || activeStep === "review" || !!cardTokenData;

    if (!shouldReconcilePayment || !fullCart) return;
    if (hasUsablePaymentSession(fullCart)) return;

    const timer = window.setTimeout(() => {
      invalidatePaymentStep(PAYMENT_RETRY_MESSAGE);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [activeStep, cardTokenData, completedSteps, fullCart, invalidatePaymentStep]);

  // ─── Summaries for completed steps ─────────────────────────────

  const contactSummary = email;

  const addressSummary = shippingAddress.first_name
    ? `${shippingAddress.first_name} ${shippingAddress.last_name}, ${shippingAddress.address_1}, ${shippingAddress.city}, ${MEXICAN_STATES.find((s) => s.value === shippingAddress.province)?.label ?? shippingAddress.province} ${shippingAddress.postal_code}`
    : null;

  const shippingMethodName =
    shippingOptions.find((o) => o.id === selectedShippingId)?.name ??
    "Envío estándar";

  const paymentMethodName =
    selectedMethod === "card"
      ? "Tarjeta de crédito / débito"
      : selectedMethod === "oxxo"
        ? "OXXO Pay"
        : "Método de pago";
  const isPaymentReady = hasUsablePaymentSession(fullCart);
  const visibleCartError = cartError || fullCartError;
  const isCheckoutLoading = isInitializingCart || isInitializing;

  // ─── Loading state ─────────────────────────────────────────────

  if (isCheckoutLoading) {
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

  if (visibleCartError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-5 text-center"
        >
          <p className="text-sm font-medium text-red-800">
            {visibleCartError}
          </p>
          <button
            type="button"
            onClick={() => {
              if (cartError) {
                void retryInitializeCart().catch(() => {});
                return;
              }
              setFullCartRetryCount((count) => count + 1);
            }}
            disabled={isInitializingCart || isInitializing}
            className="mt-4 rounded-full bg-sicaru-purple-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sicaru-purple-600 disabled:opacity-50"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  if (!cartId || !cart) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-lg border border-gray-200 bg-white p-5 text-center">
          <p className="text-sm font-medium text-gray-900">
            Tu carrito está vacío.
          </p>
          <button
            type="button"
            onClick={() => router.push("/carrito")}
            className="mt-4 rounded-full bg-sicaru-purple-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sicaru-purple-600"
          >
            Volver al carrito
          </button>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
      <h1 className="mb-6 text-2xl font-bold text-sicaru-purple-900 lg:mb-8 lg:text-3xl">
        Checkout
      </h1>

      <CheckoutProgress activeStep={activeStep} completedSteps={completedSteps} />

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

          {/* Step 4: Payment Method */}
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
              selectedMethod={selectedMethod}
              onMethodChange={handlePaymentMethodChange}
              onCardTokenized={handleCardTokenized}
              onOxxoSubmit={handleOxxoSubmit}
              cartTotal={fullCart?.total ?? 0}
              isLoading={stepLoading}
              error={submitError}
              onError={setSubmitError}
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
              <OrderReview
                cart={fullCart}
                email={email}
                shippingAddress={shippingAddress}
                shippingMethodName={shippingMethodName}
                paymentMethodName={paymentMethodName}
                onConfirm={handleOrderConfirm}
                isSubmitting={isSubmitting}
                isPaymentReady={isPaymentReady}
                isValidatingPayment={isValidatingPayment}
                error={submitError}
              />
            )}
          </CheckoutStepSection>
        </div>

        {/* Right: Order Summary */}
        <div className="mt-6 lg:col-span-5 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            <OrderSummary
              cart={fullCart}
              isAuthenticated={isAuthenticated}
              onCartRefresh={async () => {
                if (cartId) {
                  const updated = await getFullCart(cartId);
                  setFullCart(updated);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
