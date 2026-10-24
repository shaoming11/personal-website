// At the surface. Position/heading/speed come from physics (the RL policy steers);
// these only decide how the bear looks while moving. Human strokes only.
//
// Prone arm angles: PI = reaching ahead, PI/2 = pulling down through the water,
// 0 = back at the hip, -PI/2 = up in the air. Supine (on the back) is the mirror:
// PI = overhead/ahead, PI/2 = up at the sky, 0 = at the hip, -PI/2 = in the water.

import { TAU, every, lerp, prone, seg, splash, strokeRate, supine, wake, type AnimCtx, type Variant } from "../anim"

// Entry splash ahead of the bear.
function entry(c: AnimCtx, ahead = 28, n = 3) {
  splash(c, c.anchor.x + Math.cos(c.heading) * ahead, c.anchor.z + Math.sin(c.heading) * ahead, n, 0.35)
}
function kickSplash(c: AnimCtx, n = 2) {
  splash(c, c.anchor.x - Math.cos(c.heading) * 26, c.anchor.z - Math.sin(c.heading) * 26, n, 0.3)
}

// Crawl arm: continuous windmill, with a high elbow while recovering through the air.
function crawlArm(a: number) {
  const elbow = Math.max(0, -Math.sin(a)) * 1.1
  return { a, e: elbow }
}

