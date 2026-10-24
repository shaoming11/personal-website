// Turns World state + the chosen variants into frames.

import { DECISION_DT, SWIM_ACTIONS, describeSwimState } from "@/lib/bear/brain"
import { CATCH_DUR, STAND_H, type Durations, type World } from "@/lib/bear/world"
import { type AnimCtx, type Category, type Variant, lerp } from "./anim"
import { VIEW, Particles, Wavelets, drawBear, drawFish, drawPond, drawRock, drawWaterRing, pose, proj, screenFace, type Pose } from "./rig"
import { jumpVariants } from "./variants/jump"
import { swimVariants } from "./variants/swim"
import { catchVariants } from "./variants/catch"
import { eatVariants } from "./variants/eat"

export const VARIANTS: Record<Category, Variant[]> = {
  jump: jumpVariants,
  swim: swimVariants,
  catch: catchVariants,
  eat: eatVariants,
}

export type Picks = Record<Category, string>

export function variant(cat: Category, id: string) {
  return VARIANTS[cat].find((v) => v.id === id) ?? VARIANTS[cat][0]
}

export function durationsFor(picks: Picks): Durations {
  return { idle: 1.4, jump: variant("jump", picks.jump).duration, eat: variant("eat", picks.eat).duration, climb: 0.7 }
}

// Standing on the rock, unbothered. Glances at the fish now and then.
export function idlePose(x: number, z: number, t: number, face: 1 | -1, look: number): Pose {
  const sway = Math.sin(t * 1.4)
  const blink = t % 4.1 < 0.12
  return pose({
    x,
    z,
    h: STAND_H + Math.sin(t * 2.2) * 0.5,
    face,
    rot: sway * 0.02,
    headRot: 0.05 + sway * 0.03,
    eyes: blink ? "closed" : "meh",
    look,
    ears: t % 6.3 < 0.25 ? Math.sin(t * 40) : 0,
  })
}

export function climbPose(x: number, z: number, h: number, k: number, face: 1 | -1): Pose {
  const b = Math.sin(k * Math.PI)
  return pose({ x, z, h, face, rot: 0.25 * b, armN: lerp(2.8, 0.15, k), elbowN: 0.3, armF: lerp(2.6, 0.1, k), elbowF: 0.3, legN: 0.9 * b, kneeN: 1.4 * b, legF: 0.6 * b, kneeF: 1.2 * b })
}

export class WorldView {
  particles = new Particles()
  wavelets = new Wavelets()
  private lastPhase = ""
  private prevU = 0

  render(ctx: CanvasRenderingContext2D, world: World, picks: Picks, dt: number, debug: boolean) {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, VIEW.W, VIEW.H)
    drawPond(ctx)

    const f = world.fish
    if (f.alive && !f.dragged) drawFish(ctx, f.x, f.z, f.vx, f.vz, world.time, false)
    this.wavelets.step(dt)
    this.wavelets.draw(ctx)

    const b = world.bear
    const r = world.rock
    const bearPose = this.bearPose(world, picks, dt)
    const inWater = world.phase === "swim" || world.phase === "catch" || world.phase === "eat" || world.phase === "return"
    const onRock = world.phase === "idle" || world.phase === "climb" || (world.phase === "jump" && world.t / world.durations.jump < 0.45)
    const bearKey = onRock ? r.x + r.z + 1 : b.x + b.z
    const drawB = () => {
      if (inWater) drawWaterRing(ctx, bearPose.x, bearPose.z, 15, "back", world.time)
      drawBear(ctx, bearPose)
      if (inWater) drawWaterRing(ctx, bearPose.x, bearPose.z, 15, "front", world.time)
    }
    const drawR = () => drawRock(ctx, r.x, r.z, r.dragged ? 6 : 0)
    if (bearKey < r.x + r.z) {
      drawB()
      drawR()
    } else {
      drawR()
      drawB()
    }
    if (f.alive && f.dragged) drawFish(ctx, f.x, f.z, f.vx, f.vz, world.time, true)

