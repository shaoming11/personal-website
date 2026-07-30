"use client"

import Image from "next/image"
import { useState } from "react"
import { work, bioItems, socials, navItems, blogPosts, type BioSegment } from "@/lib/data"

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
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div
      className="fixed z-9999 hidden sm:block"
      style={{
        top: "4rem",
        left: "min(calc(100% - 1rem), calc(50% + 26rem))",
        fontFamily: "var(--font-onest)",
      }}
    >
      <div className="flex flex-col items-start gap-1">
        {navItems.map((item) => {
          const isHovered = hovered === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              className="whitespace-nowrap text-left text-muted-foreground"
              style={{
                transition: "font-size 300ms ease-out, font-weight 300ms ease-out, color 300ms ease-out",
                color: isHovered ? "var(--foreground)" : undefined,
                fontSize: isHovered ? "2.5rem" : "1rem",
                fontWeight: isHovered ? 700 : 400,
                lineHeight: 1.8,
              }}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
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
    <main className="mx-auto max-w-3xl px-6 py-16" style={{ fontFamily: "var(--font-onest)" }}>
      {/* Fixed side nav */}
      <SideNav />

      {/* Header section */}
      <section id="about" className="relative">
        <h1
          className="tracking-tight"
          style={{
            fontSize: "clamp(3rem, 7vw, 5rem)",
            fontFamily: "var(--font-onest)",
            fontWeight: 400,
          }}
        >
          shaoming wu
        </h1>

        <ul className="mt-6 space-y-1.5" style={{ fontSize: "18px" }}>
          {bioItems.map((segments, i) => (
            <BioLine key={i} segments={segments} />
          ))}
        </ul>

        {/* Social links */}
        <div className="mt-12 flex items-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-foreground text-background px-4 py-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              {s.label}
            </a>
          ))}
        </div>
      </section>

      {/* Projects section */}
      <section id="projects" className="mt-16">
        <h2 className="font-bold" style={{ fontSize: "25px" }}>projects</h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {work.map((item) => (
            <article key={item.id} className="group">
              <div className="overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={`${item.title} preview`}
                  width={800}
                  height={500}
                  className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-0 flex items-center justify-between bg-foreground px-3 py-1.5">
                <h3 className="text-sm font-bold text-background">{item.title}</h3>
                <span className="text-sm text-background">{item.date}</span>
              </div>
              <p className="mt-1 flex gap-1.5 text-xs text-muted-foreground">
                <span className="select-none">‣</span>
                {item.description}
              </p>
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
