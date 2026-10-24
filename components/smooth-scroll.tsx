"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import "lenis/dist/lenis.css"

// Inertial page scrolling. Skipped entirely for users who prefer reduced motion.
export function SmoothScroll() {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({ autoRaf: true, lerp: 0.08 })
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // On navigation, snap Lenis to wherever the router left the page instead of
  // easing from the previous page's scroll position (the "elastic" pull).
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    lenis.stop()
    lenis.scrollTo(window.scrollY, { immediate: true, force: true })
    lenis.start()
  }, [pathname])

  return null
}
