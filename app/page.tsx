"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { work } from "@/lib/portfolio-data"

const linkColors = [
  "bg-blue-400/30",
  "bg-emerald-400/30",
  "bg-amber-400/30",
  "bg-rose-400/30",
  "bg-violet-400/30",
  "bg-cyan-400/30",
  "bg-pink-400/30",
  "bg-orange-400/30",
]

type BioSegment = { text: string } | { link: string; href: string; icon?: string }

const bioItems: BioSegment[][] = [
  [
    { text: "incoming mechatronics engineering @ " },
    { link: "UWaterloo", href: "https://uwaterloo.ca", icon: "/icons/icon_uw.png" },
  ],
  [
    { text: "doing research on " },
    { link: "reinforcement learning", href: "#" },
  ],
  [
    { text: "building a self-driving car @ " },
    { link: "WATonomous", href: "https://watonomous.ca", icon: "/icons/icon_wato.jpeg" },
  ],
  [
    { text: "open-source CV @ " },
    { link: "Roboflow", href: "https://roboflow.com", icon: "/icons/icon_rb.webp" },
  ],
  [
    { text: "building tactile data for " },
    { link: "humanoids", href: "#" },
  ],
  [
    { text: "organizing toronto's largest " },
    { link: "summer hackathon", href: "https://hackthe6ix.com", icon: "/icons/icon_ht6.jpeg" },
    { text: " (400+ participants)" },
  ],
  [
    { text: "previously organized " },
    { link: "Hack Canada", href: "https://hackcanada.org", icon: "/icons/icon_hc.png" },
    { text: " (700+ participants)" },
  ],
]

const socials = [
  { label: "linkedin", href: "https://linkedin.com/in/shaoming-wu" },
  { label: "x", href: "https://x.com" },
  { label: "github", href: "https://github.com/shaoming11" },
]

const navItems = [
  { id: "about", label: "about" },
  { id: "projects", label: "projects" },
  { id: "writing", label: "writing" },
]

const blogPosts = [
  { title: "blog #1", date: "march 17, 2026" },
  { title: "blog #1", date: "march 17, 2026" },
  { title: "blog #1", date: "march 17, 2026" },
  { title: "blog #1", date: "march 17, 2026" },
  { title: "blog #1", date: "march 17, 2026" },
]

