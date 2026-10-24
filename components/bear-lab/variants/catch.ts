// The lunge. Physics owns the dash (same distance and timing for every variant, so the
// RL problem doesn't change with the art); paws close at u = 0.4. c.success flips to
// true the instant the sweep test hits, false if it never does. Every variant ends
// upright, fish in paws, where the eat animations pick up.

import { pawF, pawN, proj, type HeldFish, type Pose } from "../rig"
import { TAU, bump, crossed, easeInOut, easeOut, holding, lerp, missed, prone, seg, splash, tread, type AnimCtx, type Variant } from "../anim"

const M = 0.4

// Sit up out of the lunge into treading water, fish ending in front of the chest.
function sitUp(c: AnimCtx, k: number, from: Pose, fish: HeldFish | null): Pose {
  const e = easeInOut(k)
  const t = tread(c)
  const p: Pose = { ...t, rot: lerp(from.rot, 0.05, e), h: lerp(from.h, c.anchor.h + 5, e), headRot: lerp(from.headRot, 0.1, e), sy: lerp(from.sy, 1, e), eyes: from.eyes }
  if (!fish) return { ...p, armN: lerp(from.armN, 0.4, e), armF: lerp(from.armF, 0.3, e) }
  return holding(p, { ...fish, x: lerp(fish.x, 18, e), y: lerp(fish.y, -14, e), rot: lerp(fish.rot, 0.15, e) })
}

function ahead(c: AnimCtx, d: number) {
  return { x: c.anchor.x + Math.cos(c.heading) * d, z: c.anchor.z + Math.sin(c.heading) * d }
}

function between(a: { x: number; y: number }, b: { x: number; y: number }, dx = 3): HeldFish {
  return { x: (a.x + b.x) / 2 + dx, y: (a.y + b.y) / 2, rot: 0.2 }
}

// Standard ending: hold `grab` until 0.55, then sit up with the fish (or empty-pawed).
function finish(c: AnimCtx, grab: Pose, fish: HeldFish, at = 0.55): Pose {
  const k = seg(c.u, at, 1)
  if (c.success === false) return missed(c, k > 0 ? sitUp(c, k, grab, null) : grab)
  if (c.u < at) return c.success ? { ...grab, fish } : grab
  return sitUp(c, k, grab, fish)
}

