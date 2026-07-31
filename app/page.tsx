"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { work, bioItems, socials, navItems, blogPosts, type BioSegment } from "@/lib/data"

const linkColors = [
  "bg-[#00ffff]/40",
  "bg-[#39ff14]/40",
  "bg-[#ffff00]/40",
  "bg-[#ff6ec7]/40",
  "bg-[#bf00ff]/40",
  "bg-[#00ffff]/40",
  "bg-[#ff073a]/40",
  "bg-[#ff9500]/40",
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
      <span className={`absolute inset-0 -mx-0.5 ${colorClass} origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/link:scale-x-100`} />
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
              className="bg-foreground text-background px-2 py-0.5 font-medium hover:opacity-80 transition-opacity"
              style={{ fontSize: "18px" }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </section>

      {/* Projects section */}
      <section id="projects" className="mt-16">
        <h2 className="font-bold" style={{ fontSize: "25px", lineHeight: 1 }}>projects</h2>

        <div className="mt-8 flex flex-col">
          {(() => {
            const rows: (typeof work)[] = []
            for (let i = 0; i < work.length; i += 2) {
              rows.push(work.slice(i, i + 2))
            }
            return rows.map((row, rowIdx) => (
              <div key={rowIdx}>
                <div className="relative grid grid-cols-1 sm:grid-cols-2">

                  {row.map((item, colIdx) => (
                    <article key={item.id} className={`group ${colIdx === 0 ? "sm:pr-3" : "sm:pl-3"}`}>
                      <div className="relative overflow-hidden mt-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={`${item.title} preview`}
                          width={800}
                          height={500}
                          className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Hover icons */}
                        <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                          {item.github && (
                            <a href={item.github} target="_blank" rel="noreferrer noopener" className="flex size-8 items-center justify-center bg-foreground text-background hover:opacity-80 transition-opacity">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                            </a>
                          )}
                          {item.demo && (
                            <a href={item.demo} target="_blank" rel="noreferrer noopener" className="flex size-8 items-center justify-center bg-foreground text-background hover:opacity-80 transition-opacity">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </a>
                          )}
                          {item.expand && (
                            <Link href={item.expand} className="flex size-8 items-center justify-center bg-foreground text-background hover:opacity-80 transition-opacity">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><line x1="14" y1="10" x2="21" y2="3"/><polyline points="9 21 3 21 3 15"/><line x1="10" y1="14" x2="3" y2="21"/></svg>
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <h3 className="flex-1 bg-foreground px-3 py-1.5 text-sm font-bold text-background">{item.title}</h3>
                        <span className="bg-foreground px-3 py-1.5 text-sm text-background border-l border-background/20">{item.date}</span>
                      </div>
                      <p className="mt-1 flex gap-1.5 px-2 py-1 pb-4 text-xs text-muted-foreground">
                        <span className="select-none text-lg leading-none">‣</span>
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ))
          })()}
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
