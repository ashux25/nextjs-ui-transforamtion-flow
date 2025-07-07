"use client"

import { useEffect } from "react"

/**
 * Chrome sometimes throws “ResizeObserver loop completed with undelivered
 * notifications” (or “… loop limit exceeded”) when components resize rapidly.
 * The error is harmless but clutters the console and can stop execution inside
 * v0’s preview.  This hook quietly swallows that specific browser error.
 */
export default function useSuppressResizeObserverError() {
  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      const msg = e.message || ""
      if (
        msg.includes("ResizeObserver loop") || // Chrome 111+
        msg.includes("ResizeObserver loop limit exceeded") // Legacy wording
      ) {
        e.stopImmediatePropagation()
        // Optional: comment the next line out if you don’t want any log.
        // console.info("🔇 Suppressed ResizeObserver error:", msg)
      }
    }

    window.addEventListener("error", handler)
    return () => window.removeEventListener("error", handler)
  }, [])
}
