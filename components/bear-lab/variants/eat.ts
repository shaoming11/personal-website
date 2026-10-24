// Treading water with the fish. No mouth, so food just goes "under the snout".
// Every variant starts upright holding the fish in front (where catch leaves it)
// and ends with the fish gone so the loop can head back to the rock.

import { SHOULDER_N, headCenter, localToScreen, proj, reachArm, snoutAt, type HeldFish, type Pose } from "../rig"
import { bump, crossed, easeInOut, holding, lerp, say, seg, tread, type AnimCtx, type Variant } from "../anim"

const START = { x: 18, y: -14, rot: 0.15 }

function upright(c: AnimCtx, extra: Partial<Pose> = {}): Pose {
  return tread(c, extra)
}

// Fish moved from START toward the snout by k.
function toSnout(p: Pose, k: number, dx = 2, dy = 4, rot = 0.1): HeldFish {
  const s = snoutAt(p)
  return { x: lerp(START.x, s.x + dx, k), y: lerp(START.y, s.y + dy, k), rot: lerp(START.rot, rot, k) }
}

function crumbs(c: AnimCtx, p: Pose, n: number) {
  const s = snoutAt(p)
  const at = localToScreen(p, s.x, s.y + 4)
  const floor = proj(p.x, p.z, 0).y
  for (let i = 0; i < n; i++) c.fx({ kind: "crumb", x: at.x, y: at.y, floor, vx: (c.rand() - 0.5) * 80, vy: -40 - c.rand() * 70, size: 1.2 + c.rand(), life: 1 })
}

// Chewing: a little head bob n times across [a, b].
function chew(u: number, a: number, b: number, n: number) {
  const k = seg(u, a, b)
  return k > 0 && k < 1 ? Math.abs(Math.sin(k * Math.PI * n)) : 0
}

const say2 = (c: AnimCtx, text: string, size = 10) => say(c, c.anchor.x, c.anchor.z, c.anchor.h + 70, text, size)

// On its back, floating.
function floatBack(c: AnimCtx, extra: Partial<Pose> = {}): Pose {
  return tread(c, { h: c.anchor.h + 12, rot: -1.4, headRot: 0.55, legN: 1.2, kneeN: 0.4, legF: 1.1, kneeF: 0.4, ...extra })
}

