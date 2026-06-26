"use client"

import { Mail, Moon, Sun } from "lucide-react"
import type { SVGProps } from "react"
import { useEffect, useState } from "react"
import { coolThings } from "@/lib/portfolio-data"

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  )
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34v-8.2H5.62v8.2h2.72ZM6.98 9c.87 0 1.41-.58 1.41-1.3-.01-.74-.54-1.3-1.39-1.3-.85 0-1.41.56-1.41 1.3 0 .72.54 1.3 1.37 1.3h.02Zm11.36 9.34v-4.7c0-2.52-1.35-3.69-3.14-3.69-1.45 0-2.1.8-2.46 1.36v-1.17H9.99c.04.77 0 8.2 0 8.2h2.75v-4.58c0-.25.02-.49.09-.67.2-.49.65-1 1.4-1 .99 0 1.39.75 1.39 1.86v4.39h2.72Z" />
    </svg>
  )
}

export function ProfileHeader() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
  }, [])

  function toggleTheme() {
    const root = document.documentElement
    const next = !dark
    root.classList.toggle("dark", next)
    root.classList.toggle("light", !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    setDark(next)
  }

  const socials = [
    { href: "https://github.com/shaoming11", label: "GitHub", Icon: GithubIcon },
    { href: "https://linkedin.com/in/shaoming-wu", label: "LinkedIn", Icon: LinkedinIcon },
    { href: "mailto:shaoming.wu@outlook.com", label: "Email", Icon: Mail },
  ]

  return (
    <header>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-pretty text-4xl font-bold tracking-tight sm:text-5xl">Shaoming Wu</h1>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
        </div>
      </div>

      <p className="mt-6 text-lg leading-relaxed">
        {"i'm an incoming student at "}
        <span className="rounded bg-amber-100 px-1 py-0.5 font-medium dark:bg-amber-500/20">@uwaterloo</span>
        {" studying mechatronics engineering and i like to build things."}
      </p>

      <p className="mt-6 font-bold">some cool things i&apos;ve done:</p>
      <ul className="mt-3 space-y-2 text-lg leading-relaxed">
        {coolThings.map((thing, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-muted-foreground" aria-hidden="true">
              •
            </span>
            <span>
              {thing.text}
              {thing.highlight && (
                <span className={`rounded px-1 py-0.5 font-medium ${thing.color}`}>{thing.highlight}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </header>
  )
}
