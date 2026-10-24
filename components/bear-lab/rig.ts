// Isometric pond + an upright, outlined puppet bear. Animation variants only return a
// Pose; this file is the one place that knows how to draw a bear, fish, rock and water.

import { POND, ROCK_H, ROCK_R } from "@/lib/bear/world"

// ---------------------------------------------------------------- projection

export const VIEW = { W: 560, H: 430, ox: 236, oy: 84 }
const CX = 0.866
const CY = 0.5

export function proj(x: number, z: number, h = 0) {
  return { x: VIEW.ox + (x - z) * CX, y: VIEW.oy + (x + z) * CY - h }
}

// Screen point -> pond plane (at the water surface).
export function unproj(sx: number, sy: number) {
  const a = (sx - VIEW.ox) / CX
  const b = (sy - VIEW.oy) / CY
  return { x: (a + b) / 2, z: (b - a) / 2 }
}

// Which way the bear's profile points on screen for a plane heading.
export function screenFace(heading: number): 1 | -1 {
  return Math.cos(heading) - Math.sin(heading) >= 0 ? 1 : -1
}

// An iso circle of radius r projects to an axis-aligned ellipse.
export const isoRx = (r: number) => r * 1.2247
export const isoRy = (r: number) => r * 0.7071

// ---------------------------------------------------------------- pose

export type Eyes = "meh" | "open" | "closed" | "wide" | "squint"

export interface HeldFish {
  x: number // bear-local, facing right, y down
  y: number
  rot: number
  bites?: number // 0..3
  scale?: number
  bones?: boolean
  behind?: boolean // draw behind the head (being swallowed)
}

export interface Pose {
  x: number // world anchor = body center
  z: number
  h: number
  face: 1 | -1
  rot: number // + = lean toward the face
  sx: number
  sy: number
  headRot: number // + = chin down
  headX: number
  headY: number
  eyes: Eyes
  look: number // pupil shift, -1..1
  ears: number
  // limb angles: 0 = straight down, + = swung toward the face, PI = overhead
  armN: number
  elbowN: number
  armF: number
  elbowF: number
  legN: number
  kneeN: number // + = shin folds back
  legF: number
  kneeF: number
  fish: HeldFish | null
}

export const BASE: Pose = {
  x: 0,
  z: 0,
  h: 0,
  face: 1,
  rot: 0,
  sx: 1,
  sy: 1,
  headRot: 0,
  headX: 0,
  headY: 0,
  eyes: "meh",
  look: 0,
  ears: 0,
  armN: 0.15,
  elbowN: 0.25,
  armF: 0.1,
  elbowF: 0.25,
  legN: 0,
  kneeN: 0,
  legF: 0,
  kneeF: 0,
  fish: null,
}

export function pose(p: Partial<Pose>): Pose {
  return { ...BASE, ...p }
}

// ---------------------------------------------------------------- skeleton (bear-local)

// Chubby bean: head sits straight on the body, no neck; short stubby legs.
export const SHOULDER_N = { x: 11, y: -7 }
export const SHOULDER_F = { x: -6, y: -9 }
const HIP_N = { x: 9, y: 24 }
const HIP_F = { x: -8, y: 23 }
const NECK = { x: 3, y: -18 }
const HEAD_OFF = { x: 3, y: -11 }
const UPPER = 10
const FORE = 9.5
const THIGH = 6.5
const SHIN = 6.5

function fk(at: { x: number; y: number }, a: number, e: number, l1: number, l2: number) {
  const mid = { x: at.x + Math.sin(a) * l1, y: at.y + Math.cos(a) * l1 }
  return { mid, tip: { x: mid.x + Math.sin(a + e) * l2, y: mid.y + Math.cos(a + e) * l2 } }
}

export function pawN(p: Pose) {
  return fk(SHOULDER_N, p.armN, p.elbowN, UPPER, FORE).tip
}
export function pawF(p: Pose) {
  return fk(SHOULDER_F, p.armF, p.elbowF, UPPER, FORE).tip
}

export function headCenter(p: Pick<Pose, "headRot" | "headX" | "headY">) {
  const c = Math.cos(p.headRot)
  const s = Math.sin(p.headRot)
  const ox = HEAD_OFF.x + p.headX
  const oy = HEAD_OFF.y + p.headY
  return { x: NECK.x + ox * c - oy * s, y: NECK.y + ox * s + oy * c }
}

