"use client"

import { navItems } from "@/lib/portfolio-data"

export function SidebarNav() {
  function handleClick(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <nav
      aria-label="Section navigation"
      className="flex flex-row flex-wrap gap-x-6 gap-y-2 lg:sticky lg:top-12 lg:h-fit lg:flex-col lg:items-end lg:gap-y-8 lg:text-right"
    >
      {navItems.map((item, i) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={`text-base transition-colors hover:text-foreground ${
            i === 0 ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
