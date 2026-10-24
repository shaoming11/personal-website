// The bear's learner. Two small tabular policies, both serializable and mergeable so
// many visitors' sessions can be averaged into one shared brain later.
//
//   dive  — contextual bandit on the rock: where to splash in, given where the fish is.
//   swim  — Q-learning in the water: steer / paddle / glide / lunge, every DECISION_DT.

export const DECISION_DT = 0.12

// ---- swim state: (bearing to fish) x (distance) x (fish sideways motion) x (rock in the way) ----
export const ANGLE_BUCKETS = 12
// Edges line up with the lunge: a lunge started 60-100px out lands the jaws on the fish.
export const DIST_EDGES = [40, 65, 100, 160] // -> 5 buckets
export const LATERAL_BUCKETS = 3 // fish drifting left / steady / right of the bear's line of sight
export const SWIM_STATES = ANGLE_BUCKETS * (DIST_EDGES.length + 1) * LATERAL_BUCKETS * 2

export const SWIM_ACTIONS = [
  { name: "left · paddle", turn: -1, paddle: true, lunge: false },
  { name: "straight · paddle", turn: 0, paddle: true, lunge: false },
  { name: "right · paddle", turn: 1, paddle: true, lunge: false },
  { name: "left · glide", turn: -1, paddle: false, lunge: false },
  { name: "straight · glide", turn: 0, paddle: false, lunge: false },
  { name: "right · glide", turn: 1, paddle: false, lunge: false },
  { name: "lunge", turn: 0, paddle: false, lunge: true },
] as const
export const LUNGE = SWIM_ACTIONS.length - 1

// ---- dive: context = where the fish is relative to the rock (8 directions x near/far);
// action = splash point (8 directions x 2 distances) ----
export const DIVE_DIRS = 8
export const DIVE_CONTEXTS = DIVE_DIRS * 2
export const DIVE_ACTIONS = DIVE_DIRS * 2

export interface SwimObs {
  rel: number // angle from bear heading to fish, radians (-pi, pi]
  dist: number
  lateral: number // fish velocity across the line of sight, px/s
  blocked: boolean // the rock sits between bear and fish
}

export function swimState({ rel, dist, lateral, blocked }: SwimObs) {
  const a = Math.floor((wrap(rel) + Math.PI + Math.PI / ANGLE_BUCKETS) / ((2 * Math.PI) / ANGLE_BUCKETS)) % ANGLE_BUCKETS
  let d = DIST_EDGES.findIndex((e) => dist < e)
  if (d < 0) d = DIST_EDGES.length
  const l = lateral < -20 ? 0 : lateral > 20 ? 2 : 1
  return ((a * (DIST_EDGES.length + 1) + d) * LATERAL_BUCKETS + l) * 2 + (blocked ? 1 : 0)
}

export function describeSwimState(state: number) {
  const blocked = state % 2 === 1
  const s = Math.floor(state / 2)
  const l = s % LATERAL_BUCKETS
  const d = Math.floor(s / LATERAL_BUCKETS) % (DIST_EDGES.length + 1)
  const a = Math.floor(s / LATERAL_BUCKETS / (DIST_EDGES.length + 1))
  const deg = Math.round((a * 360) / ANGLE_BUCKETS - 180)
  const angle = deg === 0 ? "ahead" : deg === -180 ? "behind" : `${Math.abs(deg)}° ${deg < 0 ? "left" : "right"}`
  return `${angle} · ${["too close", "close", "lunge range", "mid", "far"][d]} · ${["drifting L", "steady", "drifting R"][l]}${blocked ? " · rock in way" : ""}`
}

export function diveContext(dx: number, dz: number) {
  const dir = Math.floor(((Math.atan2(dz, dx) + 2 * Math.PI + Math.PI / DIVE_DIRS) % (2 * Math.PI)) / ((2 * Math.PI) / DIVE_DIRS)) % DIVE_DIRS
  return dir * 2 + (Math.hypot(dx, dz) > 120 ? 1 : 0)
}

export function wrap(a: number) {
  while (a > Math.PI) a -= 2 * Math.PI
  while (a <= -Math.PI) a += 2 * Math.PI
  return a
}

export interface BrainJSON {
  v: 1
  episodes: number
  catches: number
  swimQ: number[]
  swimN: number[]
  diveQ: number[]
  diveN: number[]
}

export interface BrainParams {
  alpha: number
  gamma: number
  epsStart: number
  epsMin: number
  epsDecay: number // per episode
}

export const DEFAULT_PARAMS: BrainParams = { alpha: 0.05, gamma: 0.96, epsStart: 0.9, epsMin: 0.03, epsDecay: 0.99 }