// Just under the snout, where food goes.
export function snoutAt(p: Pick<Pose, "headRot" | "headX" | "headY">) {
  const h = headCenter(p)
  const c = Math.cos(p.headRot)
  const s = Math.sin(p.headRot)
  return { x: h.x + 15 * c - 7 * s, y: h.y + 15 * s + 7 * c }
}

// Bear-local -> screen point.
export function localToScreen(p: Pose, lx: number, ly: number) {
  const a = proj(p.x, p.z, p.h)
  const x = lx * p.sx
  const y = ly * p.sy
  const c = Math.cos(p.rot)
  const s = Math.sin(p.rot)
  return { x: a.x + p.face * (x * c - y * s), y: a.y + (x * s + y * c) }
}

// Two-bone IK: arm angle + elbow bend that put the paw on a local target.
export function reachArm(shoulder: { x: number; y: number }, target: { x: number; y: number }) {
  const dx = target.x - shoulder.x
  const dy = target.y - shoulder.y
  const d = Math.max(2, Math.min(UPPER + FORE - 0.01, Math.hypot(dx, dy)))
  const base = Math.atan2(dx, dy)
  const cosE = (UPPER * UPPER + FORE * FORE - d * d) / (2 * UPPER * FORE)
  const e = Math.PI - Math.acos(Math.max(-1, Math.min(1, cosE)))
  const cosA = (UPPER * UPPER + d * d - FORE * FORE) / (2 * UPPER * d)
  const off = Math.acos(Math.max(-1, Math.min(1, cosA)))
  return { a: base - off, e }
}

// ---------------------------------------------------------------- palette

export const PALETTE = {
  ink: "#151515",
  fur: "#8a5f3e",
  furDark: "#6f4b30",
  belly: "#a97f5a",
  snout: "#d8b48c",
  nose: "#33221a",
  innerEar: "#d2ad87",
  bandana: "#d4a24a",
  bandanaDark: "#b98a34",
  water: "#8db8cb",
  waterBack: "#a3c8d8",
  waterSideL: "#6f9db3",
  waterSideR: "#5d8ba2",
  soilL: "#b39876",
  soilR: "#9a7f5e",
  sheen: "rgba(255,255,255,0.75)",
  rock: "#9b968e",
  rockLight: "#b3aea5",
  rockDark: "#837e76",
  fish: "#e2876a",
  fishDark: "#c96a4e",
  fishBelly: "#f6c2a6",
  bone: "#f4eee2",
}

// ---------------------------------------------------------------- bear

const BOX = 220 // offscreen size in local units; the bear sits at its center
let bufs: { a: HTMLCanvasElement; b: HTMLCanvasElement; c: HTMLCanvasElement } | null = null

function buffers(px: number) {
  if (!bufs) bufs = { a: document.createElement("canvas"), b: document.createElement("canvas"), c: document.createElement("canvas") }
  for (const k of ["a", "b", "c"] as const) {
    if (bufs[k].width !== px) {
      bufs[k].width = px
      bufs[k].height = px
    }
  }
  return bufs
}

// Draws the bear with a solid outline; anything below the water surface is tinted.
export function drawBear(ctx: CanvasRenderingContext2D, p: Pose) {
  const m = ctx.getTransform()
  const s = Math.hypot(m.a, m.b)
  const px = Math.ceil(BOX * s)
  const { a, b, c } = buffers(px)
  const half = (BOX / 2) * s

  const actx = a.getContext("2d")!
  actx.setTransform(1, 0, 0, 1, 0, 0)
  actx.clearRect(0, 0, px, px)
  actx.setTransform(s, 0, 0, s, half, half)
  drawParts(actx, p)

  const bctx = b.getContext("2d")!
  bctx.setTransform(1, 0, 0, 1, 0, 0)
  bctx.globalCompositeOperation = "source-over"
  bctx.clearRect(0, 0, px, px)
  bctx.drawImage(a, 0, 0)
  bctx.globalCompositeOperation = "source-in"
  bctx.fillStyle = PALETTE.ink
  bctx.fillRect(0, 0, px, px)
  bctx.globalCompositeOperation = "source-over"

  const cctx = c.getContext("2d")!
  cctx.setTransform(1, 0, 0, 1, 0, 0)
  cctx.globalCompositeOperation = "source-over"
  cctx.clearRect(0, 0, px, px)
  const o = 2.2 * s
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2
    cctx.drawImage(b, Math.cos(ang) * o, Math.sin(ang) * o)
  }
  cctx.drawImage(a, 0, 0)

  // Underwater tint, in screen space: the surface sits p.h below the body center.
  if (p.h < BOX / 2) {
    const wy = half + p.h * s
    cctx.globalCompositeOperation = "source-atop"
    const g = cctx.createLinearGradient(0, wy, 0, wy + 14 * s)
    g.addColorStop(0, "rgba(128,180,202,0.8)")
    g.addColorStop(1, "rgba(130,180,202,0.97)")
    cctx.fillStyle = g
    cctx.fillRect(0, wy, px, px)
    cctx.fillStyle = "rgba(255,255,255,0.75)"
    cctx.fillRect(0, wy - 0.7 * s, px, 1.4 * s)
    cctx.globalCompositeOperation = "source-over"
  }

  const at = proj(p.x, p.z, p.h)
  const dx = m.a * at.x + m.c * at.y + m.e
  const dy = m.b * at.x + m.d * at.y + m.f
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.drawImage(c, Math.round(dx - half), Math.round(dy - half))
  ctx.restore()
}

