"use client"

import { useNetworkQuality } from "./useNetworkQuality"

/**
 * Returns image quality (0-100) adapted to network conditions.
 * - slow-2g / 2g: 60 (lowest quality for fast loading)
 * - 3g: 75
 * - 4g+: 85
 * - saveData: always 60
 */
export function useImageQuality(): number {
  const { effectiveType, saveData } = useNetworkQuality()

  if (saveData) return 60

  switch (effectiveType) {
    case "slow-2g":
    case "2g":
      return 60
    case "3g":
      return 75
    default:
      return 85
  }
}
