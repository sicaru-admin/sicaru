const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export type LoyaltyTier = "sicaru" | "plus" | "vip"

export type LoyaltyAccount = {
  id: string
  customer_id: string
  points_balance: number
  tier: LoyaltyTier
  lifetime_points: number
  quarterly_spend: number
  tier_evaluated_at: string | null
  points_value_mxn: number
  tier_multiplier: number
  next_tier: LoyaltyTier | null
  next_tier_spend_remaining: number | null
}

export type LoyaltyTransaction = {
  id: string
  account_id: string
  type: "earn" | "redeem" | "expire" | "adjust"
  status: "pending" | "confirmed" | "cancelled"
  points: number
  order_id: string | null
  description: string
  created_at: string
}

export type LoyaltyResponse = {
  loyalty_account: LoyaltyAccount
  transactions: LoyaltyTransaction[]
}

export type RedeemResponse = {
  promo_code: string
  discount_mxn: number
  points_redeemed: number
  remaining_balance: number
}

export async function getLoyaltyAccount(): Promise<LoyaltyResponse> {
  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me/loyalty`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Error al obtener cuenta de recompensas")
  return res.json()
}

export async function redeemPoints(points: number): Promise<RedeemResponse> {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/customers/me/loyalty/redeem`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points }),
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Error al canjear puntos")
  }
  return res.json()
}