function drawParts(ctx: CanvasRenderingContext2D, p: Pose) {
  ctx.scale(p.face, 1)
  ctx.rotate(p.rot)
  ctx.scale(p.sx, p.sy)
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  arm(ctx, SHOULDER_F, p.armF, p.elbowF, PALETTE.furDark, false)
  leg(ctx, HIP_F, p.legF, p.kneeF, PALETTE.furDark, false)

  // tail nub
  circle(ctx, -25, 12, 5.5, PALETTE.fur)

  // body: a pear that widens toward the bottom, merging into the head
  ctx.fillStyle = PALETTE.fur
  ctx.beginPath()
  ctx.ellipse(0, 8, 25.5, 25, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(3, -8, 18, 18, 0, 0, Math.PI * 2)
  ctx.fill()

  leg(ctx, HIP_N, p.legN, p.kneeN, PALETTE.fur, true)

  if (p.fish?.behind) drawHeld(ctx, p.fish)

  // head
  ctx.save()
  const hc = headCenter(p)
  ctx.translate(hc.x, hc.y)
  ctx.rotate(p.headRot)
  // Belly-up poses flip the body; keep the face the right way up.
  if (p.sy < 0) ctx.scale(1, -1)
  drawHead(ctx, p)
  ctx.restore()

  // bandana, tied where head meets body
  ctx.fillStyle = PALETTE.bandana
  ctx.beginPath()
  ctx.moveTo(-9, -17)
  ctx.quadraticCurveTo(4, -12, 16, -16)
  ctx.lineTo(7, -3)
  ctx.closePath()
  ctx.fill()
  circle(ctx, 5, -14, 2.3, PALETTE.bandanaDark)

  if (p.fish && !p.fish.behind) drawHeld(ctx, p.fish)
  arm(ctx, SHOULDER_N, p.armN, p.elbowN, PALETTE.fur, true)
}

function drawHeld(ctx: CanvasRenderingContext2D, f: HeldFish) {
  ctx.save()
  ctx.translate(f.x, f.y)
  ctx.rotate(f.rot)
  const s = f.scale ?? 1
  ctx.scale(s, s)
  drawFishBody(ctx, f.bites ?? 0, f.bones ?? false, 0)
  ctx.restore()
}

function drawHead(ctx: CanvasRenderingContext2D, p: Pose) {
  for (const [x, y, tilt] of [
    [-6, -13, -0.2],
    [7, -14, 0.25],
  ]) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(tilt + p.ears * 0.3 * Math.sign(tilt))
    circle(ctx, 0, 0, 4.6, PALETTE.fur)
    ctx.restore()
  }
  circle(ctx, 0, 0, 15, PALETTE.fur)

  // snout bump with a big dark nose at the tip; no mouth, on purpose
  ell(ctx, 11, 2, 9, 7.5, -0.15, PALETTE.fur)
  ctx.save()
  ctx.translate(17, -0.5)
  ctx.rotate(0.25)
  ell(ctx, 0, 0, 5, 3.4, 0, PALETTE.nose)
  ctx.restore()

  eye(ctx, 6, -6, 1.8, p)
  eye(ctx, -3, -5, 1.6, p)
}