    this.particles.step(dt)
    this.particles.draw(ctx)
    if (debug) this.drawDebug(ctx, world)
  }

  private bearPose(world: World, picks: Picks, dt: number): Pose {
    const b = world.bear
    if (world.phase !== this.lastPhase) {
      this.lastPhase = world.phase
      this.prevU = 0
    }
    const d = world.durations
    const base = (u: number, extra: Partial<AnimCtx> = {}): AnimCtx => ({
      u,
      pu: this.prevU,
      t: world.t,
      dt,
      from: world.jumpFrom,
      to: world.jumpTo,
      anchor: { x: b.x, z: b.z, h: b.h },
      heading: b.heading,
      speed: b.speed,
      success: world.catchSuccess,
      fx: this.particles.emit,
      rand: Math.random,
      ...extra,
    })
    const run = (v: Variant, u: number, extra?: Partial<AnimCtx>) => {
      const p = v.pose(base(u, extra))
      this.prevU = u
      return p
    }

    switch (world.phase) {
      case "idle": {
        const f = world.fish
        const face = f.alive ? screenFace(Math.atan2(f.z - b.z, f.x - b.x)) : 1
        const glance = f.alive && world.time % 5 < 2.2 ? 0.8 : 0
        return idlePose(b.x, b.z, world.time, face, glance)
      }
      case "jump":
        return run(variant("jump", picks.jump), Math.min(1, world.t / Math.max(0.001, d.jump)), { heading: world.jumpAngle })
      case "swim":
        return run(variant("swim", picks.swim), 0, { t: world.time })
      case "catch":
        return run(variant("catch", picks.catch), Math.min(1, world.t / CATCH_DUR), { heading: world.catchHeading })
      case "eat":
        return run(variant("eat", picks.eat), Math.min(1, world.t / Math.max(0.001, d.eat)), { heading: world.catchHeading })
      case "return":
        return run(variant("swim", picks.swim), 0, { t: world.time })
      case "climb": {
        const k = Math.min(1, world.t / Math.max(0.001, d.climb))
        return climbPose(b.x, b.z, b.h, k, screenFace(Math.atan2(world.rock.z - world.climbFrom.z, world.rock.x - world.climbFrom.x)))
      }
    }
  }

  private drawDebug(ctx: CanvasRenderingContext2D, world: World) {
    const b = world.bear
    const f = world.fish
    ctx.save()
    if (world.phase === "swim" || world.phase === "catch") {
      const a = proj(b.x, b.z)
      const c = proj(f.x, f.z)
      const hd = proj(b.x + Math.cos(b.heading) * 40, b.z + Math.sin(b.heading) * 40)
      ctx.strokeStyle = "rgba(0,0,0,0.3)"
      ctx.setLineDash([3, 4])
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(c.x, c.y)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.strokeStyle = "rgba(220,60,60,0.7)"
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(hd.x, hd.y)
      ctx.stroke()
    }
    const x = VIEW.W - 196
    const y0 = 8
    ctx.fillStyle = "rgba(255,255,255,0.88)"
    ctx.fillRect(x, y0, 188, 84)
    ctx.fillStyle = "#222"
    ctx.font = "7px ui-monospace, Menlo, monospace"
    ctx.textAlign = "left"
    ctx.fillText(`phase  ${world.phase}${world.frozen ? "  (frozen)" : ""}`, x + 6, y0 + 11)
    ctx.fillText(`state  ${describeSwimState(world.state)}`, x + 6, y0 + 21)
    ctx.fillText(`action ${SWIM_ACTIONS[world.action].name}  every ${Math.round(DECISION_DT * 1000)}ms`, x + 6, y0 + 31)
    const q = world.brain.swimValues(world.state)
    let lo = Infinity
    let hi = -Infinity
    for (const v of q) {
      lo = Math.min(lo, v)
      hi = Math.max(hi, v)
    }
    const span = Math.max(1e-3, hi - lo)
    SWIM_ACTIONS.forEach((a, i) => {
      const y = y0 + 38 + i * 6.5
      ctx.fillStyle = i === world.action ? "#d0662e" : "#9a9a9a"
      ctx.fillRect(x + 6, y, 3 + ((q[i] - lo) / span) * 90, 4)
      ctx.fillStyle = "#555"
      ctx.font = "5.5px ui-monospace, Menlo, monospace"
      ctx.fillText(`${a.name}  ${q[i].toFixed(2)}`, x + 104, y + 4)
    })
    ctx.restore()
  }
}
