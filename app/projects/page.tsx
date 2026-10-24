import Image from "next/image"
import Link from "next/link"
import { PageShell, SectionsNav } from "@/components/site-header"
import { projects } from "@/lib/data"
import { fs } from "@/lib/utils"

export default function ProjectsPage() {
  return (
    <PageShell nav={<SectionsNav />}>
      <div
        className="mt-8 grid gap-x-8 gap-y-14"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", fontSize: fs(16), lineHeight: 1.6 }}
      >
        {projects.map((item, i) => {
          const href = item.expand || item.github || item.demo
          const external = href?.startsWith("http")

          const card = (
            <article className="flex flex-col gap-3.5">
              {item.image ? (
                <div className="w-full overflow-hidden border-b-2 border-foreground">
                  <Image
                    src={item.image}
                    alt={`${item.title} preview`}
                    width={800}
                    height={533}
                    unoptimized={item.image.endsWith(".gif")}
                    className="aspect-3/2 w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
                  />
                </div>
              ) : (
                <div aria-hidden="true" className="aspect-3/2 w-full border-b-2 border-foreground bg-[#f4f4f4] dark:bg-[#1c1c1c]" />
              )}
              <div className="flex flex-col items-start gap-0.5">
                <span className="trace-underline text-foreground">
                  <strong>{item.title}</strong>
                </span>
                <p className="text-muted-foreground text-pretty">{item.description}</p>
              </div>
            </article>
          )

          const style = { "--i": Math.min(i, 8) } as React.CSSProperties

          if (!href) return <div key={item.id} className="reveal" style={style}>{card}</div>

          return (
            <Link
              key={item.id}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer noopener" : undefined}
              className="group reveal"
              style={style}
            >
              {card}
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}
