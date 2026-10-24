// Rock -> water. Every variant starts standing at c.from and ends at c.to lying prone,
// head up, so the swim picks up seamlessly. Deadpan throughout.

import { pose, proj, screenFace, type Pose } from "../rig"
import { TAU, bump, crossed, easeIn, easeInOut, easeOut, hop, lerp, say, seg, splash, type AnimCtx, type Variant } from "../anim"

const face = (c: AnimCtx) => screenFace(c.heading)

function stand(c: AnimCtx, extra: Partial<Pose> = {}): Pose {
  return pose({ x: c.from.x, z: c.from.z, h: c.from.h, face: face(c), ...extra })
}

function crouch(c: AnimCtx, k: number, extra: Partial<Pose> = {}): Pose {
  return stand(c, { h: c.from.h - 8 * k, rot: 0.2 * k, legN: 0.9 * k, kneeN: 1.7 * k, legF: 0.8 * k, kneeF: 1.6 * k, armN: -0.7 * k, armF: -0.8 * k, ...extra })
}

// Last stretch: from the entry pose to lying prone at the splash. `dip` sinks first.
function settle(c: AnimCtx, k: number, rot: number, extra: Partial<Pose> = {}, dip = 0): Pose {
  const e = easeInOut(k)
  const { armN = Math.PI, armF = Math.PI, ...rest } = extra
  return pose({
    x: c.to.x,
    z: c.to.z,
    h: lerp(c.to.h - 6, c.to.h + 4, e) - dip * bump(k * 1.4),
    face: face(c),
    rot: lerp(rot, 1.3, e),
    headRot: lerp(0, -1.0, e),
    elbowN: 0,
    elbowF: 0,
    ...rest,
    armN: lerp(armN, Math.PI, e),
    armF: lerp(armF, Math.PI, e),
  })
}

// Point partway from the rock center toward the splash, on the rock top.
function toward(c: AnimCtx, d: number) {
  const dx = c.to.x - c.from.x
  const dz = c.to.z - c.from.z
  const len = Math.hypot(dx, dz) || 1
  return { x: c.from.x + (dx / len) * d, z: c.from.z + (dz / len) * d, h: c.from.h }
}

function star(c: AnimCtx, h: number) {
  const p = proj(c.to.x, c.to.z, h)
  c.fx({ kind: "star", x: p.x, y: p.y, vy: -18, size: 5, life: 0.8 })
}

