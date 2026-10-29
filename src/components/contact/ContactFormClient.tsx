"use client";

import { useState, type FormEvent } from "react";

interface FormData {
  name: string;
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
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
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

      const data = await res.json();
      if (
        data.ok !== true ||
        typeof data.whatsappUrl !== "string" ||
        !data.whatsappUrl.startsWith("https://wa.me/528281136652?text=")
      ) {
        throw new Error("No pudimos preparar el mensaje. Inténtalo de nuevo.");
      }
      setWhatsappUrl(data.whatsappUrl);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (whatsappUrl) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12 text-center">
        {/* Neutral prepared-message icon */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sicaru-purple-50">
          <svg
            aria-hidden="true"
            className="h-8 w-8 text-sicaru-purple-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6A8.4 8.4 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8v.5Z"
            />
          </svg>
        </div>

        <h2
          tabIndex={-1}
          ref={(heading) => {
            heading?.focus({ preventScroll: true });
            heading?.scrollIntoView({ block: "center" });
          }}
          className="text-2xl font-bold text-gray-900"
        >
          Tu mensaje está listo
        </h2>
        <p className="mt-2 text-gray-600">
          Aún no se ha enviado. Continúa a nuestro WhatsApp oficial para
          revisar el mensaje y pulsar enviar cuando tú decidas.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#25D366]/90"
        >
          Continuar a WhatsApp
        </a>
        <button
          type="button"
          onClick={() => setWhatsappUrl("")}
          className="mt-4 rounded-lg px-4 py-3 text-sm font-medium text-sicaru-purple-500 underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Editar mensaje
        </button>
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
        <p className="text-sm text-gray-600">
          Prepara tu mensaje para WhatsApp. Después podrás revisarlo y enviarlo
          voluntariamente; este formulario no lo envía automáticamente.
        </p>
        {/* Name */}
        <div>
          <label htmlFor="name" className={labelClassName}>
            Nombre <span className="text-red-500">*</span>
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
          <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-sicaru-pink px-8 py-3 font-semibold text-white transition-colors hover:bg-sicaru-pink/90 disabled:opacity-50"
        >
          {isSubmitting ? "Preparando..." : "Preparar mensaje"}
        </button>
      </div>
    </form>
  );
}