function handleNav(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

let linkColorIndex = 0
function getNextColor() {
  const color = linkColors[linkColorIndex % linkColors.length]
  linkColorIndex++
  return color
}

function AnimatedLink({ href, children, colorClass, icon }: { href: string; children: React.ReactNode; colorClass: string; icon?: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
      className="group/link relative inline"
    >
      {icon && (
        <Image src={icon} alt="" width={16} height={16} className="mb-0.5 inline size-4 rounded-sm object-cover" />
      )}{" "}
      <span className={`absolute inset-0 -mx-0.5 rounded-sm ${colorClass} origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/link:scale-x-100`} />
      <span className="relative underline decoration-muted-foreground/50 underline-offset-2 transition-[text-decoration-color] duration-300 group-hover/link:decoration-transparent">
        {children}
      </span>
    </a>
  )
}

function SideNav() {
  const [inAbout, setInAbout] = useState(true)
  const [manualHover, setManualHover] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    const aboutEl = document.getElementById("about")
    if (!aboutEl) return
    const observer = new IntersectionObserver(
      ([entry]) => setInAbout(entry.isIntersecting),
      { rootMargin: "0px 0px -50% 0px", threshold: 0 }
    )
    observer.observe(aboutEl)
    return () => observer.disconnect()
  }, [])

  const expanded = inAbout || manualHover
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (expanded) {
      const timer = setTimeout(() => setReady(true), 500)
      return () => clearTimeout(timer)
    }
    setReady(false)
  }, [expanded])

  return (
    <>
      {/* Hover trigger zone — always present on right edge */}
      <div
        className="fixed right-0 top-0 z-9999 hidden h-screen w-48 sm:block"
        onMouseEnter={() => setManualHover(true)}
        onMouseLeave={() => { setManualHover(false); setHovered(null) }}
      />

      {/* Nav container — top-right, aligned with heading */}
      <div
        className="fixed z-9999 hidden sm:block"
        style={{
          top: "4rem",
          left: "min(calc(100% - 1.5rem), calc(50% + 24rem - 1.5rem))",
          pointerEvents: expanded ? "auto" : "none",
        }}
        onMouseEnter={() => setManualHover(true)}
        onMouseLeave={() => { setManualHover(false); setHovered(null) }}
      >
        {/* Gradient backdrop */}
        <div
          className="absolute right-[-50vw] transition-opacity duration-500 ease-out"
          style={{
            top: "-4rem",
            bottom: "-100vh",
            left: "-16rem",
            opacity: expanded ? 1 : 0,
            background: "linear-gradient(to right, transparent, var(--background) 40%)",
            pointerEvents: "none",
          }}
        />

        {/* Nav labels */}
        <div className="relative flex flex-col items-start gap-1">
          {navItems.map((item) => {
            const isHovered = ready && hovered === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                onMouseEnter={() => ready && setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className="whitespace-nowrap text-left text-muted-foreground"
                style={{
                  transition: "transform 500ms ease-out, opacity 500ms ease-out, font-size 300ms ease-out, font-weight 300ms ease-out, color 300ms ease-out",
                  transform: expanded ? "translateX(0)" : "translateX(calc(100% + 4rem))",
                  opacity: expanded ? 1 : 0,
                  color: isHovered ? "var(--foreground)" : undefined,
                  fontSize: isHovered ? "2.5rem" : "1rem",
                  fontWeight: isHovered ? 700 : 400,
                  lineHeight: 1.8,
                  pointerEvents: expanded ? "auto" : "none",
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

function BioLine({ segments }: { segments: BioSegment[] }) {
  return (
    <li className="flex gap-1">
      <span className="text-muted-foreground">•</span>
      <span>
        {segments.map((seg, j) => {
          if ("link" in seg) {
            const color = getNextColor()
            return (
              <AnimatedLink key={j} href={seg.href} colorClass={color} icon={seg.icon}>
                {seg.link}
              </AnimatedLink>
            )
          }
          return <span key={j}>{seg.text}</span>
        })}
      </span>
    </li>
  )
}


export default function Page() {
  linkColorIndex = 0
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 font-mono">
      {/* Fixed side nav */}
      <SideNav />

      {/* Header section */}
      <section id="about" className="relative">
        <h1 className="font-bold tracking-tight" style={{ fontSize: "clamp(2.25rem, 5vw, 3.4375rem)" }}>shaoming wu</h1>

        <ul className="mt-8 space-y-1" style={{ fontSize: "19px" }}>
          {bioItems.map((segments, i) => (
            <BioLine key={i} segments={segments} />
          ))}
        </ul>

        {/* Social links */}
        <div className="mt-40 flex items-center justify-center gap-6" style={{ fontSize: "19px" }}>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-muted-foreground/50 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-foreground"
            >
              {s.label}
            </a>
          ))}
        </div>
      </section>

      {/* Projects section – full-bleed cards */}
      <section id="projects" className="mt-16">
        <h2 className="font-bold" style={{ fontSize: "25px" }}>projects</h2>
      </section>
      <section
        className="relative mt-8"
        style={{
          width: "calc(100vw - 3rem)",
          marginLeft: "calc(-50vw + 50% + 1.5rem)",
        }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {work.map((item) => (
            <article key={item.id} className="group relative overflow-hidden rounded-lg">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={`${item.title} preview`}
                width={800}
                height={500}
                className="aspect-4/3 w-full object-cover brightness-[0.85] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 pt-16">
                <h3 className="text-lg font-bold text-white">
                  {item.title} <span className="font-normal text-white/70">— {item.date}</span>
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-white/70">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Writing section */}
      <section id="writing" className="mt-20">
        <h2 className="font-bold" style={{ fontSize: "25px" }}>writing</h2>

        <ul className="mt-6">
          {blogPosts.map((post, i) => (
            <li
              key={i}
              className="flex items-center justify-between border-b border-border py-3 text-sm"
            >
              <span>{post.title}</span>
              <span className="text-muted-foreground">{post.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-24 border-t border-border pt-8 text-xs text-muted-foreground">
        built by shaoming wu
      </footer>

      {/* Fixed bottom gradient */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-32"
        style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
      />
    </main>
  )
}
