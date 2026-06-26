import { awards } from "@/lib/portfolio-data"

const community = [
  {
    role: "Business Development Executive",
    org: "Hack the 6ix",
    location: "Toronto, ON",
    date: "Apr 2026 — Present",
    points: [
      "secured 5+ sponsorship agreements with technology companies through targeted outreach",
      "managed a pipeline of 20+ prospective sponsors, improving response rates by 35%",
    ],
  },
  {
    role: "Outreach Officer",
    org: "Hack Canada",
    location: "Waterloo, ON",
    date: "Sep 2025 — Present",
    points: [
      "contacted 30+ technology companies to build a sponsorship pipeline for a 400-person hackathon",
      "standardized sponsor communication, cutting response-to-confirmation time by 20%",
    ],
  },
  {
    role: "STEM Outreach Coordinator & MC",
    org: "Caution Tape Independent Program",
    location: "Markham, ON",
    date: "Jun 2024 — May 2025",
    points: [
      "led hands-on STEM workshops introducing 10,000+ students to scratch, robotics, and engineering",
      "organized a VEX IQ tournament for 40+ students, managing operations end-to-end",
    ],
  },
]

const education = [
  {
    school: "University of Waterloo",
    program: "BASc., Mechatronics Engineering (Incoming)",
    date: "Sep 2026 — 2031",
  },
  {
    school: "Milliken Mills High School",
    program: "IB Programme",
    date: "Sep 2022 — Jun 2026",
  },
]

export function ExtraSections() {
  return (
    <>
      <section id="community" className="mt-20">
        <h2 className="text-xl font-bold tracking-tight">community involvement</h2>
        <div className="mt-6 space-y-8">
          {community.map((c) => (
            <div key={c.org} className="border-l-2 border-border pl-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-semibold">{c.role}</h3>
                <span className="text-sm text-muted-foreground">{c.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {c.org} · {c.location}
              </p>
              <ul className="mt-2 space-y-1">
                {c.points.map((p, i) => (
                  <li key={i} className="flex gap-2 text-muted-foreground">
                    <span aria-hidden="true">•</span>
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="awards" className="mt-20">
        <h2 className="text-xl font-bold tracking-tight">awards &amp; achievements</h2>
        <ul className="mt-6 divide-y divide-border">
          {awards.map((a) => (
            <li key={a.title} className="flex items-center justify-between gap-4 py-3">
              <span className="font-medium">{a.title}</span>
              <span className="shrink-0 text-sm text-muted-foreground">{a.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="education" className="mt-20">
        <h2 className="text-xl font-bold tracking-tight">education</h2>
        <div className="mt-6 space-y-6">
          {education.map((e) => (
            <div key={e.school} className="flex flex-wrap items-baseline justify-between gap-x-4">
              <div>
                <h3 className="font-semibold">{e.school}</h3>
                <p className="text-sm text-muted-foreground">{e.program}</p>
              </div>
              <span className="text-sm text-muted-foreground">{e.date}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
