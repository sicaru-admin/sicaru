"use client";

import { useState, type FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const SUBJECT_OPTIONS = [
  "Consulta sobre productos",
  "Precios de mayoreo / Salón Pro",
  "Estado de mi pedido",
  "Devoluciones o cambios",
  "Otro",
];

export default function ContactFormClient() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar el mensaje");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12 text-center">
        {/* Green checkmark */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          ¡Mensaje Enviado!
        </h2>
        <p className="mt-2 text-gray-600">
          Te contactaremos a la brevedad. También puedes escribirnos
          directamente por WhatsApp.
        </p>

        <a
          href="https://wa.me/528281111023"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#25D366]/90"
        >
          Escribir por WhatsApp
        </a>
      </div>
    );
  }

  const inputClassName =
    "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sicaru-purple-500 focus:outline-none focus:ring-1 focus:ring-sicaru-purple-500";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-8"
    >
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className={labelClassName}>
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Tu nombre"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClassName}>
            Correo electrónico <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={inputClassName}
            placeholder="tu@correo.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className={labelClassName}>
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={inputClassName}
            placeholder="(opcional)"
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className={labelClassName}>
            Asunto <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className={inputClassName}
          >
            <option value="" disabled>
              Selecciona un asunto
            </option>
            {SUBJECT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className={labelClassName}>
            Mensaje <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className={inputClassName}
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-sicaru-pink px-8 py-3 font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : "Enviar mensaje"}
        </button>
      </div>
    </form>
  );
}
