"use client";

import { useState, useEffect, useCallback } from "react";
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

// The Medusa provider ID for our MercadoPago module
const MP_PROVIDER_ID = "pp_mercadopago_mercadopago";

// ─── Main Checkout Page ──────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { cartId, clearCart, totalItems } = useCart();
  const { customer, isAuthenticated } = useAuth();

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

  // Initialize MercadoPago SDK
  useEffect(() => {
    ensureMercadoPagoInit();
  }, []);

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

  // Pre-fill from customer profile when logged in
  useEffect(() => {
    if (!isAuthenticated || !customer || isInitializing) return;

    // Pre-fill email if not already set
    if (customer.email && !email) {
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

      // Fetch payment providers (to verify mercadopago is available)
      if (cart.region_id) {
        const providers = await listPaymentProviders(cart.region_id);
        setPaymentProviders(providers);
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

  // Card: MP brick tokenized the card → store token and advance
  const handleCardTokenized = useCallback((data: CardTokenData) => {
    setCardTokenData(data);
    setSubmitError(null);
    completeStep("payment");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // OXXO: no token needed, just advance
  const handleOxxoSubmit = useCallback(() => {
    setCardTokenData(null);
    setSubmitError(null);
    completeStep("payment");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Review step: initiate MP payment session then complete cart
  const handleOrderConfirm = async () => {
    if (!cartId || !fullCart || !selectedMethod) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Build payment data based on selected method
      const paymentData: Record<string, unknown> =
        selectedMethod === "card" && cardTokenData
          ? {
              token: cardTokenData.token,
              payment_method_id: cardTokenData.payment_method_id,
              installments: cardTokenData.installments,
              payer_email: email,
            }
          : {
              payment_method_id: "oxxo",
              payer_email: email,
            };

      // Determine the provider ID — use the first mercadopago provider if available,
      // otherwise fall back to the constant
      const mpProvider = paymentProviders.find((p) =>
        p.id.includes("mercadopago")
      );
      const providerId = mpProvider?.id ?? MP_PROVIDER_ID;

      // Initiate payment session with MP-specific data
      await initiatePaymentSession(fullCart, providerId, paymentData);

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
          result.error?.message ?? "Error al completar el pedido."
        );
      }
    } catch {
      setSubmitError("Error al procesar el pedido. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              onMethodChange={setSelectedMethod}
              onCardTokenized={handleCardTokenized}
              onOxxoSubmit={handleOxxoSubmit}
              cartTotal={fullCart?.total ?? 0}
              isLoading={stepLoading}
              error={submitError}
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
