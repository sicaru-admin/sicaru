"use client"

import { useEffect } from "react"
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals"
import type { Metric } from "web-vitals"

function sendMetric(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  })

  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon("/api/vitals", body)
  } else {
    fetch("/api/vitals", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    })
  }
}

export function WebVitals() {
  useEffect(() => {
    onCLS(sendMetric)
    onINP(sendMetric)
    onLCP(sendMetric)
    onFCP(sendMetric)
    onTTFB(sendMetric)
  }, [])

  return null
}
