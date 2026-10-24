// Pond physics + the bear's loop, independent of how anything is drawn. The pond is a
// flat plane (x, z); h is height above the water surface. Runs the same code visually
// (real durations for the cosmetic phases) or headless (cosmetic phases skipped) so
// training at 1000x is the same task the visitor watches.
//
// idle on rock -> jump (dive bandit picks the splash) -> swim (Q policy) -> catch
//   -> eat -> return -> climb -> idle

import { Brain, DECISION_DT, DIVE_DIRS, LUNGE, SWIM_ACTIONS, diveContext, swimState, wrap } from "./brain"

export const POND = { X: 340, Z: 240 }
export const ROCK_R = 34
export const ROCK_H = 22
export const STAND_H = ROCK_H + 36 // body center height standing on the rock
export const SWIM_H = -6 // body center while swimming at the surface
export const TREAD_H = -1 // body center treading water upright
const EDGE = 26

export const CATCH_DUR = 0.8
export const CATCH_MOMENT = 0.4 // fraction of CATCH_DUR where the paws close
export const GRAB_REACH = 30 // paws reach this far ahead of body center
export const CATCH_RADIUS = 22
export const LUNGE_DIST = 46
const TURN_PADDLE = 2.6
const TURN_GLIDE = 5
const PADDLE_SPEED = 105
const GLIDE_SPEED = 45
const SWIM_TIMEOUT = 14

export type Phase = "idle" | "jump" | "swim" | "catch" | "eat" | "return" | "climb"

export interface Durations {
  idle: number
  jump: number
  eat: number
  climb: number
}

export const HEADLESS: Durations = { idle: 0, jump: 0, eat: 0, climb: 0 }

export interface Episode {
  caught: boolean
  swimTime: number
  misses: number
  dive: number
}

export interface Vec3 {
  x: number
  z: number
  h: number
}