function eye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, p: Pose) {
  ctx.strokeStyle = PALETTE.ink
  ctx.lineWidth = 1.3
  const lx = x + p.look * 1.1
  switch (p.eyes) {
    case "meh":
      // half-lidded: dot with a flat lid across the top
      circle(ctx, lx, y + 0.6, r, PALETTE.ink)
      ctx.fillStyle = PALETTE.fur
      ctx.fillRect(x - r - 1.6, y - r - 1.6, r * 2 + 3.2, r + 1.2)
      ctx.beginPath()
      ctx.moveTo(x - r - 0.6, y - 0.4)
      ctx.lineTo(x + r + 0.6, y - 0.4)
      ctx.stroke()
      break
    case "open":
      circle(ctx, lx, y, r, PALETTE.ink)
      break
    case "wide":
      circle(ctx, lx, y, r * 1.5, PALETTE.ink)
      circle(ctx, lx + 0.6, y - 0.7, r * 0.45, "#fff")
      break
    case "closed":
      ctx.beginPath()
      ctx.moveTo(x - r - 0.6, y + 0.4)
      ctx.lineTo(x + r + 0.6, y + 0.4)
      ctx.stroke()
      break
    case "squint":
      ctx.beginPath()
      ctx.moveTo(x - r - 0.6, y - 0.8)
      ctx.lineTo(x + r + 0.6, y + 0.4)
      ctx.stroke()
      break
  }
}

// Near limbs get an ink edge so they read on top of the body; far ones rely on the silhouette.
function arm(ctx: CanvasRenderingContext2D, at: { x: number; y: number }, a: number, e: number, color: string, edged: boolean) {
  const { mid, tip } = fk(at, a, e, UPPER, FORE)
  const path = () => {
    ctx.beginPath()
    ctx.moveTo(at.x, at.y)
    ctx.lineTo(mid.x, mid.y)
    ctx.lineTo(tip.x, tip.y)
  }
  if (edged) {
    ctx.strokeStyle = PALETTE.ink
    ctx.lineWidth = 11.4
    path()
    ctx.stroke()
  }
  ctx.strokeStyle = color
  ctx.lineWidth = 9
  path()
  ctx.stroke()
  if (edged) {
    // re-cover the shoulder so the arm grows out of the body
    circle(ctx, at.x, at.y, 5.4, color)
    // two little claw lines
    ctx.strokeStyle = PALETTE.ink
    ctx.lineWidth = 0.9
    const d = { x: Math.sin(a + e), y: Math.cos(a + e) }
    for (const off of [-1.6, 1.6]) {
      ctx.beginPath()
      ctx.moveTo(tip.x + d.x * 1.5 - d.y * off, tip.y + d.y * 1.5 + d.x * off)
      ctx.lineTo(tip.x + d.x * 4.2 - d.y * off, tip.y + d.y * 4.2 + d.x * off)
      ctx.stroke()
    }
  }
}

function leg(ctx: CanvasRenderingContext2D, at: { x: number; y: number }, a: number, k: number, color: string, edged: boolean) {
  const { mid, tip } = fk(at, a, -k, THIGH, SHIN)
  const fa = a - k
  const draw = (w: number, c: string, footGrow: number) => {
    ctx.strokeStyle = c
    ctx.lineWidth = w
    ctx.beginPath()
    ctx.moveTo(at.x, at.y)
    ctx.lineTo(mid.x, mid.y)
    ctx.lineTo(tip.x, tip.y)
    ctx.stroke()
    // stubby foot pointing toward the face side
    ell(ctx, tip.x + Math.cos(fa) * 3, tip.y - Math.sin(fa) * 3 + 2, 7.5 + footGrow, 4.5 + footGrow, -fa, c)
  }
  if (edged) draw(15.4, PALETTE.ink, 1.2)
  draw(13, color, 0)
  if (edged) circle(ctx, at.x, at.y - 3, 6.5, color)
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function ell(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2)
  ctx.fill()
}

// ---------------------------------------------------------------- fish