export const jumpVariants: Variant[] = [
  {
    id: "J1",
    name: "Pencil jump",
    note: "Arms pinned, legs together, straight down feet-first. Zero drama.",
    duration: 1.5,
    pose(c) {
      const u = c.u
      if (u < 0.2) return crouch(c, bump(seg(u, 0, 0.2)) * 0.5, { armN: 0, armF: 0 })
      if (u < 0.65) {
        const a = seg(u, 0.2, 0.65)
        const p = hop(c.from, { ...c.to, h: c.to.h + 10 }, a, 34)
        return pose({ ...p, face: face(c), armN: 0, elbowN: 0, armF: 0, elbowF: 0, legN: 0, legF: 0, sy: 1.04, sx: 0.96 })
      }
      if (crossed(c, 0.65)) splash(c, c.to.x, c.to.z, 9, 0.7)
      const k = seg(u, 0.65, 1)
      return settle(c, k, 0, { armN: lerp(0, Math.PI, seg(k, 0.4, 1)), armF: lerp(0, Math.PI, seg(k, 0.4, 1)) }, 26)
    },
  },
  {
    id: "J2",
    name: "Cannonball",
    note: "Big leap, knees to chest, one lazy spin, enormous splash.",
    duration: 1.7,
    pose(c) {
      const u = c.u
      if (u < 0.28) return crouch(c, easeInOut(seg(u, 0, 0.28)))
      if (u < 0.7) {
        const a = seg(u, 0.28, 0.7)
        const p = hop(c.from, c.to, a, 64)
        const tuck = easeOut(Math.min(1, a * 4))
        return pose({ ...p, face: face(c), rot: a * 1.2, legN: 2.2 * tuck, kneeN: 2.6 * tuck, legF: 2.1 * tuck, kneeF: 2.5 * tuck, armN: 1.1 * tuck, elbowN: 1.2 * tuck, armF: 1.0 * tuck, elbowF: 1.2 * tuck, headRot: 0.3 * tuck, eyes: "closed" })
      }
      if (crossed(c, 0.7)) {
        splash(c, c.to.x, c.to.z, 30, 1.5)
        say(c, c.to.x, c.to.z, 70, "sploosh")
      }
      const k = seg(u, 0.7, 1)
      return settle(c, k, 1.2 * (1 - k), { legN: 2.2 * (1 - k), kneeN: 2.6 * (1 - k), eyes: k < 0.5 ? "closed" : "meh" }, 18)
    },
  },
  {
    id: "J3",
    name: "Racing start",
    note: "Swim-team dive: deep crouch, arms swing back, long flat streamline.",
    duration: 1.5,
    pose(c) {
      const u = c.u
      const lip = toward(c, 22)
      if (u < 0.3) {
        const k = easeInOut(seg(u, 0, 0.3))
        return pose({ x: lerp(c.from.x, lip.x, k), z: lerp(c.from.z, lip.z, k), h: c.from.h - 9 * k, face: face(c), rot: 0.9 * k, legN: 1.0 * k, kneeN: 1.6 * k, legF: 0.9 * k, kneeF: 1.5 * k, armN: -0.9 * k, armF: -1.0 * k, headRot: 0.3 * k })
      }
      if (u < 0.7) {
        const a = seg(u, 0.3, 0.7)
        const p = hop({ ...lip, h: c.from.h - 9 }, c.to, a, 22)
        return pose({ ...p, face: face(c), rot: lerp(1.2, 1.9, a), armN: Math.PI, elbowN: 0, armF: Math.PI - 0.06, elbowF: 0, legN: -0.1, legF: 0, sy: 1.06 })
      }
      if (crossed(c, 0.7)) splash(c, c.to.x, c.to.z, 8, 0.6)
      return settle(c, seg(u, 0.7, 1), 1.9)
    },
  },
  {
    id: "J4",
    name: "Swan dive",
    note: "Up on its toes, arms overhead, slices in head-first. Tiny splash.",
    duration: 1.6,
    pose(c) {
      const u = c.u
      if (u < 0.3) {
        const k = easeInOut(seg(u, 0, 0.3))
        return stand(c, { h: c.from.h + 3 * k, rot: -0.12 * k, armN: lerp(0.15, Math.PI, k), elbowN: 0.25 * (1 - k), armF: lerp(0.1, Math.PI - 0.1, k), elbowF: 0.25 * (1 - k), headRot: -0.25 * k, eyes: k > 0.5 ? "closed" : "meh", sy: 1 + 0.05 * k })
      }
      if (u < 0.74) {
        const a = seg(u, 0.3, 0.74)
        const p = hop(c.from, { ...c.to, h: c.to.h + 4 }, a, 46)
        return pose({ ...p, face: face(c), rot: lerp(-0.15, 2.5, easeIn(a)), armN: Math.PI, elbowN: 0, armF: Math.PI - 0.08, elbowF: 0, legN: -0.05, legF: 0.05, headRot: -0.1, eyes: "closed", sy: 1.05 })
      }
      if (crossed(c, 0.74)) {
        splash(c, c.to.x, c.to.z, 6, 0.55)
        star(c, 22)
      }
      return settle(c, seg(u, 0.74, 1), 2.5, { eyes: u > 0.86 ? "meh" : "closed" })
    },
  },
  {
    id: "J5",
    name: "Just steps off",
    note: "Ambles to the edge and steps off like it's a curb. No reaction at all.",
    duration: 1.9,
    pose(c) {
      const u = c.u
      const lip = toward(c, 26)
      if (u < 0.4) {
        const k = seg(u, 0, 0.4)
        const step = Math.sin(k * Math.PI * 4)
        return pose({ x: lerp(c.from.x, lip.x, k), z: lerp(c.from.z, lip.z, k), h: c.from.h + Math.abs(step) * 1.5, face: face(c), legN: step * 0.45, kneeN: Math.max(0, step) * 0.5, legF: -step * 0.45, kneeF: Math.max(0, -step) * 0.5, armN: -step * 0.25, armF: step * 0.25, look: 0.6 })
      }
      if (u < 0.7) {
        const a = seg(u, 0.4, 0.7)
        const p = hop(lip, { ...c.to, h: c.to.h + 6 }, easeIn(a), 4)
        return pose({ ...p, face: face(c), legN: 0.5 * (1 - a), legF: -0.1, armN: 0.15 + 0.3 * a, armF: 0.1 + 0.3 * a, look: 0.6 })
      }
      if (crossed(c, 0.7)) splash(c, c.to.x, c.to.z, 12, 0.8)
      return settle(c, seg(u, 0.7, 1), 0, { armN: 0.4, armF: 0.4 }, 30)
    },
  },
  {
    id: "J6",
    name: "Backflip",
    note: "Turns its back to the pond, flips backward, enters feet-first.",
    duration: 1.8,
    pose(c) {
      const u = c.u
      const back = (-face(c)) as 1 | -1
      if (u < 0.25) {
        const k = easeInOut(seg(u, 0, 0.25))
        return stand(c, { face: back, h: c.from.h - 7 * k, legN: 0.9 * k, kneeN: 1.6 * k, legF: 0.8 * k, kneeF: 1.5 * k, armN: lerp(0.15, -0.8, k), armF: lerp(0.1, -0.9, k) })
      }
      if (u < 0.72) {
        const a = seg(u, 0.25, 0.72)
        const p = hop(c.from, { ...c.to, h: c.to.h + 8 }, a, 60)
        const tuck = bump(seg(a, 0.1, 0.85))
        return pose({ ...p, face: back, rot: -easeInOut(a) * TAU, armN: lerp(-0.8, Math.PI, Math.min(1, a * 3)) - tuck * 1.6, elbowN: tuck, armF: lerp(-0.9, Math.PI, Math.min(1, a * 3)) - tuck * 1.6, elbowF: tuck, legN: tuck * 2, kneeN: tuck * 2.3, legF: tuck * 1.9, kneeF: tuck * 2.2, eyes: "closed" })
      }
      if (crossed(c, 0.72)) splash(c, c.to.x, c.to.z, 14, 0.9)
      return settle(c, seg(u, 0.72, 1), 0, {}, 24)
    },
  },
  {
    id: "J7",
    name: "Timber",
    note: "Goes stiff and tips over forward like a plank. Belly-first slap.",
    duration: 1.9,
    pose(c) {
      const u = c.u
      const lip = toward(c, 20)
      if (u < 0.2) {
        const k = seg(u, 0, 0.2)
        return pose({ x: lerp(c.from.x, lip.x, easeInOut(k)), z: lerp(c.from.z, lip.z, easeInOut(k)), h: c.from.h, face: face(c), armN: 0, elbowN: 0, armF: 0, elbowF: 0, eyes: k > 0.7 ? "closed" : "meh" })
      }
      if (u < 0.72) {
        // pivot about the feet, accelerating like a falling board
        const a = easeIn(seg(u, 0.2, 0.72))
        const ang = a * (Math.PI / 2)
        const feetH = lerp(c.from.h - 33, c.to.h - 2, a * a)
        const fx = lerp(lip.x, c.to.x, a)
        const fz = lerp(lip.z, c.to.z, a)
        const dx = c.to.x - lip.x
        const dz = c.to.z - lip.z
        const len = Math.hypot(dx, dz) || 1
        const lean = Math.sin(ang) * 33 * (1 - a)
        return pose({ x: fx + (dx / len) * lean * 0.6, z: fz + (dz / len) * lean * 0.6, h: feetH + Math.cos(ang) * 33, face: face(c), rot: ang, armN: 0, elbowN: 0, armF: 0, elbowF: 0, legN: 0, legF: 0, eyes: "closed" })
      }
      if (crossed(c, 0.72)) {
        splash(c, c.to.x, c.to.z, 20, 0.7)
        say(c, c.to.x, c.to.z, 60, "slap")
      }
      const k = seg(u, 0.72, 1)
      return settle(c, k, Math.PI / 2, { armN: lerp(0, Math.PI, seg(k, 0.3, 1)), armF: lerp(0, Math.PI, seg(k, 0.3, 1)), eyes: k < 0.5 ? "closed" : "meh" })
    },
  },
  {
    id: "J8",
    name: "Air walk",
    note: "Runs off the edge and keeps running in mid-air for a bit.",
    duration: 1.8,
    pose(c) {
      const u = c.u
      const back = toward(c, -18)
      const lip = toward(c, 24)
      const gait = (k: number, f: number) => Math.sin(k * Math.PI * f)
      if (u < 0.18) {
        const k = easeInOut(seg(u, 0, 0.18))
        return pose({ x: lerp(c.from.x, back.x, k), z: lerp(c.from.z, back.z, k), h: c.from.h, face: face(c), look: -0.5 })
      }
      if (u < 0.4) {
        const k = seg(u, 0.18, 0.4)
        const g = gait(k, 6)
        return pose({ x: lerp(back.x, lip.x, easeIn(k)), z: lerp(back.z, lip.z, easeIn(k)), h: c.from.h + Math.abs(g) * 3, face: face(c), rot: 0.15, legN: g * 0.9, kneeN: Math.max(0, g) * 1.2, legF: -g * 0.9, kneeF: Math.max(0, -g) * 1.2, armN: -g * 0.9, elbowN: 1.2, armF: g * 0.9, elbowF: 1.2 })
      }
      if (u < 0.75) {
        const a = seg(u, 0.4, 0.75)
        const p = hop(lip, { ...c.to, h: c.to.h + 4 }, a, 30)
        const g = gait(a, 9)
        return pose({ ...p, face: face(c), rot: 0.15 + 0.3 * a, legN: g * 1.0, kneeN: Math.max(0, g) * 1.3, legF: -g * 1.0, kneeF: Math.max(0, -g) * 1.3, armN: -g * 1.0, elbowN: 1.2, armF: g * 1.0, elbowF: 1.2 })
      }
      if (crossed(c, 0.75)) splash(c, c.to.x, c.to.z, 14, 0.9)
      return settle(c, seg(u, 0.75, 1), 0.5, {}, 10)
    },
  },
  {
    id: "J9",
    name: "Sit & scoot",
    note: "Sits on the edge, dangles its feet, shrugs, scoots off.",
    duration: 2.2,
    pose(c) {
      const u = c.u
      const lip = toward(c, 24)
      const seat = { ...lip, h: c.from.h - 14 }
      if (u < 0.25) {
        const k = easeInOut(seg(u, 0, 0.25))
        return pose({ x: lerp(c.from.x, lip.x, k), z: lerp(c.from.z, lip.z, k), h: lerp(c.from.h, seat.h, k), face: face(c), rot: -0.15 * k, legN: 1.5 * k, kneeN: 1.3 * k, legF: 1.4 * k, kneeF: 1.2 * k })
      }
      if (u < 0.55) {
        const k = seg(u, 0.25, 0.55)
        const swing = Math.sin(k * Math.PI * 4) * 0.3
        const shrug = bump(seg(k, 0.55, 0.9))
        return pose({ ...seat, face: face(c), rot: -0.15, legN: 1.5, kneeN: 1.3 + swing, legF: 1.4, kneeF: 1.2 - swing, armN: lerp(0.15, 0.7, shrug), elbowN: 1.4 * shrug, armF: lerp(0.1, 0.6, shrug), elbowF: 1.4 * shrug, sy: 1 - 0.06 * shrug, headRot: -0.1 * shrug })
      }
      if (u < 0.78) {
        const a = seg(u, 0.55, 0.78)
        const p = hop(seat, { ...c.to, h: c.to.h + 2 }, easeIn(a), 6)
        return pose({ ...p, face: face(c), rot: -0.15, legN: 1.5, kneeN: 0.6, legF: 1.4, kneeF: 0.5, armN: -0.6, armF: -0.7 })
      }
      if (crossed(c, 0.78)) splash(c, c.to.x, c.to.z, 12, 0.8)
      return settle(c, seg(u, 0.78, 1), -0.15, {}, 12)
    },
  },
  {
    id: "J10",
    name: "Superhero",
    note: "One fist forward, flies flat across the water, then noses in.",
    duration: 1.7,
    pose(c) {
      const u = c.u
      if (u < 0.25) return crouch(c, easeInOut(seg(u, 0, 0.25)), { armN: 0.4, elbowN: 1.6 })
      if (u < 0.75) {
        const a = seg(u, 0.25, 0.75)
        const p = hop(c.from, { ...c.to, h: c.to.h + 4 }, a, 34)
        const fly = Math.min(1, a * 3)
        return pose({ ...p, face: face(c), rot: lerp(0.3, 1.45, fly) + seg(a, 0.8, 1) * 0.5, armN: Math.PI - 0.15, elbowN: 0, armF: 0.1, elbowF: 0, legN: -0.1, legF: 0.15, kneeF: 0.4, headRot: -0.7 })
      }
      if (crossed(c, 0.75)) {
        splash(c, c.to.x, c.to.z, 10, 0.8)
        star(c, 20)
      }
      return settle(c, seg(u, 0.75, 1), 1.95, { armF: lerp(0.1, Math.PI, seg(u, 0.75, 1)) })
    },
  },
]
