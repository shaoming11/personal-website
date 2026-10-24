"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { email, navItems, socials } from "@/lib/data"
import { fs } from "@/lib/utils"

function EmailButton() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const visible = pos !== null
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!visible) return
    const follow = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", follow)
    return () => window.removeEventListener("mousemove", follow)
  }, [visible])

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Keyboard activation has no pointer position; anchor to the button instead.
    const rect = e.currentTarget.getBoundingClientRect()
    const start = e.detail === 0 ? { x: rect.left, y: rect.bottom } : { x: e.clientX, y: e.clientY }
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      window.location.href = `mailto:${email}`
      return
    }
    setPos(start)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPos(null), 1200)
  }

  return (
    <>
      <button type="button" onClick={copy} title={email} className="cursor-pointer hover:underline underline-offset-4">
        email
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {visible ? "email copied" : ""}
      </span>
      {/* Portaled: the header's reveal animation leaves a transform that would trap position: fixed. */}
      {pos &&
        createPortal(
          <span
            aria-hidden="true"
            className="pointer-events-none fixed z-50 border border-foreground bg-background px-2 text-foreground"
            style={{
              // Flip to the cursor's left near the right edge so the box isn't clipped.
              ...(pos.x + 100 > window.innerWidth ? { right: window.innerWidth - pos.x + 14 } : { left: pos.x + 14 }),
              top: pos.y + 14,
              fontFamily: "var(--font-roboto-mono), ui-monospace, Menlo, Consolas, monospace",
              fontSize: fs(13),
              lineHeight: 1.8,
            }}
          >
            copied!
          </span>,
          document.body,
        )}
    </>
  )
}

export function SiteHeader() {
  return (
    <header
      className="reveal flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 text-foreground"
      style={{ padding: "30px clamp(20px, 3.2vw, 46px) 0", fontSize: fs(16), lineHeight: 1.7 }}
    >
      <Link href="/" className="hover:underline underline-offset-4">
        shaoming wu
      </Link>
      <nav aria-label="Social links" className="flex flex-wrap gap-x-5">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
            className="hover:underline underline-offset-4"
          >
            {s.label}
          </a>
        ))}
        <EmailButton />
      </nav>
    </header>
  )
}

export function BackLink() {
  return (
    <Link href="/" className="inline-flex items-center gap-[calc(var(--text-scale)*10px)] text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
      <svg aria-hidden="true" style={{ width: fs(16), height: fs(16) }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 8H2M7 3 2 8l5 5" />
      </svg>
      about
    </Link>
  )
}

export function SectionsNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Sections" className="reveal flex flex-col items-start" style={{ "--i": 1 } as React.CSSProperties}>
      <BackLink />
      <div className="flex flex-wrap gap-x-[26px]">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "text-foreground underline underline-offset-[5px]"
                  : "text-muted-foreground hover:text-foreground hover:underline underline-offset-[5px]"
              }
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function PageShell({
  children,
  nav,
  mainClassName = "mt-[71px]",
  fit = false,
}: {
  children: React.ReactNode
  nav?: React.ReactNode
  mainClassName?: string
  // Lock the page to one viewport (no scrolling) on screens big enough to fit it.
  fit?: boolean
}) {
  return (
    <div
      className={`bg-background text-foreground ${fit ? "min-h-dvh md:[@media(min-height:700px)]:h-dvh md:[@media(min-height:700px)]:overflow-hidden" : "min-h-screen pb-[100px]"}`}
      style={{ fontFamily: "var(--font-roboto-mono), ui-monospace, Menlo, Consolas, monospace", fontSize: fs(17), lineHeight: 2.4 }}
    >
      <SiteHeader />
      <main className={`mx-auto w-full max-w-[1020px] px-5 ${mainClassName}`}>
        {nav}
        {children}
      </main>
    </div>
  )
}
