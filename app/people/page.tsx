import { BackLink, PageShell } from "@/components/site-header"

type Bubble = {
  left: string
  top: string
  size: string
  logo: boolean
  bg: string
  mark: string
  far: boolean
  z: number
}

// Placeholder constellation: concentric rings of people (circles) and orgs (rounded squares).
// Seeded so server and client render the same layout.
function buildBubbles(): Bubble[] {
  let seed = 11
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  const rings: [number, number][] = [[0.2, 6], [0.42, 11], [0.64, 16], [0.86, 21]]
  const greys = ["#C9C9C9", "#B5B5B5", "#DADADA", "#A3A3A3"]
  const darks = ["#1F1F1F", "#3A3A3A", "#E2E2E2"]
  const out: Bubble[] = []

  for (const [R, n] of rings) {
    const off = rand() * Math.PI
    for (let i = 0; i < n; i++) {
      const a = off + (2 * Math.PI * i) / n + (rand() - 0.5) * 0.35
      const rr = R + (rand() - 0.5) * 0.08
      const d = rand()
      const s = ((36 + 36 * d) / 680) * 100
      const cx = 50 + rr * 50 * Math.cos(a)
      const cy = 50 + rr * 50 * Math.sin(a)
      const logo = rand() < 0.32
      const bg = logo ? darks[Math.floor(rand() * darks.length)] : greys[Math.floor(rand() * greys.length)]
      out.push({
        left: `${(cx - s / 2).toFixed(2)}%`,
        top: `${(cy - s / 2).toFixed(2)}%`,
        size: `${s.toFixed(2)}%`,
        logo,
        bg,
        mark: bg === "#E2E2E2" ? "#9A9A9A" : "#FFFFFF",
        far: d < 0.35,
        z: Math.round(d * 10),
      })
    }
  }
  return out
}

const bubbles = buildBubbles()

export default function PeoplePage() {
  return (
    <PageShell
      nav={
        <nav aria-label="Back" className="reveal flex">
          <BackLink />
        </nav>
      }
    >
      <h1 className="reveal text-[calc(var(--text-scale)*17px)] font-normal" style={{ "--i": 1 } as React.CSSProperties}>
        people that helped me grow
      </h1>
      <div
        role="img"
        aria-label="Photos of mentors and friends, and logos of companies and communities"
        className="reveal relative mx-auto mt-9 aspect-square w-[min(680px,100%)]"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        {bubbles.map((b, i) => (
          <div
            key={i}
            className="absolute flex items-end justify-center overflow-hidden"
            style={{
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              borderRadius: b.logo ? "24%" : "50%",
              background: b.bg,
              filter: b.far ? "blur(3px)" : undefined,
              opacity: b.far ? 0.55 : 1,
              zIndex: b.z,
            }}
          >
            {b.logo ? (
              <div className="m-auto size-[38%] rounded-[22%]" style={{ background: b.mark }} />
            ) : (
              <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true" className="block">
                <circle cx="20" cy="16" r="7" fill="#FFFFFF" fillOpacity="0.6" />
                <path d="M6 40 Q 8 26 20 26 Q 32 26 34 40 Z" fill="#FFFFFF" fillOpacity="0.6" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </PageShell>
  )
}
