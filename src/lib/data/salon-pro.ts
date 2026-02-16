const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export type SalonApplicationPayload = {
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
  rfc?: string
  brands_interested: string[]
  monthly_volume: string
  has_current_distributor: boolean
  current_distributor?: string
  comments?: string
}

export type SalonApplicationResponse = {
  application: {
    id: string
    status: string
  }
}

export async function submitSalonApplication(
  data: SalonApplicationPayload
): Promise<SalonApplicationResponse> {
  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/salon-pro/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || "Error al enviar solicitud")
  }
  return res.json()
}
