"use client";

import { useState, useEffect } from "react";
import {
  getLoyaltyAccount,
  redeemPoints,
  type LoyaltyAccount,
  type LoyaltyTransaction,
} from "@/lib/data/loyalty";
import {
  Gift,
  Star,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const TIER_LABELS: Record<string, string> = {
  sicaru: "Sicaru",
  plus: "Sicaru Plus",
  vip: "Sicaru VIP",
};

const TIER_CONFIG = {
  sicaru: { min: 0, pointsRate: "1 punto", color: "bg-sicaru-purple-100 text-sicaru-purple-800" },
  plus: { min: 3000, pointsRate: "1.5 puntos", color: "bg-amber-100 text-amber-800" },
  vip: { min: 8000, pointsRate: "2 puntos", color: "bg-pink-100 text-sicaru-pink" },
} as const;

function formatMXN(centavos: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(centavos / 100);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RecompensasPage() {
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redemption state
  const [redeemAmount, setRedeemAmount] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoyalty();
  }, []);

  async function fetchLoyalty() {
    try {
      setIsLoading(true);
      const data = await getLoyaltyAccount();
      setAccount(data.loyalty_account);
      setTransactions(data.transactions);
    } catch {
      setError("No se pudo cargar tu cuenta de recompensas.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRedeem() {
    const points = parseInt(redeemAmount);
    if (!points || points < 100) return;

    setIsRedeeming(true);
    setRedeemError(null);
    setRedeemResult(null);

    try {
      const result = await redeemPoints(points);
      setRedeemResult({
        code: result.promo_code,
        discount: result.discount_mxn,
      });
      setRedeemAmount("");
      await fetchLoyalty();
    } catch (err: any) {
      setRedeemError(err.message || "Error al canjear puntos");
    } finally {
      setIsRedeeming(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-sicaru-purple-600" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <Gift className="mx-auto mb-3 h-10 w-10 text-gray-400" />
        <p className="text-gray-600">
          {error || "No se encontro tu cuenta de recompensas."}
        </p>
      </div>
    );
  }

  const tierConfig = TIER_CONFIG[account.tier];
  const progressPercent =
    account.next_tier && account.next_tier_spend_remaining != null
      ? Math.min(
          100,
          ((TIER_CONFIG[account.next_tier as keyof typeof TIER_CONFIG].min * 100 -
            account.next_tier_spend_remaining) /
            (TIER_CONFIG[account.next_tier as keyof typeof TIER_CONFIG].min * 100)) *
            100
        )
      : 100;

  const discountPreview = redeemAmount
    ? Math.floor(parseInt(redeemAmount) / 100) * 10
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sicaru-purple-900 lg:text-3xl">
          Mis Recompensas
        </h1>
        <p className="mt-1 text-gray-600">
          Acumula puntos con cada compra y canjealos por descuentos.
        </p>
      </div>

      {/* Points Balance Card */}
      <div className="rounded-xl bg-gradient-to-r from-sicaru-purple-700 to-sicaru-purple-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-sicaru-purple-200">Puntos disponibles</p>
            <p className="mt-1 text-4xl font-bold">
              {account.points_balance.toLocaleString("es-MX")}
            </p>
            <p className="mt-1 text-sm text-sicaru-purple-200">
              Equivalen a ${account.points_value_mxn} MXN
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tierConfig.color}`}
            >
              <Star className="h-3 w-3" />
              {TIER_LABELS[account.tier]}
            </span>
            <p className="text-xs text-sicaru-purple-300">
              {tierConfig.pointsRate} por cada $10 MXN
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-6 border-t border-sicaru-purple-700 pt-4 text-sm">
          <div>
            <p className="text-sicaru-purple-300">Puntos acumulados</p>
            <p className="font-semibold">
              {account.lifetime_points.toLocaleString("es-MX")}
            </p>
          </div>
          <div>
            <p className="text-sicaru-purple-300">Gasto trimestral</p>
            <p className="font-semibold">{formatMXN(account.quarterly_spend)}</p>
          </div>
        </div>
      </div>

      {/* Tier Progress */}
      {account.next_tier && account.next_tier_spend_remaining != null && (
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">
              Progreso a {TIER_LABELS[account.next_tier]}
            </span>
            <span className="text-gray-500">
              Te faltan {formatMXN(account.next_tier_spend_remaining)} este
              trimestre
            </span>
          </div>
          <div className="mt-3 h-2.5 rounded-full bg-sicaru-purple-100">
            <div
              className="h-full rounded-full bg-sicaru-purple-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>{TIER_LABELS[account.tier]}</span>
            <span>{TIER_LABELS[account.next_tier]}</span>
          </div>
        </div>
      )}

      {/* Redeem Points */}
      {account.points_balance >= 100 && (
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-lg font-semibold text-sicaru-purple-900">
            Canjear Puntos
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            100 puntos = $10 MXN de descuento. Ingresa la cantidad de puntos
            (multiplo de 100).
          </p>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                min="100"
                step="100"
                max={account.points_balance}
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(e.target.value)}
                placeholder="Ej. 200"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-sicaru-purple-500 focus:ring-1 focus:ring-sicaru-purple-500"
              />
              {discountPreview > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-sicaru-pink">
                  = ${discountPreview} MXN
                </span>
              )}
            </div>
            <button
              onClick={handleRedeem}
              disabled={
                isRedeeming ||
                !redeemAmount ||
                parseInt(redeemAmount) < 100 ||
                parseInt(redeemAmount) > account.points_balance
              }
              className="rounded-lg bg-sicaru-purple-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sicaru-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRedeeming ? "Canjeando..." : "Canjear"}
            </button>
          </div>

          {redeemResult && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-medium">Descuento creado exitosamente</p>
                <p className="mt-0.5">
                  Codigo: <strong>{redeemResult.code}</strong> — ${redeemResult.discount}{" "}
                  MXN de descuento. Aplica este codigo en el checkout.
                </p>
              </div>
            </div>
          )}

          {redeemError && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {redeemError}
            </div>
          )}
        </div>
      )}

      {/* Transaction History */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-sicaru-purple-900">
          Historial de Transacciones
        </h2>

        {transactions.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            Aun no tienes transacciones. Haz una compra para empezar a
            acumular puntos.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      tx.type === "earn"
                        ? "bg-green-100"
                        : tx.type === "redeem"
                          ? "bg-pink-100"
                          : tx.type === "expire"
                            ? "bg-gray-100"
                            : "bg-blue-100"
                    }`}
                  >
                    {tx.type === "earn" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : tx.type === "redeem" ? (
                      <ArrowDownRight className="h-4 w-4 text-sicaru-pink" />
                    ) : tx.type === "expire" ? (
                      <Clock className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Minus className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatDate(tx.created_at)}</span>
                      {tx.status === "pending" && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    tx.points > 0 ? "text-green-600" : "text-sicaru-pink"
                  }`}
                >
                  {tx.points > 0 ? "+" : ""}
                  {tx.points} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tier Comparison */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-sicaru-purple-900">
          Niveles de Recompensas
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {(["sicaru", "plus", "vip"] as const).map((tier) => {
            const config = TIER_CONFIG[tier];
            const isCurrent = account.tier === tier;
            return (
              <div
                key={tier}
                className={`rounded-lg border-2 p-4 ${
                  isCurrent
                    ? "border-sicaru-purple-600 bg-sicaru-purple-50"
                    : "border-gray-200"
                }`}
              >
                {isCurrent && (
                  <span className="mb-2 inline-block rounded-full bg-sicaru-purple-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    Tu nivel actual
                  </span>
                )}
                <h3 className="text-lg font-bold text-sicaru-purple-900">
                  {TIER_LABELS[tier]}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {config.min > 0
                    ? `$${config.min.toLocaleString("es-MX")} MXN/trimestre`
                    : "Nivel base"}
                </p>
                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-sicaru-purple-600" />
                    <span>{config.pointsRate} por cada $10 MXN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="h-3.5 w-3.5 text-sicaru-purple-600" />
                    <span>100 pts = $10 MXN descuento</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