export function drawFishBody(ctx: CanvasRenderingContext2D, bites: number, bones: boolean, t: number) {
  const tail = Math.sin(t * 14) * 0.35
  if (bones) {
    ctx.strokeStyle = PALETTE.bone
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(-9, 0)
    ctx.lineTo(7, 0)
    for (let i = -6; i <= 4; i += 3.3) {
      ctx.moveTo(i, -4)
      ctx.lineTo(i, 4)
    }
    ctx.stroke()
    ell(ctx, 9, 0, 4, 3.6, 0, PALETTE.bone)
    ctx.fillStyle = PALETTE.bone
    ctx.beginPath()
    ctx.moveTo(-9, 0)
    ctx.lineTo(-15, -5)
    ctx.lineTo(-15, 5)
    ctx.closePath()
    ctx.fill()
    circle(ctx, 10, -1, 1, PALETTE.ink)
    return
  }
  ctx.save()
  if (bites > 0) {
    ctx.beginPath()
    ctx.rect(-20, -12, 40, 24)
    const at = [
      [12, -3, 5],
      [8, 4, 5],
      [3, -4, 6],
    ]
    for (let i = 0; i < Math.min(3, bites); i++) {
      const [bx, by, br] = at[i]
      ctx.moveTo(bx + br, by)
      ctx.arc(bx, by, br, 0, Math.PI * 2, true)
    }
    ctx.clip("evenodd")
  }
  ctx.save()
  ctx.translate(-10, 0)
  ctx.rotate(tail)
  ctx.fillStyle = PALETTE.fishDark
  ctx.beginPath()
  ctx.moveTo(1, 0)
  ctx.lineTo(-8, -6)
  ctx.lineTo(-6, 0)
  ctx.lineTo(-8, 6)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
  ell(ctx, 0, 0, 11.5, 6, 0, PALETTE.fish)
  ell(ctx, 1, 2.6, 7, 2.3, 0, PALETTE.fishBelly)
  ctx.fillStyle = PALETTE.fishDark
  ctx.beginPath()
  ctx.moveTo(-2, -5.5)
  ctx.lineTo(1, -10)
  ctx.lineTo(4, -5.5)
  ctx.fill()
  if (bites < 1) circle(ctx, 6.5, -1.4, 1.4, PALETTE.ink)
  ctx.restore()
}

// A swimming fish in the pond: faded under the surface, full color when lifted by a drag.
export function drawFish(ctx: CanvasRenderingContext2D, x: number, z: number, vx: number, vz: number, t: number, lifted: boolean) {
  const h = lifted ? 12 + Math.sin(t * 9) * 2 : -7
  const at = proj(x, z, h)
  const dx = (vx - vz) * CX
  const dy = (vx + vz) * CY
  ctx.save()
  const ground = proj(x, z)
  ctx.globalAlpha = lifted ? 0.18 : 0.22
  ell(ctx, ground.x, ground.y + 2, 13, 4.5, 0, "#3d6a80")
  ctx.globalAlpha = lifted ? 1 : 0.7
  ctx.translate(at.x, at.y)
  ctx.scale(dx < 0 ? -1 : 1, 1)
  ctx.rotate(Math.max(-0.5, Math.min(0.5, Math.atan2(dy, Math.abs(dx) + 1e-3))))
  drawFishBody(ctx, 0, false, t * (lifted ? 2 : 1))
  ctx.restore()
}

// ---------------------------------------------------------------- pond

const SLAB = 30
const SOIL = 9

export function drawPond(ctx: CanvasRenderingContext2D) {
  const c00 = proj(0, 0)
  const c10 = proj(POND.X, 0)
  const c11 = proj(POND.X, POND.Z)
  const c01 = proj(0, POND.Z)
  const down = (p: P, d: number) => ({ x: p.x, y: p.y + d })

  // sides: water, then a strip of soil underneath
  quad(ctx, c01, c11, down(c11, SLAB), down(c01, SLAB), PALETTE.waterSideL)
  quad(ctx, c11, c10, down(c10, SLAB), down(c11, SLAB), PALETTE.waterSideR)
  quad(ctx, down(c01, SLAB), down(c11, SLAB), down(c11, SLAB + SOIL), down(c01, SLAB + SOIL), PALETTE.soilL)
  quad(ctx, down(c11, SLAB), down(c10, SLAB), down(c10, SLAB + SOIL), down(c11, SLAB + SOIL), PALETTE.soilR)

  const g = ctx.createLinearGradient(c00.x, c00.y, c11.x, c11.y)
  g.addColorStop(0, PALETTE.waterBack)
  g.addColorStop(1, PALETTE.water)
  quad(ctx, c00, c10, c11, c01, g)

  // rim highlight on the two front edges
  ctx.strokeStyle = PALETTE.sheen
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(c01.x, c01.y)
  ctx.lineTo(c11.x, c11.y)
  ctx.lineTo(c10.x, c10.y)
  ctx.stroke()
}

