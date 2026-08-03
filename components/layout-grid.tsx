"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { createPortal } from "react-dom"

const LIGHT_COLOR = "rgba(120, 125, 135, 0.28)"
const DARK_COLOR = "rgba(160, 165, 175, 0.20)"

function makeDash(dir: "to right" | "to bottom", color: string) {
  return `repeating-linear-gradient(${dir}, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px)`
}

interface BoundedVLine {
  x: number
  top: number
  bottom: number
}

function getTightTextBounds(el: Element) {
  const text = el.textContent?.trim() || ""
  const style = getComputedStyle(el)

  const probe = document.createElement("span")
  probe.style.cssText =
    "display:inline-block;width:0;height:0;vertical-align:baseline;overflow:hidden"
  el.appendChild(probe)
  const baselineY = probe.getBoundingClientRect().top
  el.removeChild(probe)

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  const m = ctx.measureText(text)

  const elRect = el.getBoundingClientRect()
  const paddingLeft = parseFloat(style.paddingLeft) || 0
  const textX = elRect.left + paddingLeft

  return {
    left: textX,
    right: textX + m.actualBoundingBoxRight,
    top: baselineY - m.actualBoundingBoxAscent,
    bottom: baselineY + m.actualBoundingBoxDescent,
  }
}

/** Remove horizontal lines within `threshold` px of each other */
function dedupeClose(values: number[], threshold = 14): number[] {
  const sorted = [...values].sort((a, b) => a - b)
  const result: number[] = []
  for (const v of sorted) {
    if (result.length === 0 || v - result[result.length - 1] > threshold) {
      result.push(v)
    }
  }
  return result
}