export class Brain {
  swimQ = new Float32Array(SWIM_STATES * SWIM_ACTIONS.length)
  swimN = new Uint32Array(SWIM_STATES * SWIM_ACTIONS.length)
  diveQ = new Float32Array(DIVE_CONTEXTS * DIVE_ACTIONS)
  diveN = new Uint32Array(DIVE_CONTEXTS * DIVE_ACTIONS)
  episodes = 0
  catches = 0
  params: BrainParams

  constructor(params: Partial<BrainParams> = {}) {
    this.params = { ...DEFAULT_PARAMS, ...params }
  }

  get epsilon() {
    const p = this.params
    return Math.max(p.epsMin, p.epsStart * Math.pow(p.epsDecay, this.episodes))
  }

  // ---- swim ----
  swimValues(s: number) {
    return this.swimQ.subarray(s * SWIM_ACTIONS.length, (s + 1) * SWIM_ACTIONS.length)
  }

  actSwim(s: number, rand: () => number, eps = this.epsilon) {
    if (rand() < eps) return Math.floor(rand() * SWIM_ACTIONS.length)
    return argmax(this.swimValues(s), rand)
  }

  // next === null means terminal.
  learnSwim(s: number, a: number, r: number, next: number | null) {
    const { alpha, gamma } = this.params
    const i = s * SWIM_ACTIONS.length + a
    const target = next === null ? r : r + gamma * max(this.swimValues(next))
    this.swimN[i]++
    // Visit-count step size: fast early, settles once a cell has been seen a lot.
    this.swimQ[i] += Math.max(alpha, 1 / this.swimN[i]) * (target - this.swimQ[i])
  }

  // ---- dive ----
  actDive(ctx: number, rand: () => number, eps = this.epsilon) {
    if (rand() < eps) return Math.floor(rand() * DIVE_ACTIONS)
    return argmax(this.diveQ.subarray(ctx * DIVE_ACTIONS, (ctx + 1) * DIVE_ACTIONS), rand)
  }

  learnDive(ctx: number, a: number, r: number) {
    const i = ctx * DIVE_ACTIONS + a
    this.diveN[i]++
    this.diveQ[i] += Math.max(1 / this.diveN[i], 0.1) * (r - this.diveQ[i])
  }

  endEpisode(caught: boolean) {
    this.episodes++
    if (caught) this.catches++
  }

  // ---- crowd plumbing ----
  toJSON(): BrainJSON {
    return {
      v: 1,
      episodes: this.episodes,
      catches: this.catches,
      swimQ: Array.from(this.swimQ, round4),
      swimN: Array.from(this.swimN),
      diveQ: Array.from(this.diveQ, round4),
      diveN: Array.from(this.diveN),
    }
  }

  static fromJSON(j: BrainJSON, params?: Partial<BrainParams>) {
    const b = new Brain(params)
    if (j.v !== 1 || j.swimQ.length !== b.swimQ.length || j.diveQ.length !== b.diveQ.length) return b
    b.swimQ.set(j.swimQ)
    b.swimN.set(j.swimN)
    b.diveQ.set(j.diveQ)
    b.diveN.set(j.diveN)
    b.episodes = j.episodes
    b.catches = j.catches
    return b
  }

  // Visit-weighted average per (state, action): a cell one visitor explored a lot
  // outweighs a cell another barely touched. Order-independent, so a server can fold
  // sessions in as they arrive.
  merge(other: Brain) {
    mergeTable(this.swimQ, this.swimN, other.swimQ, other.swimN)
    mergeTable(this.diveQ, this.diveN, other.diveQ, other.diveN)
    this.episodes += other.episodes
    this.catches += other.catches
  }

  coverage() {
    let seen = 0
    for (let s = 0; s < SWIM_STATES; s++) {
      for (let a = 0; a < SWIM_ACTIONS.length; a++) {
        if (this.swimN[s * SWIM_ACTIONS.length + a] > 0) {
          seen++
          break
        }
      }
    }
    return seen / SWIM_STATES
  }
}

function mergeTable(q: Float32Array, n: Uint32Array, oq: Float32Array, on: Uint32Array) {
  for (let i = 0; i < q.length; i++) {
    const total = n[i] + on[i]
    if (total === 0) continue
    q[i] = (q[i] * n[i] + oq[i] * on[i]) / total
    n[i] = total
  }
}

function argmax(v: ArrayLike<number>, rand: () => number) {
  let best = -Infinity
  let picks: number[] = []
  for (let i = 0; i < v.length; i++) {
    if (v[i] > best + 1e-9) {
      best = v[i]
      picks = [i]
    } else if (Math.abs(v[i] - best) <= 1e-9) picks.push(i)
  }
  return picks[Math.floor(rand() * picks.length)]
}

function max(v: ArrayLike<number>) {
  let m = -Infinity
  for (let i = 0; i < v.length; i++) if (v[i] > m) m = v[i]
  return m
}

function round4(x: number) {
  return Math.round(x * 1e4) / 1e4
}

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
