"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { work, bioItems, socials, navItems, blogPosts, type BioSegment } from "@/lib/data"
import { LayoutGrid } from "@/components/layout-grid"

const linkColors = [
  "bg-[#00e5ff]/60",
  "bg-[#76ff03]/55",
  "bg-[#ffea00]/70",
  "bg-[#ff4081]/50",
  "bg-[#d500f9]/40",
  "bg-[#00e5ff]/60",
  "bg-[#ff3d00]/50",
  "bg-[#ffab00]/65",
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

function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggle = () => {
    const isDark = document.documentElement.classList.contains("dark")
    if (isDark) {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      localStorage.setItem("theme", "light")
      setDark(false)
    } else {
      document.documentElement.classList.remove("light")
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setDark(true)
    }
  }

  return (
    <button
      onClick={toggle}
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{ fontSize: "1rem", lineHeight: 1.8 }}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}

function SideNav() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div
      className="fixed z-9999 hidden sm:block"
      style={{
        top: "5.5rem",
        left: "min(calc(100% - 1rem), calc(50% + 26rem))",
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
        <ThemeToggle />
      </div>
    </div>
  )
}

function BioLine({ segments }: { segments: BioSegment[] }) {
  return (
    <li className="flex gap-1.5 items-baseline">
      <svg viewBox="0 0 866 1000" aria-hidden="true" className="relative top-[-1px] h-[6px] w-[5px] shrink-0 fill-foreground">
        <polygon points="0,0 866,500 0,1000" />
      </svg>
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

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  twitter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  ),
  github: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
}


export default function Page() {
  linkColorIndex = 0
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* Layout grid overlay */}
      <LayoutGrid />

      {/* Fixed side nav */}
      <SideNav />

      {/* Header section */}
      <section id="about" className="relative">
        <h1
          data-grid-track="title"
          className="tracking-tight"
          style={{
            fontSize: "clamp(3rem, 7vw, 5rem)",
            fontWeight: 600,
          }}
        >
          shaoming wu
        </h1>

        <ul data-grid-track="bio" className="mt-6 space-y-1.5" style={{ fontSize: "18px" }}>
          {bioItems.map((segments, i) => (
            <BioLine key={i} segments={segments} />
          ))}
        </ul>

        {/* Social links */}
        <div data-grid-track="socials" className="mt-12 flex items-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group/social inline-flex items-center bg-foreground text-background pl-2 pr-1.5 py-0.5 font-medium transition-colors"
              style={{ fontSize: "18px" }}
            >
              <span>{s.label}</span>
              <span className="inline-flex items-center overflow-hidden w-0 opacity-0 transition-all duration-300 ease-out group-hover/social:w-5 group-hover/social:opacity-100 group-hover/social:ml-2.5">
                {socialIcons[s.label]}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Projects section */}
      <section id="projects" className="mt-16">
        <h2 data-grid-track="projects-heading" className="font-bold" style={{ fontSize: "25px", lineHeight: 1 }}>projects</h2>

        <div className="mt-8 flex flex-col gap-5">
          {(() => {
            const rows: (typeof work)[] = []
            for (let i = 0; i < work.length; i += 2) {
              rows.push(work.slice(i, i + 2))
            }
            return rows.map((row, rowIdx) => (
              <div key={rowIdx} data-grid-track="card-row">
                <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-0">

                  {row.map((item, colIdx) => (
                    <article
                      key={item.id}
                      className={`group flex flex-col cursor-pointer ${colIdx === 0 ? "sm:pr-3" : "sm:pl-3"}`}
                      onClick={() => {
                        const href = item.github || item.demo || item.expand
                        if (!href) return
                        if (href.startsWith("http")) {
                          window.open(href, "_blank", "noreferrer,noopener")
                        } else {
                          window.location.href = href
                        }
                      }}
                    >
                      <div data-grid-track="card" className="flex-1 flex flex-col">
                      <div className="relative overflow-hidden">
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
                            <a href={item.github} target="_blank" rel="noreferrer noopener" onClick={(e) => e.stopPropagation()} className="flex size-8 items-center justify-center bg-foreground text-background hover:opacity-80 transition-opacity">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                            </a>
                          )}
                          {item.demo && (
                            <a href={item.demo} target="_blank" rel="noreferrer noopener" onClick={(e) => e.stopPropagation()} className="flex size-8 items-center justify-center bg-foreground text-background hover:opacity-80 transition-opacity">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </a>
                          )}
                          {item.expand && (
                            <Link href={item.expand} onClick={(e) => e.stopPropagation()} className="flex size-8 items-center justify-center bg-foreground text-background hover:opacity-80 transition-opacity">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><line x1="14" y1="10" x2="21" y2="3"/><polyline points="9 21 3 21 3 15"/><line x1="10" y1="14" x2="3" y2="21"/></svg>
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-[3px]">
                        <h3 className="bg-foreground px-2 py-1 text-sm font-normal text-background">{item.title}</h3>
                        <span className="ml-auto bg-foreground px-2 py-1 text-sm text-background">{item.date}</span>
                      </div>
                      <p className="mt-auto flex gap-1.5 px-2 pt-1 pb-1.5 text-xs text-foreground">
                        <span className="select-none text-lg leading-none">‣</span>
                        {item.description}
                      </p>
                      </div>
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
        <h2 data-grid-track="writing-heading" className="font-bold" style={{ fontSize: "25px", lineHeight: 1 }}>writing</h2>

        <ul data-grid-track="writing-list" className="mt-6">
          {blogPosts.map((post, i) => (
            <li
              key={i}
              className="py-3 text-sm"
            >
              <span>{post.title}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-24 pt-8 text-xs text-muted-foreground">
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