export const swimVariants: Variant[] = [
  {
    id: "S1",
    name: "Front crawl",
    note: "Freestyle: alternating overhead recovery, flutter kick, head turns to breathe.",
    duration: 0,
    pose(c) {
      const w = strokeRate(c, 3.2) * c.t
      const n = crawlArm(Math.PI - w)
      const f = crawlArm(-w)
      if (every(c, Math.PI / strokeRate(c, 3.2))) entry(c)
      if (every(c, 0.2)) wake(c)
      const breathe = Math.max(0, Math.sin(w / 2)) ** 8
      return prone(c, {
        armN: n.a,
        elbowN: n.e,
        armF: f.a,
        elbowF: f.e,
        legN: 0.15 + Math.sin(w * 3) * 0.25,
        kneeN: 0.2,
        legF: 0.15 - Math.sin(w * 3) * 0.25,
        kneeF: 0.2,
        sx: 1 + Math.sin(w) * 0.04,
        headRot: -1.0 - breathe * 0.35,
        eyes: breathe > 0.3 ? "closed" : "meh",
      })
    },
  },
  {
    id: "S2",
    name: "Breaststroke (heads-up)",
    note: "Quick breaststroke; head pops up high on every pull, then lunges forward.",
    duration: 0,
    pose(c) {
      const period = 1.05 - Math.min(0.35, c.speed * 0.003)
      const ph = (c.t % period) / period
      const pull = seg(ph, 0, 0.4)
      const rec = seg(ph, 0.4, 0.65)
      const arm = ph < 0.4 ? lerp(Math.PI, 1.5, pull) : ph < 0.65 ? lerp(1.5, Math.PI, rec) : Math.PI
      const elbow = ph < 0.4 ? pull * 0.6 : ph < 0.65 ? (1 - rec) * 1.6 : 0
      const up = ph < 0.4 ? Math.sin(pull * Math.PI * 0.5) : ph < 0.65 ? 1 - rec : 0
      const tuck = ph >= 0.3 && ph < 0.6 ? Math.sin(seg(ph, 0.3, 0.6) * Math.PI) : 0
      if (every(c, period, period * 0.62)) kickSplash(c, 3)
      return prone(c, {
        h: c.anchor.h + 4 + up * 7,
        rot: 1.3 - up * 0.45,
        headRot: -1.0 + up * 0.2,
        armN: arm,
        elbowN: elbow,
        armF: arm - 0.1,
        elbowF: elbow,
        legN: 0.1 + tuck * 1.4,
        kneeN: tuck * 2.1,
        legF: tuck * 1.3,
        kneeF: tuck * 2,
      })
    },
  },
  {
    id: "S3",
    name: "Backstroke",
    note: "On its back, arms windmilling overhead, staring at the sky.",
    duration: 0,
    pose(c) {
      const w = strokeRate(c, 2.8) * c.t
      if (every(c, Math.PI / strokeRate(c, 2.8))) entry(c, 30, 2)
      if (every(c, 0.22)) wake(c)
      return supine(c, {
        armN: w,
        elbowN: Math.max(0, -Math.sin(w)) * 0.6,
        armF: w + Math.PI,
        elbowF: Math.max(0, -Math.sin(w + Math.PI)) * 0.6,
        legN: Math.sin(w * 3) * 0.25,
        kneeN: 0.15,
        legF: -Math.sin(w * 3) * 0.25,
        kneeF: 0.15,
        look: 0.3,
      })
    },
  },
  {
    id: "S4",
    name: "Butterfly",
    note: "Both arms over at once, body ripples, dolphin kick. Show-off stroke, deadpan face.",
    duration: 0,
    pose(c) {
      const w = strokeRate(c, 2.6) * c.t
      const a = crawlArm(Math.PI - w)
      const ripple = Math.sin(w)
      if (every(c, TAU / strokeRate(c, 2.6), 0.15)) entry(c, 28, 6)
      return prone(c, {
        h: c.anchor.h + 4 + Math.max(0, -Math.sin(w)) * 6,
        rot: 1.3 + ripple * 0.22,
        headRot: -1.0 - Math.max(0, -Math.sin(w)) * 0.3,
        armN: a.a,
        elbowN: a.e * 0.5,
        armF: a.a - 0.08,
        elbowF: a.e * 0.5,
        legN: 0.3 + Math.sin(w + 1.2) * 0.4,
        kneeN: 0.5 + Math.sin(w + 2) * 0.4,
        legF: 0.25 + Math.sin(w + 1.2) * 0.4,
        kneeF: 0.5 + Math.sin(w + 2) * 0.4,
      })
    },
  },
  {
    id: "S5",
    name: "Sidestroke",
    note: "Lounging on its side: one arm reaches and pulls, scissor kick, glide.",
    duration: 0,
    pose(c) {
      const period = 1.3 - Math.min(0.4, c.speed * 0.004)
      const ph = (c.t % period) / period
      const pull = Math.sin(ph * Math.PI)
      const snap = seg(ph, 0.45, 0.6)
      const split = ph < 0.45 ? seg(ph, 0, 0.45) : 1 - snap
      if (every(c, period, period * 0.55)) kickSplash(c, 3)
      return prone(c, {
        rot: 1.45,
        headRot: -0.45,
        sx: 0.94,
        armN: lerp(Math.PI, 1.6, pull),
        elbowN: pull * 1.2,
        armF: lerp(0.2, 1.4, pull),
        elbowF: pull * 0.8,
        legN: split * 1.1,
        kneeN: split * 1.2,
        legF: -split * 0.7,
        kneeF: split * 0.4,
        eyes: ph > 0.6 ? "closed" : "meh",
      })
    },
  },
  {
    id: "S6",
    name: "Water polo",
    note: "Head-up crawl, short choppy strokes, eyes always on the fish.",
    duration: 0,
    pose(c) {
      const w = strokeRate(c, 4.4) * c.t
      const n = crawlArm(Math.PI - w)
      const f = crawlArm(-w)
      if (every(c, Math.PI / strokeRate(c, 4.4))) entry(c, 22, 2)
      if (every(c, 0.15)) wake(c, 20)
      return prone(c, {
        h: c.anchor.h + 4,
        rot: 0.95,
        headRot: -0.35,
        armN: n.a,
        elbowN: n.e + 0.4,
        armF: f.a,
        elbowF: f.e + 0.4,
        legN: 0.5 + Math.sin(w * 2) * 0.5,
        kneeN: 0.9 + Math.sin(w * 2) * 0.4,
        legF: 0.5 - Math.sin(w * 2) * 0.5,
        kneeF: 0.9 - Math.sin(w * 2) * 0.4,
        look: 0.8,
      })
    },
  },
  {
    id: "S7",
    name: "Frog kick & glide",
    note: "Breaststroke rhythm: pull, tuck, big frog kick, long lazy glide.",
    duration: 0,
    pose(c) {
      const period = 1.5 - Math.min(0.6, c.speed * 0.005)
      const ph = (c.t % period) / period
      // pull 0-.3, recover+tuck .3-.45, kick .45-.6, glide .6-1
      const pull = seg(ph, 0, 0.3)
      const rec = seg(ph, 0.3, 0.45)
      const kick = seg(ph, 0.45, 0.6)
      let arm = Math.PI
      let elbow = 0
      if (ph < 0.3) arm = lerp(Math.PI, 1.7, pull)
      else if (ph < 0.45) {
        arm = lerp(1.7, Math.PI, rec)
        elbow = Math.sin(rec * Math.PI) * 1.4
      }
      const tuck = ph < 0.3 ? 0 : ph < 0.45 ? rec : 1 - kick
      if (every(c, period, period * 0.47)) kickSplash(c, 4)
      if (every(c, 0.25)) wake(c)
      const gliding = ph >= 0.6
      return prone(c, {
        h: c.anchor.h + 4 + (ph < 0.3 ? pull * 3 : 0) - (gliding ? 2 : 0),
        rot: 1.3 - (ph < 0.3 ? pull * 0.15 : 0),
        headRot: ph < 0.3 ? -1.0 - pull * 0.3 : -0.6,
        armN: arm,
        elbowN: elbow,
        armF: arm - 0.08,
        elbowF: elbow,
        legN: 0.1 + tuck * 1.5,
        kneeN: tuck * 2.2,
        legF: -0.1 + tuck * 1.4,
        kneeF: tuck * 2.1,
        eyes: gliding ? "closed" : "meh",
      })
    },
  },
  {
    id: "S8",
    name: "Elementary backstroke",
    note: "On its back: paws slide up, sweep out and down together, long float. Very chill.",
    duration: 0,
    pose(c) {
      const period = 1.6 - Math.min(0.5, c.speed * 0.004)
      const ph = (c.t % period) / period
      const up = seg(ph, 0, 0.3)
      const sweep = seg(ph, 0.3, 0.5)
      const arm = ph < 0.3 ? lerp(0, 1.9, up) : ph < 0.5 ? lerp(1.9, 0, sweep) : 0
      const elbow = ph < 0.3 ? Math.sin(up * Math.PI) * 1.6 : 0
      const tuck = ph < 0.3 ? up : ph < 0.5 ? 1 - sweep : 0
      if (every(c, period, period * 0.45)) kickSplash(c, 2)
      return supine(c, {
        armN: arm,
        elbowN: elbow,
        armF: arm - 0.1,
        elbowF: elbow,
        legN: tuck * 1.3,
        kneeN: tuck * 2,
        legF: tuck * 1.2,
        kneeF: tuck * 1.9,
        eyes: ph > 0.55 ? "closed" : "meh",
      })
    },
  },
  {
    id: "S9",
    name: "Trudgen",
    note: "Old-timey crawl: overarm strokes with one big scissor kick per cycle.",
    duration: 0,
    pose(c) {
      const w = strokeRate(c, 2.8) * c.t
      const n = crawlArm(Math.PI - w)
      const f = crawlArm(-w)
      const cyc = (((w % TAU) + TAU) % TAU) / TAU
      const sc = Math.sin(seg(cyc, 0.1, 0.45) * Math.PI)
      if (every(c, TAU / strokeRate(c, 2.8), 0.3)) kickSplash(c, 4)
      if (every(c, Math.PI / strokeRate(c, 2.8))) entry(c)
      return prone(c, {
        armN: n.a,
        elbowN: n.e * 0.4,
        armF: f.a,
        elbowF: f.e * 0.4,
        legN: sc * 1.2,
        kneeN: sc * 1.4,
        legF: -sc * 0.6,
        kneeF: sc * 0.5,
        headRot: -0.8,
      })
    },
  },
  {
    id: "S10",
    name: "Catch-up",
    note: "Drill-style crawl: one arm waits out front until the other catches up.",
    duration: 0,
    pose(c) {
      const period = 1.2 - Math.min(0.4, c.speed * 0.003)
      const ph = (c.t % (period * 2)) / period
      // first half the near arm strokes while the far one waits ahead; then swap
      const k = ph % 1
      const moving = crawlArm(Math.PI - k * TAU)
      const waiting = { a: Math.PI, e: 0 }
      const nearMoves = ph < 1
      const n = nearMoves ? moving : waiting
      const f = nearMoves ? waiting : moving
      if (every(c, period, period * 0.95)) entry(c)
      if (every(c, 0.25)) wake(c)
      return prone(c, {
        armN: n.a,
        elbowN: n.e,
        armF: f.a,
        elbowF: f.e,
        legN: 0.15 + Math.sin(c.t * 14) * 0.2,
        kneeN: 0.2,
        legF: 0.15 - Math.sin(c.t * 14) * 0.2,
        kneeF: 0.2,
        headRot: -0.7,
      })
    },
  },
]