export function clamp(x: number, a: number, b: number) {
  return x < a ? a : x > b ? b : x
}
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export class World {
  rand: () => number
  brain: Brain
  phase: Phase = "idle"
  t = 0 // time in phase
  time = 0
  durations: Durations
  // When frozen the bear acts (almost) greedily and doesn't update.
  frozen = false

  rock = { x: POND.X / 2, z: POND.Z / 2, dragged: false }
  bear = { x: POND.X / 2, z: POND.Z / 2, h: STAND_H, heading: 0, speed: 0, hasFish: false }
  fish = { x: 280, z: 190, vx: -40, vz: 0, wander: Math.PI, stamina: 1, dragged: false, alive: true }

  // phase scratch
  jumpFrom: Vec3 = { x: 0, z: 0, h: STAND_H }
  jumpTo: Vec3 = { x: 0, z: 0, h: SWIM_H }
  jumpAngle = 0
  catchFrom: Vec3 = { x: 0, z: 0, h: SWIM_H }
  catchSuccess: boolean | null = null
  catchHeading = 0
  climbFrom: Vec3 = { x: 0, z: 0, h: SWIM_H }

  // learning scratch
  private decisionT = 0
  private prevState = -1
  private prevAction = -1
  private pending = 0 // reward accumulated since last decision
  private lastDist = 0
  action = 1
  state = 0
  ep = { swimTime: 0, misses: 0, diveCtx: 0, dive: 0 }
  history: Episode[] = []
  flung = 0
  onEpisode?: (e: Episode) => void
  onPhase?: (p: Phase) => void

  // Simulated visitor flicks per second, for headless crowd training.
  chaos = 0

  constructor(brain: Brain, rand: () => number, durations: Durations) {
    this.brain = brain
    this.rand = rand
    this.durations = durations
    this.respawnFish()
  }

  get headless() {
    return this.durations === HEADLESS
  }

  private enter(p: Phase) {
    this.phase = p
    this.t = 0
    this.onPhase?.(p)
  }

  respawnFish() {
    const f = this.fish
    for (let i = 0; i < 20; i++) {
      f.x = EDGE + 20 + this.rand() * (POND.X - 2 * EDGE - 40)
      f.z = EDGE + 20 + this.rand() * (POND.Z - 2 * EDGE - 40)
      if (Math.hypot(f.x - this.rock.x, f.z - this.rock.z) > ROCK_R + 60) break
    }
    f.wander = this.rand() * Math.PI * 2
    f.vx = Math.cos(f.wander) * 40
    f.vz = Math.sin(f.wander) * 40
    f.stamina = 1
    f.alive = true
    f.dragged = false
  }

  // ---- visitor input ----
  dragFish(x: number, z: number, dt: number) {
    const f = this.fish
    if (!f.alive) return
    const p = this.keepInWater(x, z, ROCK_R + 8)
    if (dt > 0) {
      f.vx = lerp(f.vx, (p.x - f.x) / dt, 0.5)
      f.vz = lerp(f.vz, (p.z - f.z) / dt, 0.5)
    }
    f.x = p.x
    f.z = p.z
    f.dragged = true
  }

  releaseFish() {
    const f = this.fish
    f.dragged = false
    const sp = Math.hypot(f.vx, f.vz)
    if (sp > 120) this.flung++
    if (sp > 220) {
      f.vx *= 220 / sp
      f.vz *= 220 / sp
    }
    f.wander = Math.atan2(f.vz, f.vx)
  }

  dragRock(x: number, z: number) {
    const m = ROCK_R + 10
    this.rock.x = clamp(x, m, POND.X - m)
    this.rock.z = clamp(z, m, POND.Z - m)
    this.rock.dragged = true
  }

  releaseRock() {
    this.rock.dragged = false
  }

  // ---- main step ----
  step(dt: number) {
    this.time += dt
    this.t += dt
    this.stepFish(dt)
    const b = this.bear
    const d = this.durations

    switch (this.phase) {
      case "idle": {
        b.x = this.rock.x
        b.z = this.rock.z
        b.h = STAND_H
        if (this.t >= d.idle && !this.rock.dragged) this.startJump()
        break
      }
      case "jump": {
        if (this.t >= d.jump) {
          b.x = this.jumpTo.x
          b.z = this.jumpTo.z
          b.h = SWIM_H
          b.heading = this.jumpAngle
          b.speed = 70
          this.startSwim()
        }
        break
      }
      case "swim": {
        this.ep.swimTime += dt
        this.decisionT -= dt
        if (this.decisionT <= 0) this.decide()
        if (this.phase !== "swim") break
        const a = SWIM_ACTIONS[this.action]
        b.heading = wrap(b.heading + a.turn * (a.paddle ? TURN_PADDLE : TURN_GLIDE) * dt)
        const target = a.paddle ? PADDLE_SPEED : GLIDE_SPEED
        b.speed += (target - b.speed) * Math.min(1, dt * 3)
        this.moveBear(dt)
        this.pending += this.shaping()
        if (this.ep.swimTime > SWIM_TIMEOUT) this.giveUp()
        break
      }
      case "catch": {
        const u = this.t / CATCH_DUR
        const k = easeOutCubic(Math.min(1, u / CATCH_MOMENT))
        const p = this.keepInWater(
          this.catchFrom.x + Math.cos(this.catchHeading) * LUNGE_DIST * k,
          this.catchFrom.z + Math.sin(this.catchHeading) * LUNGE_DIST * k,
          ROCK_R + 14,
        )
        b.x = p.x
        b.z = p.z
        // Sweep test: the paws catch anything they pass over during the dash.
        if (this.catchSuccess === null && (this.pawsHit() || u >= CATCH_MOMENT)) this.resolveCatch()
        if (u >= 1) {
          if (this.catchSuccess) this.enter("eat")
          else {
            b.speed = 30
            this.enter("swim")
            this.decisionT = 0
          }
        }
        break
      }
      case "eat": {
        if (this.t >= d.eat) {
          b.hasFish = false
          this.respawnFish()
          this.enter("return")
        }
        break
      }
      case "return": {
        const dx = this.rock.x - b.x
        const dz = this.rock.z - b.z
        const dist = Math.hypot(dx, dz)
        b.heading = Math.atan2(dz, dx)
        b.speed = PADDLE_SPEED * 0.8
        if (this.headless || dist <= ROCK_R + 16) {
          this.climbFrom = { x: b.x, z: b.z, h: SWIM_H }
          this.enter("climb")
          break
        }
        b.x += (dx / dist) * b.speed * dt
        b.z += (dz / dist) * b.speed * dt
        break
      }
      case "climb": {
        const u = d.climb > 0 ? Math.min(1, this.t / d.climb) : 1
        b.x = lerp(this.climbFrom.x, this.rock.x, u)
        b.z = lerp(this.climbFrom.z, this.rock.z, u)
        b.h = lerp(this.climbFrom.h, STAND_H, u) + Math.sin(u * Math.PI) * 26
        if (u >= 1) this.enter("idle")
        break
      }
    }
  }

  private startJump() {
    const f = this.fish
    const r = this.rock
    this.ep = { swimTime: 0, misses: 0, diveCtx: diveContext(f.x - r.x, f.z - r.z), dive: 0 }
    this.ep.dive = this.brain.actDive(this.ep.diveCtx, this.rand, this.frozen ? this.brain.params.epsMin : undefined)
    const dir = this.ep.dive >> 1
    const far = this.ep.dive & 1
    const ang = (dir / DIVE_DIRS) * Math.PI * 2
    const dist = ROCK_R + (far ? 90 : 44)
    const p = this.keepInWater(r.x + Math.cos(ang) * dist, r.z + Math.sin(ang) * dist, ROCK_R + 16)
    this.jumpFrom = { x: r.x, z: r.z, h: STAND_H }
    this.jumpTo = { x: p.x, z: p.z, h: SWIM_H }
    this.jumpAngle = Math.atan2(p.z - r.z, p.x - r.x)
    this.bear.heading = this.jumpAngle
    this.enter("jump")
    if (this.headless) this.step(0)
  }

  private startSwim() {
    this.enter("swim")
    this.prevState = -1
    this.prevAction = -1
    this.pending = 0
    this.decisionT = 0
    this.lastDist = this.fishDist()
  }

  private decide() {
    this.decisionT = DECISION_DT
    const s = this.observe()
    this.state = s
    if (this.prevState >= 0 && !this.frozen) {
      this.brain.learnSwim(this.prevState, this.prevAction, this.pending - 0.02, s)
    }
    this.pending = 0
    const a = this.brain.actSwim(s, this.rand, this.frozen ? this.brain.params.epsMin : undefined)
    this.prevState = s
    this.prevAction = a
    this.action = a
    if (a === LUNGE) this.startCatch()
  }

  private startCatch() {
    const b = this.bear
    this.catchFrom = { x: b.x, z: b.z, h: b.h }
    this.catchHeading = b.heading
    this.catchSuccess = null
    this.enter("catch")
  }

  private pawsHit() {
    const b = this.bear
    const f = this.fish
    const px = b.x + Math.cos(this.catchHeading) * GRAB_REACH
    const pz = b.z + Math.sin(this.catchHeading) * GRAB_REACH
    return f.alive && Math.hypot(f.x - px, f.z - pz) < CATCH_RADIUS
  }

  private resolveCatch() {
    const b = this.bear
    const f = this.fish
    const ok = this.pawsHit()
    this.catchSuccess = ok
    if (ok) {
      b.hasFish = true
      f.alive = false
      f.dragged = false
      if (!this.frozen) this.brain.learnSwim(this.prevState, LUNGE, this.pending + 1, null)
      this.endEpisode(true)
    } else {
      this.ep.misses++
      // Miss: penalty now, bootstrapped update at the next decision.
      this.pending -= 0.15
    }
  }

  private giveUp() {
    if (!this.frozen && this.prevState >= 0) this.brain.learnSwim(this.prevState, this.prevAction, this.pending - 0.02, null)
    this.endEpisode(false)
    this.enter("return")
  }

  private endEpisode(caught: boolean) {
    const r = caught ? Math.exp(-this.ep.swimTime / 5) : 0
    if (!this.frozen) {
      this.brain.learnDive(this.ep.diveCtx, this.ep.dive, r)
      this.brain.endEpisode(caught)
    }
    const e: Episode = { caught, swimTime: this.ep.swimTime, misses: this.ep.misses, dive: this.ep.dive }
    this.history.push(e)
    if (this.history.length > 2000) this.history.splice(0, this.history.length - 2000)
    this.onEpisode?.(e)
  }

  private fishDist() {
    return Math.hypot(this.fish.x - this.bear.x, this.fish.z - this.bear.z)
  }

  // Potential-based shaping: reward closing distance.
  private shaping() {
    const d = this.fishDist()
    const r = (this.lastDist - d) / 120
    this.lastDist = d
    return r
  }

  // Does the rock sit on the straight line from bear to fish?
  rockBlocks() {
    const b = this.bear
    const f = this.fish
    const r = this.rock
    const dx = f.x - b.x
    const dz = f.z - b.z
    const len2 = dx * dx + dz * dz || 1
    const t = clamp(((r.x - b.x) * dx + (r.z - b.z) * dz) / len2, 0, 1)
    return Math.hypot(b.x + dx * t - r.x, b.z + dz * t - r.z) < ROCK_R + 10
  }

  observe() {
    const b = this.bear
    const f = this.fish
    const dx = f.x - b.x
    const dz = f.z - b.z
    const dist = Math.hypot(dx, dz) || 1
    const rel = wrap(Math.atan2(dz, dx) - b.heading)
    const lateral = (dx * f.vz - dz * f.vx) / dist
    return swimState({ rel, dist, lateral, blocked: this.rockBlocks() })
  }

  // Clamp to the pond and push out of the rock.
  keepInWater(x: number, z: number, rockMargin: number) {
    x = clamp(x, EDGE, POND.X - EDGE)
    z = clamp(z, EDGE, POND.Z - EDGE)
    const dx = x - this.rock.x
    const dz = z - this.rock.z
    const d = Math.hypot(dx, dz)
    if (d < rockMargin) {
      const k = rockMargin / (d || 1)
      x = this.rock.x + (d ? dx : 1) * k
      z = this.rock.z + (d ? dz : 0) * k
    }
    return { x, z }
  }

  private moveBear(dt: number) {
    const b = this.bear
    const x = b.x + Math.cos(b.heading) * b.speed * dt
    const z = b.z + Math.sin(b.heading) * b.speed * dt
    if (x < EDGE || x > POND.X - EDGE) b.heading = wrap(Math.PI - b.heading)
    if (z < EDGE || z > POND.Z - EDGE) b.heading = wrap(-b.heading)
    const p = this.keepInWater(x, z, ROCK_R + 14)
    // Bumped the rock: slide along it and lose speed.
    if (Math.hypot(p.x - this.rock.x, p.z - this.rock.z) <= ROCK_R + 14.01) b.speed *= 0.6
    b.x = p.x
    b.z = p.z
  }

  private stepFish(dt: number) {
    const f = this.fish
    if (!f.alive || f.dragged) return
    const b = this.bear
    const inWater = this.phase === "swim" || this.phase === "catch"

    f.wander += (this.rand() - 0.5) * 5 * dt
    let dx = Math.cos(f.wander) * 50
    let dz = Math.sin(f.wander) * 50

    const bd = Math.hypot(f.x - b.x, f.z - b.z) || 1
    if (inWater && bd < 110) {
      // Flee, but tire out: a persistent bear wins.
      const k = (1 - bd / 110) * f.stamina
      dx += ((f.x - b.x) / bd) * 150 * k
      dz += ((f.z - b.z) / bd) * 150 * k
      f.stamina = Math.max(0.25, f.stamina - dt * 0.25)
    } else {
      f.stamina = Math.min(1, f.stamina + dt * 0.15)
    }

    if (this.chaos > 0 && this.rand() < this.chaos * dt) {
      const a = this.rand() * Math.PI * 2
      f.vx = Math.cos(a) * 200
      f.vz = Math.sin(a) * 200
      f.wander = a
    }

    // Steer off the walls and the rock.
    const m = 30
    if (f.x < EDGE + m) dx += 120
    if (f.x > POND.X - EDGE - m) dx -= 120
    if (f.z < EDGE + m) dz += 120
    if (f.z > POND.Z - EDGE - m) dz -= 120
    const rd = Math.hypot(f.x - this.rock.x, f.z - this.rock.z) || 1
    if (rd < ROCK_R + 40) {
      dx += ((f.x - this.rock.x) / rd) * 120
      dz += ((f.z - this.rock.z) / rd) * 120
    }

    const k = Math.min(1, dt * 2.5)
    f.vx += (dx - f.vx) * k
    f.vz += (dz - f.vz) * k
    const p = this.keepInWater(f.x + f.vx * dt, f.z + f.vz * dt, ROCK_R + 8)
    f.x = p.x
    f.z = p.z
  }
}

// Run whole episodes as fast as possible.
export function train(world: World, episodes: number, dt = 1 / 30) {
  const prev = world.durations
  world.durations = HEADLESS
  const target = world.history.length + episodes
  let guard = episodes * 2000
  while (world.history.length < target && guard-- > 0) world.step(dt)
  world.durations = prev
  if (world.phase !== "idle") {
    world.phase = "idle"
    world.t = 0
    world.bear.hasFish = false
    if (!world.fish.alive) world.respawnFish()
  }
}