type P = { x: number; y: number }

function quad(ctx: CanvasRenderingContext2D, a: P, b: P, c: P, d: P, fill: string | CanvasGradient) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.lineTo(c.x, c.y)
  ctx.lineTo(d.x, d.y)
  ctx.closePath()
  ctx.fill()
}

// Calm wavelets: little arcs that drift slowly across the pond and fade in and out.
export class Wavelets {
  list: { x: number; z: number; age: number; life: number; w: number }[] = []
  constructor(n = 16) {
    for (let i = 0; i < n; i++) this.list.push(this.spawn(Math.random() * 7))
  }
  private spawn(age = 0) {
    return { x: 20 + Math.random() * (POND.X - 40), z: 20 + Math.random() * (POND.Z - 40), age, life: 6 + Math.random() * 3, w: 7 + Math.random() * 6 }
  }
  step(dt: number) {
    this.list = this.list.map((w) => {
      w.age += dt
      w.x += 5 * dt
      w.z += 1.5 * dt
      return w.age > w.life || w.x > POND.X - 10 || w.z > POND.Z - 10 ? this.spawn() : w
    })
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 1.4
    ctx.lineCap = "round"
    for (const w of this.list) {
      const k = w.age / w.life
      ctx.globalAlpha = 0.6 * Math.sin(Math.PI * Math.min(1, k))
      const a = proj(w.x, w.z)
      const lift = 2.5 + Math.sin(w.age * 1.2) * 0.6
      ctx.beginPath()
      ctx.moveTo(a.x - w.w, a.y + 1)
      ctx.quadraticCurveTo(a.x, a.y - lift, a.x + w.w, a.y + 1)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }
}

export function drawRock(ctx: CanvasRenderingContext2D, x: number, z: number, lifted = 0) {
  const base = proj(x, z, -3 + lifted)
  const top = proj(x, z, ROCK_H + lifted)
  const rb = { x: isoRx(ROCK_R * 1.05), y: isoRy(ROCK_R * 1.05) }
  const rt = { x: isoRx(ROCK_R * 0.72), y: isoRy(ROCK_R * 0.72) }

  if (lifted > 0) {
    const g = proj(x, z)
    ctx.globalAlpha = 0.2
    ell(ctx, g.x, g.y, rb.x, rb.y, 0, "#20323b")
    ctx.globalAlpha = 1
  }

  ctx.fillStyle = PALETTE.rock
  ctx.beginPath()
  ctx.moveTo(base.x - rb.x, base.y)
  ctx.bezierCurveTo(base.x - rb.x, base.y - 14, top.x - rt.x - 6, top.y + 4, top.x - rt.x, top.y)
  ctx.ellipse(top.x, top.y, rt.x, rt.y, 0, Math.PI, 0)
  ctx.bezierCurveTo(top.x + rt.x + 6, top.y + 4, base.x + rb.x, base.y - 14, base.x + rb.x, base.y)
  ctx.ellipse(base.x, base.y, rb.x, rb.y, 0, 0, Math.PI)
  ctx.closePath()
  ctx.fill()

  // shade the right flank
  ctx.fillStyle = PALETTE.rockDark
  ctx.beginPath()
  ctx.moveTo(base.x + rb.x * 0.2, base.y + rb.y * 0.98)
  ctx.ellipse(base.x, base.y, rb.x, rb.y, 0, Math.PI * 0.44, 0, true)
  ctx.bezierCurveTo(base.x + rb.x, base.y - 14, top.x + rt.x + 6, top.y + 4, top.x + rt.x, top.y)
  ctx.quadraticCurveTo(top.x + rt.x * 0.3, top.y + 22, base.x + rb.x * 0.2, base.y + rb.y * 0.98)
  ctx.fill()

  ell(ctx, top.x, top.y, rt.x, rt.y, 0, PALETTE.rockLight)

  if (lifted === 0) {
    ctx.strokeStyle = PALETTE.sheen
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.ellipse(base.x, base.y + 1, rb.x + 2, rb.y + 1.5, 0, 0.05, Math.PI - 0.05)
    ctx.stroke()
  }
}

// Ring where the bear meets the water. Back half goes before the bear, front half after.
export function drawWaterRing(ctx: CanvasRenderingContext2D, x: number, z: number, r: number, half: "back" | "front", t: number) {
  const a = proj(x, z)
  const k = 1 + Math.sin(t * 3) * 0.05
  ctx.strokeStyle = PALETTE.sheen
  ctx.lineWidth = 1.5
  ctx.beginPath()
  if (half === "back") ctx.ellipse(a.x, a.y, isoRx(r) * k, isoRy(r) * k, 0, Math.PI, Math.PI * 2)
  else ctx.ellipse(a.x, a.y, isoRx(r) * k, isoRy(r) * k, 0, 0, Math.PI)
  ctx.stroke()
}

// ---------------------------------------------------------------- particles (screen space)

export type ParticleKind = "drop" | "ripple" | "crumb" | "text" | "star" | "z" | "bone" | "puff" | "bubble"

export interface Particle {
  kind: ParticleKind
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  floor: number // screen y of the water surface under this particle
  text?: string
  rot?: number
}

export type Emit = (p: Partial<Particle> & { kind: ParticleKind; x: number; y: number }) => void

export class Particles {
  list: Particle[] = []

