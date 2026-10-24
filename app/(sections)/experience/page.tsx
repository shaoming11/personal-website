"use client"

import { useState } from "react"
import Image from "next/image"
import { experience, type ExperienceCategory } from "@/lib/data"
import { fs } from "@/lib/utils"

type Filter = "all" | ExperienceCategory

export default function ExperiencePage() {
  const [filter, setFilter] = useState<Filter>("all")

  const visible = experience.filter((item) => filter === "all" || item.category === filter)

  return (
    <>
      <div
        role="group"
        aria-label="Filter experience"
        className="mt-5 flex flex-wrap items-center gap-x-2.5 text-muted-foreground"
        style={{ fontSize: fs(15), lineHeight: 1.6 }}
      >
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          all
        </FilterButton>
        <span aria-hidden="true">·</span>
        <FilterButton active={filter === "work"} onClick={() => setFilter("work")}>
          work
        </FilterButton>
        <span aria-hidden="true">·</span>
        <FilterButton active={filter === "community"} onClick={() => setFilter("community")}>
          community
        </FilterButton>
      </div>

      <div
        className="mt-5 grid gap-x-8 gap-y-14"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", fontSize: fs(16), lineHeight: 1.6 }}
      >
        {visible.map((item) => (
          <article key={item.id} className="group flex flex-col items-start">
            {item.image ? (
              <div className="w-full overflow-hidden border-b-2 border-foreground">
                <Image
                  src={item.image}
                  alt={`${item.company} preview`}
                  width={800}
                  height={533}
                  className="aspect-3/2 w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
                />
              </div>
            ) : (
              <div aria-hidden="true" className="aspect-3/2 w-full border-b-2 border-foreground bg-[#f4f4f4] dark:bg-[#1c1c1c]" />
            )}
            <span
              className={
                item.category === "work"
                  ? "border border-t-0 border-foreground bg-foreground px-[9px] pb-[3px] pt-px text-[calc(var(--text-scale)*13px)] leading-[1.5] text-background"
                  : "border border-t-0 border-foreground bg-background px-[9px] pb-[3px] pt-px text-[calc(var(--text-scale)*13px)] leading-[1.5] text-foreground"
              }
            >
              {item.category}
            </span>
            <div className="mt-3 flex flex-col gap-0.5">
              {item.github || item.demo ? (
                <a href={item.github || item.demo} target="_blank" rel="noreferrer noopener" className="text-foreground">
                  <span className="trace-underline">
                    {item.role} at <strong>{item.company}</strong>
                  </span>
                </a>
              ) : (
                <span className="text-foreground">
                  {item.role} at <strong>{item.company}</strong>
                </span>
              )}
              <p className="text-muted-foreground text-pretty">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "min-h-11 py-0 pr-1 text-foreground underline underline-offset-4"
          : "min-h-11 py-0 pr-1 text-muted-foreground hover:text-foreground"
      }
    >
      {active ? children : <span className="trace-underline">{children}</span>}
    </button>
  )
}