export const eatVariants: Variant[] = [
  {
    id: "E1",
    name: "Nibbles",
    note: "Brings it up to the snout and works through it in three neat nibbles.",
    duration: 2.8,
    pose(c) {
      const u = c.u
      const lift = easeInOut(seg(u, 0, 0.15))
      const j = chew(u, 0.18, 0.88, 9)
      const p = upright(c, { headRot: 0.1 + j * 0.12 })
      const bites = Math.min(3, Math.floor(seg(u, 0.18, 0.88) * 3.2))
      if (crossed(c, 0.4) || crossed(c, 0.62) || crossed(c, 0.84)) crumbs(c, p, 3)
      if (u > 0.88) return { ...p, eyes: seg(u, 0.88, 1) > 0.5 ? "closed" : "meh" }
      return holding(p, { ...toSnout(p, lift), bites, x: toSnout(p, lift).x + Math.sin(c.t * 30) * j * 0.8 })
    },
  },
  {
    id: "E2",
    name: "Otter float",
    note: "Rolls onto its back and eats off its belly like an otter.",
    duration: 3.4,
    pose(c) {
      const u = c.u
      const roll = easeInOut(seg(u, 0, 0.18))
      if (u < 0.18) {
        const p = upright(c, { rot: lerp(0, -1.4, roll), h: lerp(c.anchor.h, c.anchor.h + 12, roll), headRot: lerp(0.1, 0.55, roll) })
        return holding(p, { x: lerp(START.x, 20, roll), y: lerp(START.y, 4, roll), rot: START.rot })
      }
      const j = chew(u, 0.25, 0.9, 8)
      const p = floatBack(c, { headRot: 0.55 + j * 0.15, eyes: u > 0.9 ? "closed" : "meh" })
      const bites = Math.min(3, Math.floor(seg(u, 0.25, 0.9) * 3.3))
      if (crossed(c, 0.45) || crossed(c, 0.65) || crossed(c, 0.85)) crumbs(c, p, 3)
      if (u > 0.9) return p
      return holding(p, { x: 20, y: 4 - j * 3, rot: 0, bites })
    },
  },
  {
    id: "E3",
    name: "Gulp & belly pat",
    note: "Tips its head back, drops the fish in whole, pats its belly. *burp*",
    duration: 3.0,
    pose(c) {
      const u = c.u
      const tilt = easeInOut(seg(u, 0.05, 0.3))
      const back = u < 0.5 ? tilt : 1 - easeInOut(seg(u, 0.5, 0.62))
      const p0 = upright(c, { headRot: -0.55 * back, eyes: u > 0.3 && u < 0.5 ? "closed" : "meh" })
      const s = snoutAt(p0)
      if (u < 0.3) {
        // lift it over the snout, head down
        return holding(p0, { x: lerp(START.x, s.x - 2, tilt), y: lerp(START.y, s.y - 16, tilt), rot: lerp(START.rot, -Math.PI / 2, tilt) })
      }
      if (u < 0.5) {
        const k = seg(u, 0.3, 0.5)
        if (crossed(c, 0.47)) say2(c, "gulp")
        return holding(p0, { x: s.x - 2, y: s.y - 16 + 14 * k, rot: -Math.PI / 2, scale: 1 - 0.6 * k, behind: true })
      }
      // belly pats
      const pat = Math.abs(Math.sin(seg(u, 0.55, 0.88) * Math.PI * 4))
      const belly = reachArm(SHOULDER_N, { x: 12 + pat * 5, y: 8 - pat * 2 })
      if (crossed(c, 0.9)) say2(c, "*burp*", 9)
      return { ...p0, armN: belly.a, elbowN: belly.e, armF: 0.3, sx: 1 + 0.05 * bump(seg(u, 0.5, 1)), eyes: u > 0.88 ? "closed" : "meh" }
    },
  },
  {
    id: "E4",
    name: "Corn on the cob",
    note: "Holds it sideways and typewriters along it, crumbs flying.",
    duration: 3.0,
    pose(c) {
      const u = c.u
      const lift = easeInOut(seg(u, 0, 0.12))
      const p = upright(c, { headRot: 0.15 })
      const k = seg(u, 0.12, 0.88)
      const pass = (k * 3) % 1
      const slide = k > 0 && k < 1 ? 7 - pass * 14 : 0
      const bites = Math.min(3, Math.floor(k * 3.4))
      if (k > 0 && k < 1 && Math.floor(c.t * 10) !== Math.floor((c.t - c.dt) * 10)) crumbs(c, p, 1)
      if (u > 0.88) return { ...p, eyes: "meh" }
      const f = toSnout(p, lift, 2 + slide, 5, 0)
      return holding({ ...p, eyes: "squint" }, { ...f, bites })
    },
  },
  {
    id: "E5",
    name: "Toss & catch",
    note: "Flicks the fish up, it spins, lands right on target. Gone.",
    duration: 2.6,
    pose(c) {
      const u = c.u
      const p0 = upright(c, { headRot: u > 0.2 && u < 0.62 ? -0.4 : 0.1 })
      const s = snoutAt(p0)
      if (u < 0.2) {
        const k = seg(u, 0, 0.2)
        return holding(p0, { x: START.x, y: START.y + 6 * bump(k), rot: START.rot })
      }
      if (u < 0.6) {
        const k = seg(u, 0.2, 0.6)
        const fish: HeldFish = { x: lerp(START.x, s.x - 2, k), y: lerp(START.y, s.y - 10, k) - bump(k) * 60, rot: k * Math.PI * 4, behind: k > 0.85, scale: k > 0.85 ? 1 - (k - 0.85) * 4 : 1 }
        if (crossed(c, 0.21)) say2(c, "hup", 9)
        return { ...p0, armN: 2.6, elbowN: 0.3, armF: 0.4, eyes: "open", fish }
      }
      if (crossed(c, 0.6)) say2(c, "gulp")
      return { ...p0, armN: lerp(2.6, 0.2, seg(u, 0.6, 0.75)), eyes: "meh" }
    },
  },
  {
    id: "E6",
    name: "Sniff & shrug",
    note: "Sniffs it, unimpressed, shrugs. Eats it anyway, in one go.",
    duration: 3.0,
    pose(c) {
      const u = c.u
      const p0 = upright(c)
      if (u < 0.3) {
        const k = seg(u, 0, 0.3)
        if (Math.floor(c.t * 4) !== Math.floor((c.t - c.dt) * 4)) say2(c, "~", 11)
        const p = { ...p0, headRot: 0.3 + Math.sin(c.t * 22) * 0.05 }
        return holding(p, toSnout(p, easeInOut(Math.min(1, k * 2)), 6, 6))
      }
      if (u < 0.55) {
        // shrug: fish in one paw, other paw palm-up, shoulders up
        const sh = bump(seg(u, 0.3, 0.55))
        const p = { ...p0, sy: 1 - 0.06 * sh, armF: 0.5 + sh * 0.4, elbowF: 1.4 * sh, headRot: 0.1 - 0.15 * sh, look: -0.6 }
        return holding(p, { x: 20, y: -12 - sh * 3, rot: 0.2 }, true)
      }
      if (u < 0.75) {
        const k = seg(u, 0.55, 0.75)
        const s = snoutAt(p0)
        if (crossed(c, 0.72)) say2(c, "gulp")
        return holding(p0, { x: lerp(20, s.x, k), y: lerp(-12, s.y + 2, k), rot: 0.2, behind: k > 0.6, scale: 1 - k * 0.5 })
      }
      return { ...p0, eyes: "meh" }
    },
  },
  {
    id: "E7",
    name: "Phone call",
    note: "Holds the fish up to its ear for a minute. Nods. Hangs up. Eats it.",
    duration: 3.4,
    pose(c) {
      const u = c.u
      const p0 = upright(c)
      const hc = headCenter(p0)
      const ear = { x: hc.x - 6, y: hc.y + 2 }
      if (u < 0.15) {
        const k = easeInOut(seg(u, 0, 0.15))
        return holding(p0, { x: lerp(START.x, ear.x, k), y: lerp(START.y, ear.y, k), rot: lerp(START.rot, -1.4, k) }, true)
      }
      if (u < 0.6) {
        const nod = Math.abs(Math.sin(seg(u, 0.25, 0.55) * Math.PI * 3)) * 0.12
        if (crossed(c, 0.3)) say2(c, "mm.", 10)
        if (crossed(c, 0.5)) say2(c, "ok.", 10)
        const p = { ...p0, headRot: 0.05 + nod, look: -0.5 }
        return holding(p, { x: ear.x, y: ear.y, rot: -1.4 }, true)
      }
      if (u < 0.8) {
        const k = seg(u, 0.6, 0.8)
        const s = snoutAt(p0)
        if (crossed(c, 0.78)) say2(c, "gulp")
        return holding(p0, { x: lerp(ear.x, s.x, k), y: lerp(ear.y, s.y + 2, k), rot: lerp(-1.4, 0.1, k), behind: k > 0.6, scale: 1 - k * 0.5 })
      }
      return p0
    },
  },
  {
    id: "E8",
    name: "Down to the bones",
    note: "Speed-nibbles, holds up a clean skeleton, tosses it over its shoulder.",
    duration: 3.0,
    pose(c) {
      const u = c.u
      const p0 = upright(c)
      if (u < 0.5) {
        const fast = chew(u, 0.08, 0.5, 16)
        if (u > 0.08 && Math.floor(c.t * 14) !== Math.floor((c.t - c.dt) * 14)) crumbs(c, p0, 1)
        const p = { ...p0, headRot: 0.15 + fast * 0.1, eyes: "squint" as const }
        return holding(p, { ...toSnout(p, easeInOut(seg(u, 0, 0.08))), bites: Math.floor(seg(u, 0.08, 0.5) * 3.5) })
      }
      if (u < 0.72) {
        const k = easeInOut(seg(u, 0.5, 0.6))
        return holding(p0, { x: lerp(18, 20, k), y: lerp(-10, -24, k), rot: 0, bones: true })
      }
      if (crossed(c, 0.73)) {
        const at = localToScreen(p0, 0, -40)
        const floor = proj(p0.x, p0.z, 0).y
        c.fx({ kind: "bone", x: at.x, y: at.y, floor, vx: -p0.face * 70, vy: -170, life: 1.4, rot: 0 })
        c.fx({ kind: "bone", x: at.x, y: at.y, floor, vx: -p0.face * 50, vy: -200, life: 1.4, rot: 1 })
      }
      const th = bump(seg(u, 0.72, 0.88))
      return { ...p0, armN: 0.4 + th * 2.8, elbowN: 0.2, look: -0.4 }
    },
  },
  {
    id: "E9",
    name: "Slow savor",
    note: "Eyes shut, tiny bites with long pauses, ears twitching. Taking its time.",
    duration: 3.6,
    pose(c) {
      const u = c.u
      const lift = easeInOut(seg(u, 0, 0.12))
      const bitesAt = [0.3, 0.55, 0.8]
      let lean = 0
      let bites = 0
      bitesAt.forEach((b, i) => {
        if (u >= b) bites = i + 1
        lean = Math.max(lean, bump(seg(u, b - 0.06, b + 0.06)))
        if (crossed(c, b)) crumbs(c, upright(c), 2)
      })
      const p = upright(c, { headRot: 0.1 + lean * 0.15, eyes: u > 0.15 ? "closed" : "meh", ears: u > 0.2 ? Math.sin(c.t * 9) * 0.5 : 0 })
      if (bites >= 3 && u > 0.86) return p
      return holding(p, { ...toSnout(p, lift), bites })
    },
  },
  {
    id: "E10",
    name: "Food coma",
    note: "Eats, then flops onto its back for a quick nap. z z z.",
    duration: 3.6,
    pose(c) {
      const u = c.u
      if (u < 0.45) {
        const lift = easeInOut(seg(u, 0, 0.1))
        const j = chew(u, 0.1, 0.42, 6)
        const droop = seg(u, 0.3, 0.45)
        const p = upright(c, { headRot: 0.1 + j * 0.1 + droop * 0.2, eyes: droop > 0.4 ? "closed" : "meh" })
        const bites = Math.floor(seg(u, 0.1, 0.42) * 3.99)
        if (bites >= 3) return p
        return holding(p, { ...toSnout(p, lift), bites })
      }
      const flop = easeInOut(seg(u, 0.45, 0.6))
      if (u > 0.6 && Math.floor(c.t * 1.5) !== Math.floor((c.t - c.dt) * 1.5)) say2(c, "z", 9 + c.rand() * 4)
      const breathe = Math.sin(c.t * 2.2)
      return floatBack(c, { rot: lerp(0, -1.4, flop), h: lerp(c.anchor.h, c.anchor.h + 12, flop) + breathe, eyes: "closed", armN: 0.9, elbowN: 1.2, armF: 0.8, elbowF: 1.2, sx: 1 + breathe * 0.02 })
    },
  },
]
