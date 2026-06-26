"use client"

import Image from "next/image"
import { work, type WorkItem } from "@/lib/portfolio-data"

export function WorkGrid() {
  return (
    <section id="experience" className="mt-12">
      <h2 className="text-xl font-bold tracking-tight">projects</h2>

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
        {work.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

function Card({ item }: { item: WorkItem }) {
  return (
    <article className="group">
      <div className="overflow-hidden rounded-xl border border-border bg-muted">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={`${item.title} preview`}
          width={800}
          height={500}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
        <span className="shrink-0 text-sm text-muted-foreground">{item.label}</span>
      </div>
      {item.stack && <p className="mt-1 font-mono text-xs text-muted-foreground">{item.stack}</p>}
      <p className="mt-2 leading-relaxed text-muted-foreground">{item.description}</p>
    </article>
  )
}
