// Isolated, looping previews of one variant so 10 of a kind can be compared side by side.
// Other phases in a card use the currently picked variants, for context.

import { CATCH_DUR, GRAB_REACH, LUNGE_DIST, POND, ROCK_R, STAND_H, SWIM_H, TREAD_H, type Vec3 } from "@/lib/bear/world"
import { type AnimCtx, type Category, type Variant, easeOut } from "./anim"
import { Particles, Wavelets, drawBear, drawFish, drawPond, drawRock, drawWaterRing, proj, type Pose } from "./rig"
import { idlePose, variant, type Picks } from "./scene"

export const CARD = { w: 360, h: 230, zoom: 1.25 }

const ROCK = { x: POND.X / 2, z: POND.Z / 2 }
// Heading -PI/4 points straight right on screen, so the action reads left-to-right.
const RIGHT = -Math.PI / 4
const dir = (d: number) => ({ x: Math.cos(RIGHT) * d, z: Math.sin(RIGHT) * d })

export class CardSim {
  t = 0
  particles = new Particles()
  wavelets = new Wavelets(10)
  private prevU = 0
  private prevSeg = ""

  constructor(
    public cat: Category,
    public v: Variant,
  ) {}

  draw(ctx: CanvasRenderingContext2D, dt: number, picks: Picks) {
    this.t += dt
    const { bear, fish, focus, inWater } = this.frame(picks)
    const f = proj(focus.x, focus.z, focus.h)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, CARD.w, CARD.h)
    ctx.save()
    ctx.translate(CARD.w / 2, CARD.h / 2)
    const zoom = this.cat === "jump" ? CARD.zoom * 0.88 : CARD.zoom
    ctx.scale(zoom, zoom)
    ctx.translate(-f.x, -f.y)
    drawPond(ctx)
    if (fish) drawFish(ctx, fish.x, fish.z, fish.vx, fish.vz, this.t, false)
    this.wavelets.step(dt)
    this.wavelets.draw(ctx)
    const behind = bear.x + bear.z < ROCK.x + ROCK.z && inWater
    if (behind) this.bear(ctx, bear, inWater)
    drawRock(ctx, ROCK.x, ROCK.z)
    if (!behind) this.bear(ctx, bear, inWater)
    this.particles.step(dt)
    this.particles.draw(ctx)
    ctx.restore()
  }

  // Times (in this card's loop) that span just the variant itself, for filmstrips.
  frameTimes(n: number) {
    const span = (a: number, b: number) => Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1))
    switch (this.cat) {
      case "jump":
        return span(0.7, 0.7 + this.v.duration - 0.001)
      case "swim":
        return span(0, 1.5)
      case "catch":
        return span(1.1, 1.1 + CATCH_DUR + 0.5)
      case "eat":
        return span(0, this.v.duration - 0.001)
    }
  }

  private bear(ctx: CanvasRenderingContext2D, p: Pose, inWater: boolean) {
    if (inWater) drawWaterRing(ctx, p.x, p.z, 15, "back", this.t)
    drawBear(ctx, p)
    if (inWater) drawWaterRing(ctx, p.x, p.z, 15, "front", this.t)
  }

  private ctx(u: number, segment: string, extra: Partial<AnimCtx>): AnimCtx {
    if (segment !== this.prevSeg) {
      this.prevSeg = segment
      this.prevU = 0
    }
    const c: AnimCtx = {
      u,
      pu: this.prevU,
      t: 0,
      dt: 1 / 60,
      from: { x: ROCK.x, z: ROCK.z, h: STAND_H },
      to: { x: ROCK.x, z: ROCK.z, h: SWIM_H },
      anchor: { x: 0, z: 0, h: SWIM_H },
      heading: RIGHT,
      speed: 0,
      success: null,
      fx: this.particles.emit,
      rand: Math.random,
      ...extra,
    }
    this.prevU = u
    return c
  }

  private frame(picks: Picks): { bear: Pose; fish: { x: number; z: number; vx: number; vz: number } | null; focus: Vec3; inWater: boolean } {
    switch (this.cat) {
      case "jump":
        return this.jumpFrame(picks)
      case "swim":
        return this.swimFrame()
      case "catch":
        return this.catchFrame(picks)
      case "eat":
        return this.eatFrame()
    }
  }

  private jumpFrame(picks: Picks) {
    const idle = 0.7
    const after = 1.1
    const total = idle + this.v.duration + after
    const t = this.t % total
    const splash = { x: ROCK.x + dir(ROCK_R + 60).x, z: ROCK.z + dir(ROCK_R + 60).z, h: SWIM_H }
    const focus = { x: (ROCK.x + splash.x) / 2, z: (ROCK.z + splash.z) / 2, h: 42 }
    if (t < idle) return { bear: idlePose(ROCK.x, ROCK.z, this.t, 1, 0), fish: null, focus, inWater: false }
    if (t < idle + this.v.duration) {
      const tt = t - idle
      const bear = this.v.pose(this.ctx(tt / this.v.duration, "jump", { t: tt, to: splash }))
      return { bear, fish: null, focus, inWater: tt / this.v.duration > 0.75 }
    }
    const tt = t - idle - this.v.duration
    const d = dir(tt * 45)
    const bear = variant("swim", picks.swim).pose(this.ctx(0, "swim", { t: tt, anchor: { x: splash.x + d.x, z: splash.z + d.z, h: SWIM_H }, speed: 60 }))
    return { bear, fish: null, focus, inWater: true }
  }

  private swimFrame() {
    // A slow circle, so every facing shows up, with a speed swell for stroke rate.
    const center = { x: ROCK.x + 95, z: ROCK.z - 45 }
    const r = 44
    const a = this.t * 0.5
    const x = center.x + Math.cos(a) * r
    const z = center.z + Math.sin(a) * r
    const heading = a + Math.PI / 2
    const speed = 50 + 55 * (0.5 + 0.5 * Math.sin(this.t * 0.8))
    const bear = this.v.pose(this.ctx(0, "swim", { t: this.t, anchor: { x, z, h: SWIM_H }, heading, speed }))
    return { bear, fish: null, focus: { x: center.x, z: center.z, h: 0 }, inWater: true }
  }

  private catchFrame(picks: Picks) {
    const approach = 1.1
    const hold = 1.0
    const total = approach + CATCH_DUR + hold
    const n = Math.floor(this.t / total)
    const t = this.t % total
    const miss = n % 4 === 3 // every 4th loop shows the miss reaction
    const start = { x: ROCK.x - 20, z: ROCK.z + 95 }
    const at = (d: number) => ({ x: start.x + dir(d).x, z: start.z + dir(d).z })
    const lungeAt = at(55)
    const fishAt = at(55 + LUNGE_DIST * 0.8 + GRAB_REACH)
    const focus = { ...at(85), h: 0 }
    const swimDir = dir(1)
    if (t < approach) {
      const k = t / approach
      const p = at(55 * k)
      const bear = variant("swim", picks.swim).pose(this.ctx(0, "swim", { t: this.t, anchor: { ...p, h: SWIM_H }, speed: 70 }))
      const fp = at(55 + LUNGE_DIST * 0.8 + GRAB_REACH + 40 * (1 - k))
      return { bear, fish: { ...fp, vx: -swimDir.x, vz: -swimDir.z }, focus, inWater: true }
    }
    if (t < approach + CATCH_DUR) {
      const tt = t - approach
      const u = tt / CATCH_DUR
      const dash = easeOut(Math.min(1, u / 0.4)) * LUNGE_DIST
      const success = u < 0.4 ? null : !miss
      const p = at(55 + dash)
      const bear = this.v.pose(this.ctx(u, "catch", { t: tt, anchor: { ...p, h: SWIM_H }, speed: 110, success, from: { ...lungeAt, h: SWIM_H } }))
      const flee = miss ? at(55 + LUNGE_DIST * 0.8 + GRAB_REACH + u * 150) : fishAt
      return { bear, fish: success ? null : { x: flee.x + (miss ? u * 40 : 0), z: flee.z + (miss ? u * 30 : 0), vx: miss ? swimDir.x : -swimDir.x, vz: miss ? swimDir.z : -swimDir.z }, focus, inWater: true }
    }
    const tt = t - approach - CATCH_DUR
    const p = at(55 + LUNGE_DIST)
    const bear = this.v.pose(this.ctx(1, "hold", { t: CATCH_DUR + tt, anchor: { ...p, h: SWIM_H }, speed: 0, success: !miss }))
    return { bear, fish: null, focus, inWater: true }
  }

  private eatFrame() {
    const pause = 0.6
    const total = this.v.duration + pause
    const t = this.t % total
    const spot = { x: ROCK.x + 85, z: ROCK.z + 10, h: TREAD_H }
    const u = Math.min(1, t / this.v.duration)
    const bear = this.v.pose(this.ctx(u, "eat:" + Math.floor(this.t / total), { t, anchor: spot }))
    return { bear, fish: null, focus: { x: spot.x - 10, z: spot.z - 10, h: 10 }, inWater: true }
  }
}

