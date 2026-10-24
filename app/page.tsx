"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PageShell } from "@/components/site-header"
import { featuredProjects, resumeHref, type FeaturedProject } from "@/lib/data"
import { fs } from "@/lib/utils"

function Hi({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground">{children}</span>
}

const inlineLink = "text-foreground underline decoration-foreground/30 underline-offset-4 transition-[text-decoration-color] hover:decoration-foreground"

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={inlineLink}>
      {children}
    </a>
  )
}

// Company name with its logo inline; the logo is sized in em so it tracks the text scale.
function Org({ icon, href, children }: { icon: string; href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={`whitespace-nowrap ${inlineLink}`}>
      <Image src={icon} alt="" width={32} height={32} className="mr-[0.35em] inline-block size-[1.05em] rounded-[3px] object-cover align-[-0.17em]" />
      {children}
    </a>
  )
}

function CodeIcon() {
  return (
    <svg aria-hidden="true" style={{ width: fs(18), height: fs(18) }} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 5 2 9l4 4M12 5l4 4-4 4M10.5 3.5 7.5 14.5" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" style={{ width: fs(14), height: fs(14) }} viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2.5 10.5 10.5 2.5M4.5 2.5h6v6" />
    </svg>
  )
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="flex size-8 items-center justify-center text-foreground hover:opacity-60"
    >
      {children}
    </a>
  )
}

function ProjectTile({ item }: { item: FeaturedProject }) {
  // Media links to the writeup when there is one, otherwise the code.
  const href = item.demo ?? item.code
  return (
    <article className="group flex flex-col gap-2">
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${item.title} project`}
        className="relative block aspect-3/1 overflow-hidden bg-[#d9d9d9] transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[3px] group-hover:bg-[#cdcdcd] group-focus-within:-translate-y-[3px] group-focus-within:bg-[#cdcdcd] dark:bg-[#2a2a2a] dark:group-hover:bg-[#333] dark:group-focus-within:bg-[#333]">
        {item.image && (
          <Image
            src={item.image}
            alt={`${item.title} preview`}
            fill
            sizes="(min-width: 1020px) 320px, 100vw"
            unoptimized={item.image.endsWith(".gif")}
            className="object-cover"
          />
        )}
      </a>
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="text-foreground">{item.title}</span>
          <div className="-mr-2 flex gap-0.5">
            {item.code && (
              <IconLink href={item.code} label={`${item.title} code`}>
                <CodeIcon />
              </IconLink>
            )}
            {item.demo && (
              <IconLink href={item.demo} label={`${item.title} demo`}>
                <ArrowIcon />
              </IconLink>
            )}
          </div>
        </div>
        <span>{item.description}</span>
      </div>
    </article>
  )
}

const headingLink = "block w-fit text-foreground underline underline-offset-[5px]"

export default function AboutPage() {
  const [exp, setExp] = useState(false)

  return (
    <PageShell fit mainClassName="mt-[112px] text-muted-foreground">
      <p className="reveal text-pretty" style={{ "--i": 0 } as React.CSSProperties}>
        I&rsquo;m a <Hi>mechatronics</Hi> student at <Hi>Waterloo</Hi> passionate about <Hi>building and deploying robots</Hi>.
      </p>

      <section
        aria-label="Selected projects"
        className="reveal mt-4"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <Link
          href="/projects"
          className={headingLink}
          style={{ fontSize: fs(16), lineHeight: 2 }}
        >
          projects
        </Link>
        <div
          className="mt-1.5 grid grid-cols-1 gap-x-[30px] gap-y-8 lg:grid-cols-3"
          style={{ fontSize: fs(16), lineHeight: 1.8 }}
        >
          {featuredProjects.map((item) => (
            <ProjectTile key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section
        aria-label="Experience"
        className="reveal mt-[30px] max-w-[640px]"
        style={{ "--i": 2 } as React.CSSProperties}
        onMouseEnter={() => setExp(true)}
        onMouseLeave={() => setExp(false)}
      >
        <Link
          href="/experience"
          className={headingLink}
          style={{ fontSize: fs(16), lineHeight: 2 }}
          onFocus={() => setExp(true)}
          onBlur={() => setExp(false)}
        >
          experience
        </Link>
        <p className={`text-pretty transition-colors duration-300 ${exp ? "text-foreground/80" : "text-muted-foreground"}`}>
          Currently I&rsquo;m optimizing <Hi>diffusion models</Hi> at <Org icon="/icons/icon_mh.png" href="https://magichour.ai">Magic Hour</Org>{" "}
          <Hi>(YC W24)</Hi>, simulating <Hi>humanoids</Hi> at <Org icon="/icons/icon_wato.jpeg" href="https://watonomous.ca">WATonomous</Org>, and leading engineering
          at <Org icon="/icons/icon_ht6.jpeg" href="https://hackthe6ix.com">Hack the 6ix</Org> <Hi>(2000+ applicants, $50k+ in sponsorships)</Hi>. Previously I
          contributed open-source to <Ext href="https://github.com/roboflow/supervision">Supervision</Ext> <Hi>(49k+ stars)</Hi> at <Org icon="/icons/icon_rb.webp" href="https://roboflow.com">Roboflow</Org>. Organized{" "}
          <Org icon="/icons/icon_hc.png" href="https://hackcanada.org">Hack Canada</Org> for <Hi>700+ participants</Hi>.
        </p>
      </section>

      <nav aria-label="Pages" className="reveal mt-6 flex flex-wrap gap-x-[26px]" style={{ "--i": 3 } as React.CSSProperties}>
        {/* TODO: point at the writing page once it exists */}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-foreground underline underline-offset-[5px]">
          writing
        </a>
        <Link href="/people" className="text-foreground underline underline-offset-[5px]">
          people
        </Link>
        <a href={resumeHref} target="_blank" rel="noreferrer noopener" className="text-foreground underline underline-offset-[5px]">
          resume
        </a>
      </nav>
    </PageShell>
  )
}