export const catchVariants: Variant[] = [
  {
    id: "C1",
    name: "Two-paw dunk",
    note: "Reaches out, plunges both paws straight down, comes up with the fish.",
    duration: 0.8,
    pose(c) {
      const u = c.u
      if (u < M) {
        const k = seg(u, 0, M)
        return prone(c, { armN: lerp(Math.PI, 2.0, easeOut(k)), armF: lerp(Math.PI, 1.95, easeOut(k)), rot: 1.3 + 0.25 * k, h: c.anchor.h + 4 - 4 * k, eyes: "open" })
      }
      if (crossed(c, M)) splash(c, ahead(c, 24).x, ahead(c, 24).z, 8, 0.6)
      const grab = prone(c, { armN: 1.6, elbowN: 0.3, armF: 1.55, elbowF: 0.3, rot: 1.55, h: c.anchor.h + 1 })
      return finish(c, grab, between(pawN(grab), pawF(grab)))
    },
  },
  {
    id: "C2",
    name: "Swat & catch",
    note: "Swats the fish out of the water and catches it on the way down.",
    duration: 0.8,
    pose(c) {
      const u = c.u
      if (u < M) {
        const k = seg(u, 0, M)
        return prone(c, { armN: lerp(-0.6, 1.9, easeOut(k)), elbowN: 0.4 * (1 - k), armF: Math.PI, eyes: "open" })
      }
      if (crossed(c, M)) splash(c, ahead(c, 26).x, ahead(c, 26).z, 6, 0.6)
      if (c.success === false) return finish(c, prone(c, { armN: 1.9 }), { x: 0, y: 0, rot: 0 })
      // fish flips up in an arc; bear rises to catch it in both paws
      const fly = seg(u, M, 0.85)
      const sit = sitUp(c, easeInOut(seg(u, M, 0.8)), prone(c, { armN: 1.9 }), null)
      if (u < 0.85) {
        const fish: HeldFish = { x: lerp(34, 18, fly), y: lerp(0, -14, fly) - bump(fly) * 36, rot: fly * TAU * 1.5 }
        const up = { ...sit, armN: 2.7, elbowN: 0.3, armF: 2.6, elbowF: 0.3, eyes: "open" as const }
        return { ...up, fish }
      }
      return holding(sit, { x: 18, y: -14, rot: 0.15 })
    },
  },
  {
    id: "C3",
    name: "Bear hug",
    note: "Opens wide and wraps the fish into a big chest hug.",
    duration: 0.8,
    pose(c) {
      const u = c.u
      if (u < M) {
        const open = bump(seg(u, 0, M) * 0.8)
        return prone(c, { armN: lerp(Math.PI, 3.9, open), armF: lerp(Math.PI, 2.2, open), eyes: "open" })
      }
      const k = seg(u, M, 0.55)
      const grab = prone(c, { armN: lerp(3.9, 1.9, k), elbowN: 1.5 * k, armF: lerp(2.2, 1.8, k), elbowF: 1.4 * k, sx: 1 - 0.05 * k })
      if (crossed(c, M)) splash(c, ahead(c, 18).x, ahead(c, 18).z, 5, 0.5)
      return finish(c, grab, { x: 16, y: 2, rot: 0.1 })
    },
  },
  {
    id: "C4",
    name: "Face-plant",
    note: "Dunks its whole head under, pops back up holding the fish.",
    duration: 0.8,
    pose(c) {
      const u = c.u
      if (u < M) {
        const k = easeOut(seg(u, 0, M))
        return prone(c, { rot: lerp(1.3, 2.1, k), h: c.anchor.h + 4 - 12 * k, headRot: lerp(-1.0, 0.2, k), armN: lerp(Math.PI, 1.8, k), armF: lerp(Math.PI, 1.7, k), eyes: "closed" })
      }
      if (crossed(c, 0.05)) splash(c, ahead(c, 20).x, ahead(c, 20).z, 10, 0.7)
      const grab = prone(c, { rot: 2.1, h: c.anchor.h - 7, headRot: 0.2, armN: 1.8, armF: 1.7, eyes: "closed" })
      if (crossed(c, 0.6)) splash(c, c.anchor.x, c.anchor.z, 8, 0.6)
      return finish(c, grab, between(pawN(grab), pawF(grab)), 0.6)
    },
  },
  {
    id: "C5",
    name: "Clap",
    note: "Paws swing in from both sides and clap shut on the fish.",
    duration: 0.8,
    pose(c) {
      const u = c.u
      const k = easeOut(seg(u, 0.05, M))
      const grab = prone(c, { armN: lerp(-0.4, 2.3, k), elbowN: 0, armF: lerp(4.4, 2.3, k), elbowF: 0, eyes: u < M ? "open" : "meh" })
      if (crossed(c, M)) {
        const p = proj(ahead(c, 26).x, ahead(c, 26).z, 14)
        c.fx({ kind: "star", x: p.x, y: p.y, size: 6, life: 0.4 })
      }
      if (u < M) return grab
      return finish(c, grab, between(pawN(grab), pawF(grab), 2))
    },
  },
  {
    id: "C6",
    name: "Scoop",
    note: "One paw scoops under the fish and flicks it up into both paws.",
    duration: 0.8,
    pose(c) {
      const u = c.u
      if (u < M) {
        const k = seg(u, 0, M)
        return prone(c, { armN: lerp(Math.PI, 1.5, easeOut(k)), elbowN: 0.6 * k, armF: Math.PI })
      }
      const up = seg(u, M, 0.6)
      const grab = prone(c, { armN: lerp(1.5, 3.4, easeOut(up)), elbowN: 0.6 * (1 - up), armF: Math.PI })
      if (crossed(c, M)) splash(c, ahead(c, 24).x, ahead(c, 24).z, 7, 0.6)
      if (c.success === false || u >= 0.6) return finish(c, grab, { x: 18, y: -14, rot: 0.15 }, 0.6)
      const tip = pawN(grab)
      return c.success ? { ...grab, fish: { x: tip.x, y: tip.y - bump(up) * 10, rot: up * TAU } } : grab
    },
  },
  {
    id: "C7",
    name: "Pin it",
    note: "Rears up out of the water and comes down on the fish with both paws.",
    duration: 0.8,
    pose(c) {
      const u = c.u
      if (u < M) {
        const k = seg(u, 0, M)
        const rise = bump(k * 0.85)
        return prone(c, { h: c.anchor.h + 4 + rise * 14, rot: lerp(1.3, 0.55, rise) + (k > 0.8 ? (k - 0.8) * 4 : 0), headRot: -0.4, armN: lerp(Math.PI, 3.6, rise), elbowN: -0.5 * rise, armF: lerp(Math.PI, 3.5, rise), elbowF: -0.5 * rise, legN: 0.4 * rise, kneeN: 0.6 * rise, eyes: "open" })
      }
      if (crossed(c, M)) splash(c, ahead(c, 26).x, ahead(c, 26).z, 12, 0.8)
      const slam = prone(c, { h: c.anchor.h + 1, rot: 1.45, headRot: -0.5, armN: 2.3, elbowN: 0.2, armF: 2.25, elbowF: 0.2 })
      return finish(c, slam, between(pawN(slam), pawF(slam)))
    },
  },
  {
    id: "C8",
    name: "Barrel roll",
    note: "Rolls right through the fish and comes out holding it.",
    duration: 0.8,
    pose(c) {
      const u = c.u
      const spin = seg(u, 0, 0.6)
      let sy = Math.cos(spin * TAU)
      if (Math.abs(sy) < 0.2) sy = sy < 0 ? -0.2 : 0.2
      const grab = prone(c, { sy, armN: 2.3, elbowN: 0.5, armF: 2.2, elbowF: 0.5, eyes: u < 0.6 ? "closed" : "meh" })
      if (crossed(c, 0.3)) splash(c, c.anchor.x, c.anchor.z, 8, 0.6)
      if (u < 0.6) return c.success ? { ...grab, fish: between(pawN(grab), pawF(grab)) } : grab
      return finish(c, { ...grab, sy: 1 }, between(pawN(grab), pawF(grab)), 0.6)
    },
  },
  {
    id: "C9",
    name: "Lazy reach",
    note: "Barely bothers. One paw drifts out, grabs, done.",
    duration: 0.8,
    pose(c) {
      const u = c.u
      const k = easeInOut(seg(u, 0.1, M))
      const grab = prone(c, { armN: lerp(Math.PI, 2.1, k), elbowN: 0.2, armF: Math.PI, look: 0.7 })
      if (u < M) return grab
      const tip = pawN(grab)
      const fish: HeldFish = { x: tip.x + 2, y: tip.y + 2, rot: 1.2 }
      const k2 = seg(u, 0.55, 1)
      if (c.success === false) return finish(c, grab, fish)
      if (u < 0.55) return c.success ? { ...grab, fish } : grab
      // sits up with the fish dangling from one paw, then the other paw joins
      const s = sitUp(c, k2, grab, null)
      return holding(s, { x: lerp(fish.x, 18, easeInOut(k2)), y: lerp(fish.y, -14, easeInOut(k2)), rot: lerp(1.2, 0.15, k2) }, k2 < 0.7)
    },
  },
  {
    id: "C10",
    name: "Trophy",
    note: "Grabs it, hoists it overhead for a beat, deadpan, then brings it down.",
    duration: 0.8,
    pose(c) {
      const u = c.u
      if (u < M) {
        const k = seg(u, 0, M)
        return prone(c, { armN: lerp(Math.PI, 2.0, easeOut(k)), armF: lerp(Math.PI, 1.9, easeOut(k)) })
      }
      if (crossed(c, M)) splash(c, ahead(c, 24).x, ahead(c, 24).z, 7, 0.6)
      const grab = prone(c, { armN: 2.0, armF: 1.9 })
      if (c.success === false) return finish(c, grab, { x: 0, y: 0, rot: 0 }, 0.5)
      if (u < 0.5) return { ...grab, fish: between(pawN(grab), pawF(grab)) }
      const s = sitUp(c, seg(u, 0.5, 0.65), grab, null)
      const lift = u < 0.85 ? easeOut(seg(u, 0.5, 0.65)) : 1 - easeInOut(seg(u, 0.85, 1))
      if (crossed(c, 0.66)) {
        const p = proj(c.anchor.x, c.anchor.z, c.anchor.h + 70)
        c.fx({ kind: "star", x: p.x, y: p.y, size: 6, life: 0.6 })
      }
      return holding(s, { x: lerp(18, 4, lift), y: lerp(-14, -50, lift), rot: lerp(0.15, -0.1, lift) })
    },
  },
]

