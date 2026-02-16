"use client";

import { useState, useEffect, useCallback } from "react";
import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/data/customer";
import { MEXICAN_STATES } from "@/lib/constants/mexican-states";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";

type AddressFormData = {
  first_name: string;
  last_name: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
};

const EMPTY_FORM: AddressFormData = {
  first_name: "",
  last_name: "",
  phone: "",
  address_1: "",
  address_2: "",
  city: "",
  province: "",
  postal_code: "",
};

function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  initialData: AddressFormData;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<AddressFormData>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            name="first_name"
            type="text"
            required
            value={form.first_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Apellido
          </label>
          <input
            name="last_name"
            type="text"
            required
            value={form.last_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Telefono
        </label>
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="10 digitos"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Calle y numero
        </label>
        <input
          name="address_1"
          type="text"
          required
          value={form.address_1}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Colonia / Referencias
        </label>
        <input
          name="address_2"
          type="text"
          value={form.address_2}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ciudad
          </label>
          <input
            name="city"
            type="text"
            required
            value={form.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            name="province"
            required
            value={form.province}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
          >
            <option value="">Seleccionar...</option>
            {MEXICAN_STATES.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700">
          Codigo postal
        </label>
        <input
          name="postal_code"
          type="text"
          required
          maxLength={5}
          value={form.postal_code}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-sicaru-purple-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sicaru-purple-800 disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function DireccionesPage() {
  const [addresses, setAddresses] = useState<HttpTypes.StoreCustomerAddress[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      const data = await listAddresses();
      setAddresses(data ?? []);
    } catch {
      setError("No se pudieron cargar las direcciones.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleCreate = async (data: AddressFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createAddress({
        ...data,
        country_code: "mx",
      });
      setShowForm(false);
      await fetchAddresses();
    } catch {
      setError("No se pudo guardar la direccion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, data: AddressFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateAddress(id, data);
      setEditingId(null);
      await fetchAddresses();
    } catch {
      setError("No se pudo actualizar la direccion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta direccion?")) return;
    setError(null);
    try {
      await deleteAddress(id);
      await fetchAddresses();
    } catch {
      setError("No se pudo eliminar la direccion.");
    }
  };

  const getStateName = (value: string) =>
    MEXICAN_STATES.find((s) => s.value === value)?.label ?? value;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-sicaru-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sicaru-purple-900 lg:text-3xl">
          Direcciones
        </h1>
        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
            }}
            className="flex items-center gap-2 rounded-full bg-sicaru-pink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* New address form */}
      {showForm && (
        <div className="mb-6 rounded-lg border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-sicaru-purple-900">
              Nueva Direccion
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <AddressForm
            initialData={EMPTY_FORM}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-lg text-gray-600">
            No tienes direcciones guardadas.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-sicaru-pink px-6 py-3 font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
          >
            <Plus className="h-4 w-4" />
            Agregar Direccion
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-lg border bg-white p-5">
              {editingId === addr.id ? (
                <AddressForm
                  initialData={{
                    first_name: addr.first_name || "",
                    last_name: addr.last_name || "",
                    phone: addr.phone || "",
                    address_1: addr.address_1 || "",
                    address_2: addr.address_2 || "",
                    city: addr.city || "",
                    province: addr.province || "",
                    postal_code: addr.postal_code || "",
                  }}
                  onSubmit={(data) => handleUpdate(addr.id, data)}
                  onCancel={() => setEditingId(null)}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {addr.first_name} {addr.last_name}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {addr.address_1}
                      {addr.address_2 && `, ${addr.address_2}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.city}, {getStateName(addr.province || "")}{" "}
                      {addr.postal_code}
                    </p>
                    {addr.phone && (
                      <p className="text-sm text-gray-600">
                        Tel: {addr.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(addr.id);
                        setShowForm(false);
                      }}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(addr.id)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
