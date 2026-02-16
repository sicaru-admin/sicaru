"use client";

import { useState } from "react";
import { MEXICAN_STATES } from "@/lib/constants/mexican-states";

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

type ShippingAddressFormProps = {
  address: Address;
  onAddressChange: (address: Address) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
};

export function ShippingAddressForm({
  address,
  onAddressChange,
  onSubmit,
  isLoading,
}: ShippingAddressFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof Address, value: string) => {
    onAddressChange({ ...address, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!address.first_name.trim()) newErrors.first_name = "Obligatorio";
    if (!address.last_name.trim()) newErrors.last_name = "Obligatorio";
    if (!address.phone.trim()) newErrors.phone = "Obligatorio";
    else if (!/^\d{10}$/.test(address.phone.replace(/\s/g, "")))
      newErrors.phone = "Ingresa 10 dígitos";
    if (!address.address_1.trim()) newErrors.address_1 = "Obligatorio";
    if (!address.city.trim()) newErrors.city = "Obligatorio";
    if (!address.province) newErrors.province = "Selecciona un estado";
    if (!address.postal_code.trim()) newErrors.postal_code = "Obligatorio";
    else if (!/^\d{5}$/.test(address.postal_code))
      newErrors.postal_code = "Ingresa 5 dígitos";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit();
  };

  const inputClass =
    "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500";
  const errorInputClass =
    "mt-1 block w-full rounded-lg border border-red-300 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            value={address.first_name}
            onChange={(e) => update("first_name", e.target.value)}
            autoComplete="given-name"
            className={errors.first_name ? errorInputClass : inputClass}
          />
          {errors.first_name && (
            <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Apellido
          </label>
          <input
            type="text"
            value={address.last_name}
            onChange={(e) => update("last_name", e.target.value)}
            autoComplete="family-name"
            className={errors.last_name ? errorInputClass : inputClass}
          />
          {errors.last_name && (
            <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <div className="relative mt-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            +52
          </span>
          <input
            type="tel"
            value={address.phone}
            onChange={(e) =>
              update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="10 dígitos"
            inputMode="numeric"
            autoComplete="tel-national"
            className={`${errors.phone ? errorInputClass : inputClass} pl-12`}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* Street */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Calle y número
        </label>
        <input
          type="text"
          value={address.address_1}
          onChange={(e) => update("address_1", e.target.value)}
          autoComplete="address-line1"
          className={errors.address_1 ? errorInputClass : inputClass}
        />
        {errors.address_1 && (
          <p className="mt-1 text-xs text-red-600">{errors.address_1}</p>
        )}
      </div>

      {/* Colonia + City */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Colonia / Interior{" "}
            <span className="text-gray-400">(opcional)</span>
          </label>
          <input
            type="text"
            value={address.address_2}
            onChange={(e) => update("address_2", e.target.value)}
            autoComplete="address-line2"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ciudad
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => update("city", e.target.value)}
            autoComplete="address-level2"
            className={errors.city ? errorInputClass : inputClass}
          />
          {errors.city && (
            <p className="mt-1 text-xs text-red-600">{errors.city}</p>
          )}
        </div>
      </div>

      {/* State + Postal Code */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            value={address.province}
            onChange={(e) => update("province", e.target.value)}
            autoComplete="address-level1"
            className={errors.province ? errorInputClass : inputClass}
          >
            <option value="">Seleccionar...</option>
            {MEXICAN_STATES.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="mt-1 text-xs text-red-600">{errors.province}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Código Postal
          </label>
          <input
            type="text"
            value={address.postal_code}
            onChange={(e) =>
              update(
                "postal_code",
                e.target.value.replace(/\D/g, "").slice(0, 5)
              )
            }
            inputMode="numeric"
            maxLength={5}
            autoComplete="postal-code"
            className={errors.postal_code ? errorInputClass : inputClass}
          />
          {errors.postal_code && (
            <p className="mt-1 text-xs text-red-600">{errors.postal_code}</p>
          )}
        </div>
      </div>

      {/* Country (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">País</label>
        <input
          type="text"
          value="México"
          disabled
          className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-sicaru-pink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:opacity-50"
      >
        {isLoading ? "Guardando..." : "Continuar"}
      </button>
    </form>
  );
}
