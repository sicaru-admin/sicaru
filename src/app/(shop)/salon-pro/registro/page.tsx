"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { MEXICAN_STATES } from "@/lib/constants/mexican-states"
import { submitSalonApplication } from "@/lib/data/salon-pro"

const BRANDS = [
  { value: "kuul", label: "Kuul" },
  { value: "voglia", label: "Voglia" },
  { value: "nekane", label: "Nekane Capilar" },
  { value: "hidra-color", label: "Hidra Color" },
  { value: "xiomara", label: "Xiomara" },
  { value: "vitale", label: "Vitale" },
  { value: "montis", label: "Montis" },
]

const EMPLOYEE_RANGES = ["1-3", "4-10", "11-20", "20+"]
const VOLUME_RANGES = [
  "$2,000-5,000",
  "$5,000-15,000",
  "$15,000-30,000",
  "$30,000+",
]

const STEPS = ["Tu Salon", "Tus Datos", "Tus Compras"]

type FormData = {
  salon_name: string
  address: string
  city: string
  state: string
  postal_code: string
  phone: string
  employee_count: string
  owner_name: string
  email: string
  whatsapp: string
  rfc: string
  brands_interested: string[]
  monthly_volume: string
  has_current_distributor: boolean
  current_distributor: string
  comments: string
}

const initialFormData: FormData = {
  salon_name: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  phone: "",
  employee_count: "",
  owner_name: "",
  email: "",
  whatsapp: "",
  rfc: "",
  brands_interested: [],
  monthly_volume: "",
  has_current_distributor: false,
  current_distributor: "",
  comments: "",
}

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500"
const labelClass = "block text-sm font-medium text-gray-700"
const errorClass = "mt-1 text-xs text-red-600"

