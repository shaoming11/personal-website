"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Brain, mulberry32, type BrainJSON } from "@/lib/bear/brain"
import { ROCK_H, ROCK_R, World, train, type Episode } from "@/lib/bear/world"
import { VIEW, unproj } from "./rig"
import type { Category } from "./anim"
import { CARD, CardSim } from "./cards"
import { VARIANTS, WorldView, durationsFor, type Picks } from "./scene"

const CATS: { key: Category; title: string; blurb: string }[] = [
  { key: "jump", title: "1 · jump in", blurb: "rock → water. The dive bandit picks where it splashes." },
  { key: "swim", title: "2 · swim", blurb: "Human strokes only. Steering comes from the Q-policy; stroke rate follows speed." },
  { key: "catch", title: "3 · catch", blurb: "Same dash for all ten (physics decides hit/miss). Every 4th loop shows a miss." },
  { key: "eat", title: "4 · eat", blurb: "Treading water, no mouth. Then it swims back to the rock." },
]

// Your picks from round one.
const DEFAULT_PICKS: Picks = { jump: "J4", swim: "S7", catch: "C7", eat: "E3" }
const PICKS_KEY = "bear-lab-picks-v2"
const BRAIN_KEY = "bear-lab-brain"
const STARS_KEY = "bear-lab-stars"

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

function useHiDpiCanvas(w: number, h: number) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const cssW = c.clientWidth
      c.width = Math.round(cssW * dpr)
      c.height = Math.round(((cssW * h) / w) * dpr)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(c)
    return () => ro.disconnect()
  }, [w, h])
  return ref
}

// ------------------------------------------------------------------ full loop

function stats(history: Episode[], n = 50) {
  const h = history.slice(-n)
  const caught = h.filter((e) => e.caught)
  return {
    rate: h.length ? caught.length / h.length : 0,
    time: caught.length ? caught.reduce((s, e) => s + e.swimTime, 0) / caught.length : 0,
    misses: h.length ? h.reduce((s, e) => s + e.misses, 0) / h.length : 0,
  }
}

function Sparkline({ history }: { history: Episode[] }) {
  const ref = useHiDpiCanvas(320, 70)
  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext("2d")
    if (!c || !ctx) return
    ctx.setTransform(c.width / 320, 0, 0, c.height / 70, 0, 0)
    ctx.clearRect(0, 0, 320, 70)
    if (history.length < 2) return
    // rolling time-to-catch (timeouts count as 14s)
    const pts = history.map((e) => (e.caught ? e.swimTime : 14))
    const win = 20
    const roll = pts.map((_, i) => {
      const s = pts.slice(Math.max(0, i - win + 1), i + 1)
      return s.reduce((a, b) => a + b, 0) / s.length
    })
    const stride = Math.max(1, Math.floor(roll.length / 320))
    const ys = roll.filter((_, i) => i % stride === 0)
    ctx.strokeStyle = "rgba(0,0,0,0.12)"
    ctx.beginPath()
    ctx.moveTo(0, 70 - (2 / 14) * 66)
    ctx.lineTo(320, 70 - (2 / 14) * 66)
    ctx.stroke()
    ctx.strokeStyle = "#d0662e"
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ys.forEach((v, i) => {
      const x = (i / Math.max(1, ys.length - 1)) * 320
      const y = 70 - (Math.min(14, v) / 14) * 66 - 2
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  }, [history, ref])
  return <canvas ref={ref} className="block h-auto w-full" />
}

