"use client"

import { useState, useEffect } from "react"

type EffectiveType = "slow-2g" | "2g" | "3g" | "4g"

interface NetworkInfo {
  effectiveType: EffectiveType
  saveData: boolean
  isSlowConnection: boolean
}

interface NavigatorConnection {
  effectiveType: EffectiveType
  saveData: boolean
  addEventListener(type: string, listener: () => void): void
  removeEventListener(type: string, listener: () => void): void
}

function getConnection(): NavigatorConnection | null {
  if (typeof navigator === "undefined") return null
  return (navigator as unknown as { connection?: NavigatorConnection })
    .connection ?? null
}

export function useNetworkQuality(): NetworkInfo {
  const [info, setInfo] = useState<NetworkInfo>(() => {
    const conn = getConnection()
    const effectiveType = conn?.effectiveType ?? "4g"
    return {
      effectiveType,
      saveData: conn?.saveData ?? false,
      isSlowConnection:
        effectiveType === "slow-2g" ||
        effectiveType === "2g" ||
        effectiveType === "3g" ||
        (conn?.saveData ?? false),
    }
  })

  useEffect(() => {
    const conn = getConnection()
    if (!conn) return

    function update() {
      const c = getConnection()
      if (!c) return
      setInfo({
        effectiveType: c.effectiveType,
        saveData: c.saveData,
        isSlowConnection:
          c.effectiveType === "slow-2g" ||
          c.effectiveType === "2g" ||
          c.effectiveType === "3g" ||
          c.saveData,
      })
    }

    conn.addEventListener("change", update)
    return () => conn.removeEventListener("change", update)
  }, [])

  return info
}