export function LayoutGrid() {
  const [fullVLines, setFullVLines] = useState<number[]>([])
  const [vLines, setVLines] = useState<BoundedVLine[]>([])
  const [hLines, setHLines] = useState<number[]>([])
  const [docHeight, setDocHeight] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const revealedRef = useRef(new Set<string>())

  useEffect(() => {
    setMounted(true)
    const check = () => setIsDark(document.documentElement.classList.contains("dark"))
    check()
    const mo = new MutationObserver(check)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => mo.disconnect()
  }, [])

  const measure = useCallback(() => {
    const scrollY = window.scrollY
    const hSet = new Set<number>()
    const boundedV: BoundedVLine[] = []

    const addH = (viewportY: number) => hSet.add(Math.round(viewportY + scrollY))

    const rangeBounds = (el: Element) => {
      const range = document.createRange()
      range.selectNodeContents(el)
      const r = range.getBoundingClientRect()
      range.detach()
      return r
    }

    // ── 1. Title — tight glyph bounds, horizontal only ──
    const title = document.querySelector("[data-grid-track='title']")
    if (title) {
      const b = getTightTextBounds(title)
      addH(b.top)
      addH(b.bottom)
    }

    // ── 2. Bio — Range bounds, horizontal only ──
    const bio = document.querySelector("[data-grid-track='bio']")
    if (bio) {
      const r = rangeBounds(bio)
      addH(r.top)
      addH(r.bottom)
    }

    // ── 3. Social links — top AND bottom edges ──
    const socials = document.querySelector("[data-grid-track='socials']")
    if (socials) {
      const r = socials.getBoundingClientRect()
      addH(r.top)
      addH(r.bottom)
    }

    // ── 4. Projects heading — tight glyph bounds, horizontal only ──
    let projHeadingTopY: number | null = null
    const projHeading = document.querySelector(
      "[data-grid-track='projects-heading']"
    )
    if (projHeading) {
      const b = getTightTextBounds(projHeading)
      projHeadingTopY = Math.round(b.top + scrollY)
      addH(b.top)
      addH(b.bottom)
    }

    // ── 5. Writing heading — tight glyph bounds, horizontal only ──
    const writingHeading = document.querySelector(
      "[data-grid-track='writing-heading']"
    )
    if (writingHeading) {
      const b = getTightTextBounds(writingHeading)
      addH(b.top)
      addH(b.bottom)
    }

    // ── 5b. Writing list — bottom edge for bounding line ──
    const writingList = document.querySelector(
      "[data-grid-track='writing-list']"
    )
    if (writingList) {
      const r = writingList.getBoundingClientRect()
      addH(r.bottom)
    }

    // ── 6a. Project card rows — horizontal bounding lines per row ──
    document.querySelectorAll("[data-grid-track='card-row']").forEach((row) => {
      const r = row.getBoundingClientRect()
      addH(r.top)
      addH(r.bottom)
    })

    // ── 6b. Project cards — column verticals ──
    const cards = document.querySelectorAll("[data-grid-track='card']")
    const cardData: {
      left: number
      right: number
      top: number
      bottom: number
    }[] = []

    cards.forEach((card) => {
      const r = card.getBoundingClientRect()
      cardData.push({
        left: Math.round(r.left),
        right: Math.round(r.right),
        top: Math.round(r.top + scrollY),
        bottom: Math.round(r.bottom + scrollY),
      })
    })

    // Group cards by column
    const colMap = new Map<number, typeof cardData>()
    for (const cd of cardData) {
      if (!colMap.has(cd.left)) colMap.set(cd.left, [])
      colMap.get(cd.left)!.push(cd)
    }

    let contentLeft = Infinity
    let contentRight = -Infinity

    const sortedCols = [...colMap.entries()].sort((a, b) => a[0] - b[0])
    for (let i = 0; i < sortedCols.length; i++) {
      const [, colCards] = sortedCols[i]
      const colLeft = colCards[0].left
      const colRight = colCards[0].right
      const colBottom = Math.max(...colCards.map((c) => c.bottom))

      contentLeft = Math.min(contentLeft, colLeft)
      contentRight = Math.max(contentRight, colRight)

      const innerTop =
        projHeadingTopY ?? Math.min(...colCards.map((c) => c.top))

      if (i > 0) {
        boundedV.push({ x: colLeft, top: innerTop, bottom: colBottom })
      }
      if (i < sortedCols.length - 1) {
        boundedV.push({ x: colRight, top: innerTop, bottom: colBottom })
      }
    }

    const fullV: number[] = []
    if (cardData.length > 0) {
      fullV.push(contentLeft)
      fullV.push(contentRight)
    }

    setFullVLines(fullV)
    setVLines(boundedV)
    setHLines(dedupeClose([...hSet]))
    setDocHeight(
      Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      )
    )
  }, [])

  // ── Scroll-triggered reveal animation ──
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reveal = (el: HTMLElement, delay: number) => {
      const key = el.dataset.lineKey || ""
      if (revealedRef.current.has(key)) return
      revealedRef.current.add(key)
      el.style.transitionDelay = `${delay}ms`
      requestAnimationFrame(() => {
        el.style.clipPath = "inset(0 0 0 0)"
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return

        // Separate verticals and horizontals
        const vEntries = visible
          .filter((e) => {
            const k = (e.target as HTMLElement).dataset.lineKey || ""
            return k.startsWith("fv") || k.startsWith("bv")
          })
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        const hEntries = visible
          .filter((e) => {
            const k = (e.target as HTMLElement).dataset.lineKey || ""
            return k.startsWith("h")
          })
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        // Verticals animate first
        vEntries.forEach((entry, i) => {
          reveal(entry.target as HTMLElement, i * 120)
          observer.unobserve(entry.target)
        })

        // Horizontals start after verticals + 400ms gap
        const hOffset = vEntries.length * 120 + 400
        hEntries.forEach((entry, i) => {
          reveal(entry.target as HTMLElement, hOffset + i * 100)
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: "0px 0px" }
    )

    container.querySelectorAll("[data-line-key]").forEach((el) => {
      const key = (el as HTMLElement).dataset.lineKey || ""
      if (!revealedRef.current.has(key)) {
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [fullVLines, vLines, hLines])

  // ── Mount / resize ──
  useEffect(() => {
    if (!mounted) return

    document.fonts.ready.then(() => {
      measure()
      setTimeout(measure, 800)
    })

    const main = document.querySelector("main")
    const ro = new ResizeObserver(measure)
    if (main) ro.observe(main)
    ro.observe(document.documentElement)

    window.addEventListener("resize", measure)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [mounted, measure])

  if (!mounted || docHeight === 0) return null

  const lineColor = isDark ? DARK_COLOR : LIGHT_COLOR
  const hDash = makeDash("to right", lineColor)
  const vDash = makeDash("to bottom", lineColor)

  // Slow start, accelerates — feels like a pen being drawn
  const TRANSITION = "clip-path 1100ms cubic-bezier(0.4, 0, 1, 1)"

  return createPortal(
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: docHeight,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {/* Full-page content rail verticals */}
      {fullVLines.map((x) => {
        const key = `fv${x}`
        const revealed = revealedRef.current.has(key)
        return (
          <div
            key={key}
            data-line-key={key}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              width: 1,
              height: "100%",
              backgroundImage: vDash,
              clipPath: revealed ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
              transition: TRANSITION,
            }}
          />
        )
      })}
      {/* Bounded vertical lines (inner card column edges) */}
      {vLines.map(({ x, top, bottom }, i) => {
        const key = `bv${x}-${i}`
        const revealed = revealedRef.current.has(key)
        return (
          <div
            key={key}
            data-line-key={key}
            style={{
              position: "absolute",
              left: x,
              top,
              width: 1,
              height: bottom - top,
              backgroundImage: vDash,
              clipPath: revealed ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
              transition: TRANSITION,
            }}
          />
        )
      })}
      {/* Full-width horizontal lines */}
      {hLines.map((y) => {
        const key = `h${y}`
        const revealed = revealedRef.current.has(key)
        return (
          <div
            key={key}
            data-line-key={key}
            style={{
              position: "absolute",
              top: y,
              left: 0,
              width: "100%",
              height: 1,
              backgroundImage: hDash,
              clipPath: revealed ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              transition: TRANSITION,
            }}
          />
        )
      })}
    </div>,
    document.body
  )
}