function LoopStage({ picks, setPick }: { picks: Picks; setPick: (c: Category, id: string) => void }) {
  const canvas = useHiDpiCanvas(VIEW.W, VIEW.H)
  const world = useMemo(() => new World(new Brain(), mulberry32((Date.now() & 0xffff) + 1), durationsFor(DEFAULT_PICKS)), [])
  const view = useMemo(() => new WorldView(), [])
  const [speed, setSpeed] = useState(1)
  const [debug, setDebug] = useState(true)
  const [frozen, setFrozen] = useState(false)
  const [, force] = useState(0)
  const picksRef = useRef(picks)
  const speedRef = useRef(speed)
  const debugRef = useRef(debug)
  const drag = useRef<{ what: "fish" | "rock"; x: number; z: number; dx: number; dz: number } | null>(null)

  useEffect(() => {
    picksRef.current = picks
    if (world.phase === "idle") world.durations = durationsFor(picks)
  }, [picks, world])
  useEffect(() => void (speedRef.current = speed), [speed])
  useEffect(() => void (debugRef.current = debug), [debug])
  useEffect(() => void (world.frozen = frozen), [frozen, world])

  useEffect(() => {
    // Brain lives in localStorage between visits (stand-in for the shared crowd brain).
    const saved = load<BrainJSON | null>(BRAIN_KEY, null)
    if (saved) world.brain = Brain.fromJSON(saved)
    force((n) => n + 1)
  }, [world])

  useEffect(() => {
    world.onEpisode = () => {
      if (world.brain.episodes % 5 === 0) save(BRAIN_KEY, world.brain.toJSON())
      force((n) => n + 1)
    }
    world.onPhase = (p) => {
      // Only swap animation timings at a clean boundary.
      if (p === "idle") world.durations = durationsFor(picksRef.current)
    }
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const c = canvas.current
      const ctx = c?.getContext("2d")
      if (c && ctx) {
        const steps = speedRef.current
        for (let i = 0; i < steps; i++) {
          const d = drag.current
          if (d?.what === "fish") world.dragFish(d.x, d.z, dt)
          if (d?.what === "rock") world.dragRock(d.x + d.dx, d.z + d.dz)
          world.step(dt)
        }
        ctx.setTransform(c.width / VIEW.W, 0, 0, c.height / VIEW.H, 0, 0)
        view.render(ctx, world, picksRef.current, dt * steps, debugRef.current)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [world, view, canvas])

  // Pointer -> screen-space logical coords -> pond plane.
  const toScreen = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * VIEW.W, y: ((e.clientY - r.top) / r.height) * VIEW.H }
  }
  const hit = (s: { x: number; y: number }): "fish" | "rock" | null => {
    const f = world.fish
    const onWater = unproj(s.x, s.y)
    const lifted = unproj(s.x, s.y + 10)
    if (f.alive && (Math.hypot(onWater.x - f.x, onWater.z - f.z) < 24 || Math.hypot(lifted.x - f.x, lifted.z - f.z) < 24)) return "fish"
    const r = world.rock
    const mid = unproj(s.x, s.y + ROCK_H * 0.6)
    if (Math.hypot(mid.x - r.x, mid.z - r.z) < ROCK_R * 1.15) return "rock"
    return null
  }
  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = toScreen(e)
    const what = hit(s)
    if (!what) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = unproj(s.x, s.y)
    const r = world.rock
    drag.current = what === "rock" ? { what, ...p, dx: r.x - p.x, dz: r.z - p.z } : { what, ...p, dx: 0, dz: 0 }
  }
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = toScreen(e)
    if (drag.current) Object.assign(drag.current, unproj(s.x, s.y))
    e.currentTarget.style.cursor = drag.current ? "grabbing" : hit(s) ? "grab" : "default"
  }
  const onUp = () => {
    const d = drag.current
    if (!d) return
    drag.current = null
    if (d.what === "fish") world.releaseFish()
    else world.releaseRock()
  }

  const trainN = (n: number) => {
    train(world, n)
    world.durations = durationsFor(picksRef.current)
    save(BRAIN_KEY, world.brain.toJSON())
    force((x) => x + 1)
  }

  // 20 independent visitors each play a few rounds (and fling the fish around),
  // then their brains are merged into the shared one.
  const crowd = () => {
    for (let v = 0; v < 20; v++) {
      const b = new Brain()
      const w = new World(b, mulberry32(Math.floor(Math.random() * 1e9)), world.durations)
      w.chaos = 0.4
      train(w, 15)
      world.brain.merge(b)
      world.history.push(...w.history)
    }
    save(BRAIN_KEY, world.brain.toJSON())
    force((x) => x + 1)
  }

  const reset = () => {
    const b = new Brain()
    world.brain = b
    world.history = []
    save(BRAIN_KEY, b.toJSON())
    force((x) => x + 1)
  }

  const s = stats(world.history)
  const b = world.brain
  const v1 = world.history.length >= 50 ? stats(world.history.slice(0, 50)).rate : null

  return (
    <section className="flex flex-col gap-3">
      <div className="relative">
      <div className="pointer-events-none absolute left-[2.5%] top-[4%] flex items-center gap-2 rounded-full bg-[#ebe2d4] px-3 py-1 text-[12px] font-semibold text-[#4a3a2c]" style={{ fontFamily: "var(--font-onest)" }}>
        <span className="size-2 rounded-full bg-[#6f9a5b]" />
        Policy v{1 + Math.floor(b.episodes / 25)} · catch rate {(s.rate * 100).toFixed(0)}%{v1 !== null ? ` (v1: ${(v1 * 100).toFixed(0)}%)` : ""} · {world.flung.toLocaleString()} fish flung
      </div>
      <canvas
        ref={canvas}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="block h-auto w-full touch-none select-none border border-border"
      />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] leading-6">
        {CATS.map(({ key }) => (
          <label key={key} className="flex items-center gap-1.5">
            <span className="text-muted-foreground">{key}</span>
            <select value={picks[key]} onChange={(e) => setPick(key, e.target.value)} className="border border-border bg-background px-1">
              {VARIANTS[key].map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} · {v.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[12px] leading-6">
        <span className="text-muted-foreground">speed</span>
        {[1, 3, 10].map((n) => (
          <Btn key={n} active={speed === n} onClick={() => setSpeed(n)}>
            {n}×
          </Btn>
        ))}
        <span className="ml-3 text-muted-foreground">train</span>
        <Btn onClick={() => trainN(25)}>+25 eps</Btn>
        <Btn onClick={() => trainN(250)}>+250 eps</Btn>
        <Btn onClick={crowd}>+20 visitors (merge)</Btn>
        <Btn onClick={reset}>reset brain</Btn>
        <span className="ml-3 text-muted-foreground">view</span>
        <Btn active={debug} onClick={() => setDebug(!debug)}>
          debug
        </Btn>
        <Btn active={frozen} onClick={() => setFrozen(!frozen)}>
          freeze learning
        </Btn>
      </div>
      <div className="grid gap-4 text-[12px] leading-5 sm:grid-cols-[1fr_320px]">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4">
          <dt className="text-muted-foreground">episodes</dt>
          <dd>
            {b.episodes} ({b.catches} catches)
          </dd>
          <dt className="text-muted-foreground">ε (explore)</dt>
          <dd>{b.epsilon.toFixed(3)}</dd>
          <dt className="text-muted-foreground">last 50</dt>
          <dd>
            {(s.rate * 100).toFixed(0)}% caught · {s.time.toFixed(2)}s avg swim · {s.misses.toFixed(2)} missed lunges
          </dd>
          <dt className="text-muted-foreground">states seen</dt>
          <dd>{(b.coverage() * 100).toFixed(0)}%</dd>
          <dt className="text-muted-foreground">try</dt>
          <dd>drag the fish (fling it), or drag the rock into the way.</dd>
        </dl>
        <div>
          <div className="text-muted-foreground">time to catch (rolling, lower is better)</div>
          <Sparkline history={world.history.slice(-1500)} />
        </div>
      </div>
    </section>
  )
}

function Btn({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-2 ${active ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
    >
      {children}
    </button>
  )
}

// ------------------------------------------------------------------ cards

const cardRegistry = new Set<{ draw: (dt: number) => void; visible: boolean }>()
let cardRaf = 0
let cardRate = 1 // playback speed for every card (0 = paused)
function startCardLoop() {
  if (cardRaf) return
  let last = performance.now()
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    for (const c of cardRegistry) if (c.visible) c.draw(dt * cardRate)
    cardRaf = requestAnimationFrame(tick)
  }
  cardRaf = requestAnimationFrame(tick)
}

function Card({
  cat,
  id,
  picked,
  starred,
  picks,
  onPick,
  onStar,
}: {
  cat: Category
  id: string
  picked: boolean
  starred: boolean
  picks: Picks
  onPick: () => void
  onStar: () => void
}) {
  const v = VARIANTS[cat].find((x) => x.id === id)!
  const [frames, setFrames] = useState(false)
  const canvas = useHiDpiCanvas(CARD.w, CARD.h)
  const picksRef = useRef(picks)
  useEffect(() => void (picksRef.current = picks), [picks])

  useEffect(() => {
    const sim = new CardSim(cat, v)
    const entry = {
      visible: false,
      draw: (dt: number) => {
        const c = canvas.current
        const ctx = c?.getContext("2d")
        if (!c || !ctx) return
        ctx.setTransform(c.width / CARD.w, 0, 0, c.height / CARD.h, 0, 0)
        sim.draw(ctx, dt, picksRef.current)
      },
    }
    const io = new IntersectionObserver(([e]) => (entry.visible = e.isIntersecting))
    if (canvas.current) io.observe(canvas.current)
    cardRegistry.add(entry)
    startCardLoop()
    return () => {
      io.disconnect()
      cardRegistry.delete(entry)
    }
  }, [cat, v, canvas])

  return (
    <article className={`flex flex-col gap-1.5 border p-2 ${picked ? "border-foreground" : "border-border"}`}>
      <canvas ref={canvas} className="block h-auto w-full" />
      <div className="flex items-baseline justify-between gap-2 text-[12px] leading-5">
        <div>
          <span className="font-semibold">{v.id}</span> · {v.name}
        </div>
        <div className="flex shrink-0 gap-1">
          <button type="button" onClick={onStar} aria-pressed={starred} title="shortlist" className={`px-1 ${starred ? "text-[#d0662e]" : "text-muted-foreground hover:text-foreground"}`}>
            {starred ? "★" : "☆"}
          </button>
          <button
            type="button"
            onClick={onPick}
            className={`border px-1.5 ${picked ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
          >
            {picked ? "in loop" : "use"}
          </button>
        </div>
      </div>
      <p className="text-[11px] leading-4 text-muted-foreground">{v.note}</p>
      <button type="button" onClick={() => setFrames(!frames)} className="self-start text-[11px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        {frames ? "hide frames" : "frames"}
      </button>
      {frames && <Filmstrip cat={cat} id={id} picks={picks} />}
    </article>
  )
}

// Eight stills across the variant, rendered once.
function Filmstrip({ cat, id, picks }: { cat: Category; id: string; picks: Picks }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = ref.current
    if (!host) return
    host.replaceChildren()
    const v = VARIANTS[cat].find((x) => x.id === id)!
    const times = new CardSim(cat, v).frameTimes(8)
    for (const t of times) {
      const c = document.createElement("canvas")
      c.width = CARD.w * 2
      c.height = CARD.h * 2
      c.className = "block h-auto w-full"
      const sim = new CardSim(cat, v)
      // Step up to t so one-shot effects fire in order, then draw the last frame.
      const ctx = c.getContext("2d")!
      ctx.scale(2, 2)
      for (let tt = 0; tt < t - 1 / 30; tt += 1 / 30) sim.draw(ctx, 1 / 30, picks)
      sim.draw(ctx, Math.max(0, t - sim.t), picks)
      host.appendChild(c)
    }
  }, [cat, id, picks])
  return <div ref={ref} className="grid grid-cols-4 gap-1 lg:grid-cols-4" />
}

// ------------------------------------------------------------------ page

export function BearLab() {
  const [picks, setPicks] = useState<Picks>(DEFAULT_PICKS)
  const [stars, setStars] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setPicks({ ...DEFAULT_PICKS, ...load<Partial<Picks>>(PICKS_KEY, {}) })
    setStars(load<string[]>(STARS_KEY, []))
  }, [])

  const setPick = useCallback((cat: Category, id: string) => {
    setPicks((p) => {
      const next = { ...p, [cat]: id }
      save(PICKS_KEY, next)
      return next
    })
  }, [])

  const toggleStar = (id: string) => {
    setStars((s) => {
      const next = s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
      save(STARS_KEY, next)
      return next
    })
  }

  const [rate, setRate] = useState(1)
  useEffect(() => void (cardRate = rate), [rate])

  const summary = `loop: ${picks.jump} / ${picks.swim} / ${picks.catch} / ${picks.eat}${stars.length ? ` · shortlist: ${stars.join(", ")}` : ""}`

  return (
    <div className="min-h-screen bg-background px-5 pb-24 pt-8 text-foreground" style={{ fontFamily: "var(--font-roboto-mono), ui-monospace, Menlo, monospace" }}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-[18px]">bear lab</h1>
          <p className="max-w-[720px] text-[13px] leading-6 text-muted-foreground">
            Animation + RL test bench for the landing-page bear. Pick one variant per pose; the loop up top uses your picks and runs the real learner. ★ to
            shortlist.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <code className="border border-border px-2 py-0.5">{summary}</code>
            <Btn
              onClick={() => {
                navigator.clipboard?.writeText(summary).then(
                  () => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1200)
                  },
                  () => {},
                )
              }}
            >
              {copied ? "copied" : "copy"}
            </Btn>
          </div>
        </header>

        <div className="w-full max-w-[920px]">
          <LoopStage picks={picks} setPick={setPick} />
        </div>

        <div className="sticky top-0 z-10 -my-6 flex items-center gap-2 bg-background py-2 text-[12px]">
          <span className="text-muted-foreground">card playback</span>
          {[0, 0.25, 0.5, 1].map((r) => (
            <Btn key={r} active={rate === r} onClick={() => setRate(r)}>
              {r === 0 ? "pause" : `${r}×`}
            </Btn>
          ))}
        </div>

        {CATS.map(({ key, title, blurb }) => (
          <section key={key} className="flex flex-col gap-3">
            <div>
              <h2 className="text-[15px]">{title}</h2>
              <p className="text-[12px] text-muted-foreground">{blurb}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {VARIANTS[key].map((v) => (
                <Card
                  key={v.id}
                  cat={key}
                  id={v.id}
                  picks={picks}
                  picked={picks[key] === v.id}
                  starred={stars.includes(v.id)}
                  onPick={() => setPick(key, v.id)}
                  onStar={() => toggleStar(v.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
