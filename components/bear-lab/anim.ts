import { type Vec3 } from "@/lib/bear/world"
import { SHOULDER_F, SHOULDER_N, pose, proj, reachArm, screenFace, type Emit, type HeldFish, type Pose } from "./rig"

export interface AnimCtx {
  u: number // 0..1 progress (timed animations)
  pu: number // previous frame's u, for one-shot effects
  t: number // seconds into the animation
  dt: number
  from: Vec3 // jump: standing on the rock. catch: anchor at lunge start
  to: Vec3 // jump: splash point
  anchor: Vec3 // physics position this frame
  heading: number // plane heading
  speed: number
  success: boolean | null // catch: null until the paws close
  fx: Emit
  rand: () => number
}

export type Category = "jump" | "swim" | "catch" | "eat"

export interface Variant {
  id: string
  name: string
  note: string
  duration: number // seconds; swim ignores it (driven by physics)
  pose(c: AnimCtx): Pose
}

// ---- timing ----
export const crossed = (c: AnimCtx, m: number) => c.pu < m && c.u >= m
export const every = (c: AnimCtx, period: number, phase = 0) =>
  Math.floor((c.t - phase) / period) !== Math.floor((c.t - c.dt - phase) / period)
export const seg = (u: number, a: number, b: number) => Math.max(0, Math.min(1, (u - a) / (b - a)))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const easeOut = (t: number) => 1 - (1 - t) * (1 - t)
export const easeIn = (t: number) => t * t
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
export const bump = (t: number) => Math.sin(Math.PI * Math.max(0, Math.min(1, t)))
export const TAU = Math.PI * 2

// ---- motion ----
// Along the ground from a to b with a parabolic hop of `peak`.
export function hop(a: Vec3, b: Vec3, k: number, peak: number): Vec3 {
  return { x: lerp(a.x, b.x, k), z: lerp(a.z, b.z, k), h: lerp(a.h, b.h, k) + 4 * peak * k * (1 - k) }
}

export const strokeRate = (c: AnimCtx, base = 5) => base + c.speed * 0.04

// Lying prone at the surface, head up, legs trailing. Arm angle PI = reaching ahead,
// PI/2 = pulling down through the water, 0 = back at the hip, -PI/2 = up in the air.
export function prone(c: AnimCtx, extra: Partial<Pose> = {}): Pose {
  return pose({
    x: c.anchor.x,
    z: c.anchor.z,
    h: c.anchor.h + 4,
    face: screenFace(c.heading),
    rot: 1.3,
    headRot: -1.0,
    armN: Math.PI,
    elbowN: 0,
    armF: Math.PI,
    elbowF: 0,
    legN: 0.1,
    legF: -0.1,
    ...extra,
  })
}

// On the back at the surface, head leading. Face is flipped so the head points the way
// the bear is moving.
export function supine(c: AnimCtx, extra: Partial<Pose> = {}): Pose {
  return pose({
    x: c.anchor.x,
    z: c.anchor.z,
    h: c.anchor.h + 2,
    face: (-screenFace(c.heading)) as 1 | -1,
    rot: -1.35,
    headRot: 0.55,
    armN: 0,
    elbowN: 0,
    armF: 0,
    elbowF: 0,
    legN: 0,
    legF: 0,
    ...extra,
  })
}

// Upright, treading water: chest-deep, legs slowly cycling.
export function tread(c: AnimCtx, extra: Partial<Pose> = {}): Pose {
  const w = c.t * 3
  return pose({
    x: c.anchor.x,
    z: c.anchor.z,
    h: c.anchor.h + Math.sin(c.t * 2) * 1.2,
    face: screenFace(c.heading),
    legN: 0.5 + Math.sin(w) * 0.4,
    kneeN: 0.6 + Math.cos(w) * 0.3,
    legF: 0.5 + Math.sin(w + Math.PI) * 0.4,
    kneeF: 0.6 + Math.cos(w + Math.PI) * 0.3,
    ...extra,
  })
}

// Both paws on a fish at a bear-local spot.
export function holding(p: Pose, fish: HeldFish, oneHand = false): Pose {
  const n = reachArm(SHOULDER_N, { x: fish.x - 3, y: fish.y + 2 })
  const out: Pose = { ...p, armN: n.a, elbowN: n.e, fish }
  if (!oneHand) {
    const f = reachArm(SHOULDER_F, { x: fish.x + 4, y: fish.y + 1 })
    out.armF = f.a
    out.elbowF = f.e
  }
  return out
}

// ---- effects ----
export function splash(c: AnimCtx, x: number, z: number, n: number, power = 1) {
  const s = proj(x, z, 0)
  for (let i = 0; i < n; i++) {
    c.fx({
      kind: "drop",
      x: s.x + (c.rand() - 0.5) * 18,
      y: s.y - 1,
      floor: s.y + (c.rand() - 0.3) * 8,
      vx: (c.rand() - 0.5) * 150 * power,
      vy: -(110 + c.rand() * 170) * power,
      size: 1.5 + c.rand() * 2,
      life: 1.4,
    })
  }
  c.fx({ kind: "ripple", x: s.x, y: s.y, size: n > 5 ? 6 : 2, life: n > 5 ? 1.1 : 0.7 })
  if (n > 5) c.fx({ kind: "ripple", x: s.x, y: s.y, size: 1, life: 1.5 })
}

export function drip(c: AnimCtx, x: number, z: number, h: number) {
  const s = proj(x, z, h)
  c.fx({ kind: "drop", x: s.x + (c.rand() - 0.5) * 10, y: s.y, floor: proj(x, z, 0).y, vx: (c.rand() - 0.5) * 20, vy: 0, size: 1.4, life: 1 })
}

export function say(c: AnimCtx, x: number, z: number, h: number, text: string, size = 10) {
  const s = proj(x, z, h)
  c.fx({ kind: "text", x: s.x, y: s.y, vy: -24, text, size, life: 1.1 })
}

// Shared "missed it" reaction on top of any catch variant: empty paws, a beat, "…".
export function missed(c: AnimCtx, p: Pose, at = 0.4): Pose {
  if (c.success !== false) return p
  const k = seg(c.u, at, 1)
  if (crossed(c, Math.max(at, 0.42))) say(c, c.anchor.x, c.anchor.z, c.anchor.h + 52, "…", 13)
  return { ...p, eyes: k < 0.45 ? "open" : "meh", look: k < 0.45 ? 0 : -0.8, fish: null }
}

// A little foam ripple behind the bear as it moves.
export function wake(c: AnimCtx, back = 26) {
  const s = proj(c.anchor.x - Math.cos(c.heading) * back, c.anchor.z - Math.sin(c.heading) * back, 0)
  c.fx({ kind: "ripple", x: s.x + (c.rand() - 0.5) * 6, y: s.y, size: 1.5 + c.rand(), life: 0.8 })
}