export default function SalonProRegistroPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const update = (field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const toggleBrand = (value: string) => {
    setForm((prev) => ({
      ...prev,
      brands_interested: prev.brands_interested.includes(value)
        ? prev.brands_interested.filter((b) => b !== value)
        : [...prev.brands_interested, value],
    }))
    if (errors.brands_interested) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.brands_interested
        return next
      })
    }
  }

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.salon_name.trim()) e.salon_name = "Obligatorio"
    if (!form.address.trim()) e.address = "Obligatorio"
    if (!form.city.trim()) e.city = "Obligatorio"
    if (!form.state) e.state = "Obligatorio"
    if (!form.postal_code.trim()) e.postal_code = "Obligatorio"
    else if (!/^\d{5}$/.test(form.postal_code.trim()))
      e.postal_code = "Ingresa 5 digitos"
    if (!form.phone.trim()) e.phone = "Obligatorio"
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Ingresa 10 digitos"
    if (!form.employee_count) e.employee_count = "Obligatorio"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.owner_name.trim()) e.owner_name = "Obligatorio"
    if (!form.email.trim()) e.email = "Obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email invalido"
    if (!form.whatsapp.trim()) e.whatsapp = "Obligatorio"
    else if (!/^\d{10}$/.test(form.whatsapp.replace(/\s/g, "")))
      e.whatsapp = "Ingresa 10 digitos"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = (): boolean => {
    const e: Record<string, string> = {}
    if (form.brands_interested.length === 0)
      e.brands_interested = "Selecciona al menos una marca"
    if (!form.monthly_volume) e.monthly_volume = "Obligatorio"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep3()) return
    setIsSubmitting(true)
    setSubmitError("")

    try {
      await submitSalonApplication({
        salon_name: form.salon_name.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state,
        postal_code: form.postal_code.trim(),
        phone: form.phone.trim(),
        employee_count: form.employee_count,
        owner_name: form.owner_name.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
        rfc: form.rfc.trim() || undefined,
        brands_interested: form.brands_interested,
        monthly_volume: form.monthly_volume,
        has_current_distributor: form.has_current_distributor,
        current_distributor: form.current_distributor.trim() || undefined,
        comments: form.comments.trim() || undefined,
      })
      setSubmitted(true)
    } catch (err: any) {
      setSubmitError(err.message || "Error al enviar solicitud")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-green-500" />
        <h1
          className="mb-4 text-3xl font-bold text-sicaru-purple-900"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Solicitud Recibida
        </h1>
        <p className="mb-8 text-gray-600">
          Hemos recibido tu solicitud para Sicaru PRO. Te contactaremos por
          WhatsApp en maximo 48 horas para activar tu cuenta.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/salon-pro"
            className="rounded-full bg-sicaru-pink px-8 py-3 font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
          >
            Volver a Sicaru PRO
          </Link>
          <a
            href="https://wa.me/528281111023?text=Hola%2C%20acabo%20de%20enviar%20mi%20solicitud%20PRO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-sicaru-purple-600 hover:text-sicaru-purple-700"
          >
            Contactar ahora por WhatsApp
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1
        className="mb-2 text-2xl font-bold text-sicaru-purple-900 lg:text-3xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Solicitud Sicaru PRO
      </h1>
      <p className="mb-8 text-gray-600">
        Completa el formulario para solicitar tu cuenta de mayoreo.
      </p>

      {/* Progress Steps */}
      <div className="mb-10 flex items-center justify-between">
        {STEPS.map((label, i) => {
          const stepNum = i + 1
          const isActive = step === stepNum
          const isCompleted = step > stepNum
          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    isActive
                      ? "bg-sicaru-pink text-white"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`mt-1 text-xs ${isActive ? "font-semibold text-sicaru-purple-900" : "text-gray-500"}`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          )
        })}
      </div>

      {submitError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Step 1 — Salon Info */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-sicaru-purple-900">
            Informacion del Salon
          </h2>

          <div>
            <label className={labelClass}>Nombre del salon *</label>
            <input
              type="text"
              value={form.salon_name}
              onChange={(e) => update("salon_name", e.target.value)}
              className={inputClass}
              placeholder="Salon Bella"
            />
            {errors.salon_name && (
              <p className={errorClass}>{errors.salon_name}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Direccion completa *</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className={inputClass}
              placeholder="Av. Constitución 123, Col. Centro"
            />
            {errors.address && (
              <p className={errorClass}>{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Ciudad *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputClass}
                placeholder="Monterrey"
              />
              {errors.city && <p className={errorClass}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelClass}>Estado *</label>
              <select
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className={inputClass}
              >
                <option value="">Seleccionar...</option>
                {MEXICAN_STATES.map((s) => (
                  <option key={s.value} value={s.label}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.state && <p className={errorClass}>{errors.state}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Codigo Postal *</label>
              <input
                type="text"
                value={form.postal_code}
                onChange={(e) => update("postal_code", e.target.value)}
                className={inputClass}
                placeholder="64000"
                maxLength={5}
              />
              {errors.postal_code && (
                <p className={errorClass}>{errors.postal_code}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Telefono del salon *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="8181234567"
                maxLength={10}
              />
              {errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Numero de empleados *</label>
            <select
              value={form.employee_count}
              onChange={(e) => update("employee_count", e.target.value)}
              className={inputClass}
            >
              <option value="">Seleccionar...</option>
              {EMPLOYEE_RANGES.map((r) => (
                <option key={r} value={r}>
                  {r} empleados
                </option>
              ))}
            </select>
            {errors.employee_count && (
              <p className={errorClass}>{errors.employee_count}</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 rounded-full bg-sicaru-pink px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Owner Info */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-sicaru-purple-900">
            Informacion del Propietario
          </h2>

          <div>
            <label className={labelClass}>Nombre completo *</label>
            <input
              type="text"
              value={form.owner_name}
              onChange={(e) => update("owner_name", e.target.value)}
              className={inputClass}
              placeholder="Maria Garcia Lopez"
            />
            {errors.owner_name && (
              <p className={errorClass}>{errors.owner_name}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
              placeholder="maria@misalon.com"
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          <div>
            <label className={labelClass}>WhatsApp personal *</label>
            <input
              type="tel"
              value={form.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              className={inputClass}
              placeholder="10 digitos"
              maxLength={10}
            />
            {errors.whatsapp && (
              <p className={errorClass}>{errors.whatsapp}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>RFC del negocio (opcional)</label>
            <input
              type="text"
              value={form.rfc}
              onChange={(e) => update("rfc", e.target.value.toUpperCase())}
              className={inputClass}
              placeholder="XAXX010101000"
              maxLength={13}
            />
            <p className="mt-1 text-xs text-gray-500">
              Recomendado para facturacion automatica
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 rounded-full bg-sicaru-pink px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Purchase Info */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-sicaru-purple-900">
            Informacion de Compra
          </h2>

          <div>
            <label className={labelClass}>Marcas de interes *</label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BRANDS.map((brand) => (
                <label
                  key={brand.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                    form.brands_interested.includes(brand.value)
                      ? "border-sicaru-purple-500 bg-sicaru-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.brands_interested.includes(brand.value)}
                    onChange={() => toggleBrand(brand.value)}
                    className="h-4 w-4 rounded border-gray-300 text-sicaru-purple-600 focus:ring-sicaru-purple-500"
                  />
                  {brand.label}
                </label>
              ))}
            </div>
            {errors.brands_interested && (
              <p className={errorClass}>{errors.brands_interested}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Volumen mensual estimado *</label>
            <div className="mt-2 space-y-2">
              {VOLUME_RANGES.map((range) => (
                <label
                  key={range}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${
                    form.monthly_volume === range
                      ? "border-sicaru-purple-500 bg-sicaru-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="monthly_volume"
                    checked={form.monthly_volume === range}
                    onChange={() => update("monthly_volume", range)}
                    className="h-4 w-4 border-gray-300 text-sicaru-purple-600 focus:ring-sicaru-purple-500"
                  />
                  {range} MXN / mes
                </label>
              ))}
            </div>
            {errors.monthly_volume && (
              <p className={errorClass}>{errors.monthly_volume}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Actualmente compra a otro distribuidor?
            </label>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="has_distributor"
                  checked={form.has_current_distributor}
                  onChange={() => update("has_current_distributor", true)}
                  className="h-4 w-4 border-gray-300 text-sicaru-purple-600 focus:ring-sicaru-purple-500"
                />
                Si
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="has_distributor"
                  checked={!form.has_current_distributor}
                  onChange={() => {
                    update("has_current_distributor", false)
                    update("current_distributor", "")
                  }}
                  className="h-4 w-4 border-gray-300 text-sicaru-purple-600 focus:ring-sicaru-purple-500"
                />
                No
              </label>
            </div>
            {form.has_current_distributor && (
              <input
                type="text"
                value={form.current_distributor}
                onChange={(e) =>
                  update("current_distributor", e.target.value)
                }
                className={`${inputClass} mt-2`}
                placeholder="Nombre del distribuidor actual"
              />
            )}
          </div>

          <div>
            <label className={labelClass}>Comentarios adicionales</label>
            <textarea
              value={form.comments}
              onChange={(e) => update("comments", e.target.value)}
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder="Productos especificos, horarios de entrega preferidos, etc."
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-full bg-sicaru-pink px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Solicitud"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