  emit: Emit = (p) => {
    const life = p.life ?? 0.8
    this.list.push({ vx: 0, vy: 0, size: 3, floor: p.y, max: life, ...p, life })
    if (this.list.length > 400) this.list.shift()
  }

  step(dt: number) {
    const spawned: Particle[] = []
    for (const p of this.list) {
      p.life -= dt
      switch (p.kind) {
        case "drop":
        case "crumb":
        case "bone":
          p.vy += 520 * dt
          if (p.y > p.floor && p.vy > 0) {
            p.life = 0
            if (p.kind === "drop" && Math.random() < 0.12) spawned.push({ kind: "ripple", x: p.x, y: p.floor, vx: 0, vy: 0, size: 2, life: 0.6, max: 0.6, floor: p.floor })
          }
          break
        case "bubble":
          p.vy = -10
          break
        case "text":
        case "z":
        case "star":
          p.vy *= 0.97
          break
        case "puff":
          p.size += dt * 14
          break
        case "ripple":
          break
      }
      p.x += p.vx * dt
      p.y += p.vy * dt
    }
    this.list = this.list.filter((p) => p.life > 0).concat(spawned)
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.list) {
      const a = Math.max(0, Math.min(1, p.life / p.max))
      ctx.globalAlpha = p.kind === "ripple" ? a * 0.6 : p.kind === "puff" ? a * 0.9 : Math.min(1, a * 2)
      switch (p.kind) {
        case "drop":
          circle(ctx, p.x, p.y, p.size, "#d6ecf4")
          break
        case "bubble":
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.stroke()
          break
        case "ripple": {
          const k = 1 - a
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.ellipse(p.x, p.y, isoRx(p.size + k * (8 + p.size * 2)), isoRy(p.size + k * (8 + p.size * 2)), 0, 0, Math.PI * 2)
          ctx.stroke()
          break
        }
        case "crumb":
          circle(ctx, p.x, p.y, p.size, PALETTE.fish)
          break
        case "bone":
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rot ?? 0) + (p.max - p.life) * 8)
          ctx.strokeStyle = PALETTE.bone
          ctx.lineWidth = 1.8
          ctx.beginPath()
          ctx.moveTo(-3, 0)
          ctx.lineTo(3, 0)
          ctx.stroke()
          ctx.restore()
          break
        case "star":
          star(ctx, p.x, p.y, p.size, (p.max - p.life) * 4)
          break
        case "puff":
          circle(ctx, p.x, p.y, p.size, "rgba(255,255,255,0.85)")
          break
        case "text":
        case "z":
          ctx.fillStyle = PALETTE.ink
          ctx.font = `600 ${p.size}px ui-monospace, Menlo, monospace`
          ctx.textAlign = "center"
          ctx.fillText(p.text ?? "z", p.x, p.y)
          break
      }
    }
    ctx.globalAlpha = 1
  }
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, r: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(r)
  ctx.fillStyle = "#f2c44f"
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const rad = i % 2 === 0 ? s : s * 0.4
    const a = (i / 8) * Math.PI * 2
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad)
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}
