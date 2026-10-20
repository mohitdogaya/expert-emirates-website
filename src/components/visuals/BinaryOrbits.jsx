import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'

/**
 * BinaryOrbits
 * A tilted spiral galaxy of stars streaming through its arms.
 * Pure canvas 2D, no dependencies. Stars are rasterised into a pixel buffer,
 * so 70k+ stars stay smooth.
 *
 * Usage:
 *   <BinaryOrbits style={{ height: 600 }}>
 *     <h1>Hello</h1>
 *   </BinaryOrbits>
 *
 *   const ref = useRef()
 *   <BinaryOrbits ref={ref} />   ->   ref.current.ripple()
 */

const TAU = Math.PI * 2
const DEFAULT_COLORS = ['#7B4DFF', '#FFC2EE']

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

/* ---------- colour helpers (OKLab blending) ---------- */

function parseColor(input, fallback = [255, 255, 255]) {
  if (typeof input !== 'string') return fallback
  const s = input.trim()
  if (s[0] === '#') {
    let h = s.slice(1)
    if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('')
    if (h.length >= 6) {
      const n = parseInt(h.slice(0, 6), 16)
      if (!Number.isNaN(n)) return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    }
    return fallback
  }
  const m = s.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i)
  if (m) return [+m[1], +m[2], +m[3]]
  return fallback
}

const toLinear = (c) => {
  c /= 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
const toSrgb = (c) => {
  c = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
  return clamp(c, 0, 1) * 255
}

function toOklab([r, g, b]) {
  const R = toLinear(r)
  const G = toLinear(g)
  const B = toLinear(b)
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B)
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B)
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function fromOklab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    toSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ---------- star field ---------- */

function buildStars({ count, arms, innerVoid, thickness, sparkle, coreSize, core, colors, ink }) {
  const rand = mulberry32(7831)
  const gauss = () => {
    const u = 1 - rand()
    const v = rand()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v)
  }

  const c0 = toOklab(parseColor(colors[0], [123, 77, 255]))
  const c1 = toOklab(parseColor(colors[1], [255, 194, 238]))
  const n = Math.max(1, Math.round(arms))
  const period = TAU / n
  const N = count

  const S = {
    count: N,
    arms: n,
    radius: new Float32Array(N),
    angle: new Float32Array(N), // random angle for non-arm stars
    base: new Float32Array(N), // arm index * period
    phase0: new Float32Array(N), // starting offset inside the arm period
    rate: new Float32Array(N), // angular speed relative to the arm pattern
    arm: new Uint8Array(N),
    z: new Float32Array(N),
    size: new Float32Array(N),
    bright: new Float32Array(N),
    twRate: new Float32Array(N),
    twPhase: new Float32Array(N),
    color: new Float32Array(N * 3),
  }

  for (let i = 0; i < N; i++) {
    const bulge = innerVoid <= 0.01 && rand() < 0.1
    let r
    if (bulge) r = Math.min(0.6, Math.abs(gauss()) * coreSize * 1.6)
    else r = innerVoid + (1 - innerVoid) * Math.pow(rand(), 0.75)

    const inArm = !bulge && rand() < 0.84
    S.arm[i] = inArm ? 1 : 0
    S.radius[i] = r
    S.angle[i] = rand() * TAU
    S.base[i] = Math.floor(rand() * n) * period
    S.phase0[i] = rand() * period
    // Inner stars orbit faster than the pattern, outer stars barely move against it.
    S.rate[i] = 0.22 * (1 / (0.28 + r) - 0.95)

    let b = 0.3 + 0.7 * Math.pow(rand(), 1.8)
    let size = 0.55 + 0.75 * rand()
    let spark = false
    if (rand() < sparkle * 0.07) {
      b = 0.85 + 0.15 * rand()
      size *= 1.6 + rand() * 1.2
      spark = true
    }
    S.bright[i] = b
    S.size[i] = size
    S.twRate[i] = 0.6 + 1.6 * rand()
    S.twPhase[i] = rand() * TAU

    S.z[i] = bulge
      ? gauss() * coreSize * 0.7
      : gauss() * thickness * (0.3 + 1.4 * Math.exp(-r * 3))

    // colour: outer -> inner blended in OKLab, core burns toward white
    let m = clamp(1 - Math.pow(r, 0.7) * 1.25, 0, 1)
    m = m * m * (3 - 2 * m)
    const jitter = (rand() - 0.5) * 0.06
    const lab = [
      c0[0] + (c1[0] - c0[0]) * m + jitter,
      c0[1] + (c1[1] - c0[1]) * m,
      c0[2] + (c1[2] - c0[2]) * m,
    ]
    const rgb = fromOklab(lab)
    if (ink) {
      for (let c = 0; c < 3; c++) rgb[c] *= 0.92
    } else {
      let white = Math.exp(-r / (coreSize * 1.5 + 0.01)) * 0.85 * Math.min(1, core * 0.8)
      if (spark) white = Math.max(white, 0.35)
      for (let c = 0; c < 3; c++) rgb[c] += (255 - rgb[c]) * white
    }
    S.color[i * 3] = rgb[0]
    S.color[i * 3 + 1] = rgb[1]
    S.color[i * 3 + 2] = rgb[2]
  }
  return S
}

/* ---------- component ---------- */

const BinaryOrbits = forwardRef(function BinaryOrbits(props, ref) {
  const {
    colors = DEFAULT_COLORS,
    backgroundColor = '#0A0A0A',
    mode = 'auto',
    stars = 70000,
    starSize = 1.7,
    sparkle = 0.5,
    arms = 3,
    twist = 3.5,
    armStrength = 0.5,
    dust = 0.5,
    core = 1,
    coreSize = 0.07,
    innerVoid = 0,
    thickness = 0.02,
    tilt = 62,
    roll = -8,
    scale = 1,
    centerX = 0.5,
    centerY = 0.52,
    speed = 1,
    twinkle = 0.35,
    depth = 0.4,
    glow = 0.45,
    intensity = 1,
    interactive = true,
    hoverWake = true,
    clickRipple = true,
    wakeStrength = 1,
    rippleStrength = 1,
    hoverBoost = 0.5,
    paused = false,
    quality = 1,
    children,
    className,
    style,
  } = props

  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const ringsRef = useRef([])

  const bg = parseColor(backgroundColor, [10, 10, 10])
  const ink = mode === 'ink' || (mode === 'auto' && (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) / 255 > 0.55)

  const starData = useMemo(
    () =>
      buildStars({
        count: clamp(Math.round(stars), 2000, 250000),
        arms,
        innerVoid: clamp(innerVoid, 0, 0.6),
        thickness,
        sparkle: clamp(sparkle, 0, 1),
        coreSize,
        core,
        colors: [colors[0], colors[1]],
        ink,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stars, arms, innerVoid, thickness, sparkle, coreSize, core, colors[0], colors[1], ink],
  )

  const live = {
    S: starData,
    bg,
    ink,
    c1: parseColor(colors[1], [255, 194, 238]),
    starSize,
    twist,
    armStrength: clamp(armStrength, 0, 1),
    dust: clamp(dust, 0, 1),
    coreSize,
    core,
    tilt,
    roll,
    scale,
    centerX,
    centerY,
    speed,
    twinkle: clamp(twinkle, 0, 1),
    depth: clamp(depth, 0, 1),
    glow,
    intensity,
    interactive,
    hoverWake,
    clickRipple,
    wakeStrength,
    rippleStrength,
    hoverBoost,
    paused,
    quality: clamp(quality, 0.25, 1),
  }
  const liveRef = useRef(live)
  useEffect(() => {
    liveRef.current = live
  })

  useImperativeHandle(
    ref,
    () => ({
      ripple: (strength = 1) => {
        ringsRef.current.push({ x: 0, y: 0, t: 0, s: strength })
      },
    }),
    [],
  )

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas && canvas.getContext('2d')
    if (!root || !canvas || !ctx) return undefined

    const small = document.createElement('canvas')
    const sctx = small.getContext('2d')

    const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    let reduced = !!(mq && mq.matches)
    const onMotion = (e) => {
      reduced = e.matches
      dirty = true
    }
    if (mq && mq.addEventListener) mq.addEventListener('change', onMotion)

    let bw = 2
    let bh = 2
    let k = 1
    let img = null
    let data = null
    let u32 = null
    let raf = 0
    let last = 0
    let dirty = true
    let lastQuality = -1
    let lastLive = null
    let curStars = null
    let dr = null
    let dth = null
    let wk = null

    let pat = 0
    let orbitT = 0
    let twT = 0
    let hover = 0
    let wakeLevel = 0

    const pointer = { x: 0, y: 0, lx: 0, ly: 0, active: false }
    const geom = { cx: 0, cy: 0, R: 1, cosR: 1, sinR: 0, cosT: 1 }

    const resize = () => {
      const rect = root.getBoundingClientRect()
      const cssW = Math.max(1, rect.width)
      const cssH = Math.max(1, rect.height)
      const q = liveRef.current.quality
      let s = Math.min(window.devicePixelRatio || 1, 2) * q
      const px = cssW * cssH * s * s
      if (px > 2.6e6) s *= Math.sqrt(2.6e6 / px)
      bw = Math.max(2, Math.round(cssW * s))
      bh = Math.max(2, Math.round(cssH * s))
      k = bw / cssW
      canvas.width = bw
      canvas.height = bh
      img = ctx.createImageData(bw, bh)
      data = img.data
      u32 = new Uint32Array(data.buffer)
      small.width = Math.max(2, bw >> 3)
      small.height = Math.max(2, bh >> 3)
      lastQuality = q
      dirty = true
    }

    const toPlane = (bx, by) => {
      const dx = bx - geom.cx
      const dy = by - geom.cy
      const X = (dx * geom.cosR + dy * geom.sinR) / geom.R
      const Y = (-dx * geom.sinR + dy * geom.cosR) / geom.R
      return { x: X, y: Y / Math.max(geom.cosT, 0.12) }
    }

    const setPointer = (e) => {
      const rect = root.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      if (!pointer.active) {
        pointer.lx = pointer.x * k
        pointer.ly = pointer.y * k
      }
      pointer.active = true
    }
    const onMove = (e) => setPointer(e)
    const onLeave = () => {
      pointer.active = false
    }
    const onDown = (e) => {
      const L = liveRef.current
      if (!L.interactive || !L.clickRipple || reduced) return
      setPointer(e)
      const p = toPlane(pointer.x * k, pointer.y * k)
      if (ringsRef.current.length < 6) ringsRef.current.push({ x: p.x, y: p.y, t: 0, s: L.rippleStrength })
      dirty = true
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('pointerdown', onDown)

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    if (ro) ro.observe(root)
    else window.addEventListener('resize', resize)
    resize()

    const frame = (now) => {
      raf = window.requestAnimationFrame(frame)
      const L = liveRef.current
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now

      if (L.quality !== lastQuality) resize()
      if (L !== lastLive) {
        lastLive = L
        dirty = true
      }
      const S = L.S
      if (S !== curStars) {
        curStars = S
        dr = new Float32Array(S.count)
        dth = new Float32Array(S.count)
        wk = new Float32Array(S.count)
        dirty = true
      }

      const interactive = L.interactive && !reduced
      const frozen = L.paused || reduced
      const rings = ringsRef.current
      if (reduced) rings.length = 0

      const pointerLive = interactive && pointer.active
      const hoverTarget = pointerLive ? 1 : 0
      const hoverMoving = Math.abs(hover - hoverTarget) > 0.003
      const busy = rings.length > 0 || wakeLevel > 0.004 || hoverMoving || pointerLive
      if (frozen && !dirty && !busy) return
      dirty = false

      /* time */
      hover += (hoverTarget - hover) * Math.min(1, dt * 4)
      if (!frozen) {
        const dts = dt * L.speed * (1 + L.hoverBoost * hover)
        pat += dts * 0.03
        orbitT += dts
        twT += dt
      }

      /* geometry */
      const tiltRad = (clamp(L.tilt, 0, 85) * Math.PI) / 180
      const cosT = Math.cos(tiltRad)
      const sinT = Math.sin(tiltRad)
      const rollRad = (L.roll * Math.PI) / 180
      const cosR = Math.cos(rollRad)
      const sinR = Math.sin(rollRad)
      const cx = bw * L.centerX
      const cy = bh * L.centerY
      const R = Math.min(bw * 0.48, (bh * 0.5) / Math.max(cosT, 0.3)) * L.scale
      geom.cx = cx
      geom.cy = cy
      geom.R = R
      geom.cosR = cosR
      geom.sinR = sinR
      geom.cosT = cosT

      /* click / ripple rings */
      for (let i = rings.length - 1; i >= 0; i--) {
        rings[i].t += dt
        if (rings[i].t > 3.2) rings.splice(i, 1)
      }
      const ringState = rings.map((r) => {
        const wid = 0.05 + 0.03 * r.t
        const fade = 1 - r.t / 3.2
        return { x: r.x, y: r.y, rho: 0.34 * r.t, wid, amp: 0.035 * r.s * fade * fade, boost: r.s * fade }
      })

      /* hover wake */
      let wakeOn = false
      let gain = 0
      let pbx = 0
      let pby = 0
      let thp = 0
      let rp = 0
      let wr2 = 1
      if (pointerLive && L.hoverWake) {
        pbx = pointer.x * k
        pby = pointer.y * k
        const moved = Math.hypot(pbx - pointer.lx, pby - pointer.ly)
        pointer.lx = pbx
        pointer.ly = pby
        const act = clamp(moved / (R * 0.035), 0, 1)
        if (act > 0.02 && L.wakeStrength > 0) {
          const p = toPlane(pbx, pby)
          thp = Math.atan2(p.y, p.x)
          rp = Math.hypot(p.x, p.y)
          wr2 = (R * 0.12) * (R * 0.12)
          gain = L.wakeStrength * act * 0.18 * dt * 60
          wakeOn = true
          wakeLevel = Math.max(wakeLevel, act)
        }
      }
      wakeLevel *= Math.exp(-dt * 0.35)
      const relax = wakeLevel > 0.004
      const decayA = Math.exp(-dt * 0.55)
      const decayW = Math.exp(-dt * 0.5)

      /* per-star loop */
      const ink = L.ink
      const bgPacked = (255 << 24) | (L.bg[2] << 16) | (L.bg[1] << 8) | L.bg[0]
      u32.fill(bgPacked)

      const N = S.count
      const period = TAU / S.arms
      const twist2 = L.twist * 2
      const sig0 = 0.42 - 0.22 * L.armStrength
      const floor = clamp(1 - 1.1 * L.armStrength, 0.02, 1)
      const dustAmt = L.dust
      const dustMin = L.coreSize * 1.5
      const depthAmt = L.depth
      const intens = L.intensity * (1 + 0.35 * L.hoverBoost * hover)
      const tw = L.twinkle
      const baseSize = L.starSize * k
      const [warmR, warmG, warmB] = L.c1

      const plot = (sx, sy, size, cr, cg, cb, al) => {
        if (size < 1.25) {
          const ix = sx | 0
          const iy = sy | 0
          if (ix < 0 || iy < 0 || ix >= bw || iy >= bh) return
          const a = al * Math.min(1, size * 0.85)
          const idx = (iy * bw + ix) << 2
          if (ink) {
            const f = Math.min(1, a)
            data[idx] += (cr - data[idx]) * f
            data[idx + 1] += (cg - data[idx + 1]) * f
            data[idx + 2] += (cb - data[idx + 2]) * f
          } else {
            data[idx] += cr * a
            data[idx + 1] += cg * a
            data[idx + 2] += cb * a
          }
          return
        }
        const half = size * 0.5
        const x0 = Math.max(0, Math.floor(sx - half - 0.5))
        const x1 = Math.min(bw - 1, Math.ceil(sx + half + 0.5))
        const y0 = Math.max(0, Math.floor(sy - half - 0.5))
        const y1 = Math.min(bh - 1, Math.ceil(sy + half + 0.5))
        const inv = 1 / (half + 0.5)
        for (let yy = y0; yy <= y1; yy++) {
          for (let xx = x0; xx <= x1; xx++) {
            const ddx = xx + 0.5 - sx
            const ddy = yy + 0.5 - sy
            const d = Math.sqrt(ddx * ddx + ddy * ddy) * inv
            if (d >= 1) continue
            const a = al * (1 - d)
            const idx = (yy * bw + xx) << 2
            if (ink) {
              const f = Math.min(1, a)
              data[idx] += (cr - data[idx]) * f
              data[idx + 1] += (cg - data[idx + 1]) * f
              data[idx + 2] += (cb - data[idx + 2]) * f
            } else {
              data[idx] += cr * a
              data[idx + 1] += cg * a
              data[idx + 2] += cb * a
            }
          }
        }
      }

      for (let i = 0; i < N; i++) {
        if (relax) {
          dth[i] *= decayA
          dr[i] *= decayA
          wk[i] *= decayW
        }
        let rr = S.radius[i] + dr[i]
        if (rr < 0) rr = 0
        else if (rr > 1.2) rr = 1.2

        let a
        let wgt = 1
        if (S.arm[i]) {
          // Position relative to the arm centre drifts at the star's own rate,
          // so stars stream through the arms while the pattern holds its shape.
          let o = S.phase0[i] + S.rate[i] * orbitT
          o -= period * Math.floor(o / period + 0.5)
          a = S.base[i] + rr * twist2 + o + pat + dth[i]
          const sg = sig0 * (0.45 + 0.9 * rr)
          const q = o / sg
          wgt = floor + (1 - floor) * Math.exp(-0.5 * q * q)
          if (dustAmt > 0 && rr > dustMin) {
            const dd = (q + 0.95) / 0.45
            wgt *= 1 - dustAmt * 0.85 * Math.exp(-dd * dd)
          }
        } else {
          a = S.angle[i] + pat + S.rate[i] * orbitT + dth[i]
        }
        const wki = wk[i]
        if (wki > 0.001) {
          wgt += (1 - wgt) * wki
          if (relax) dth[i] += dt * 0.9 * (1 - Math.min(rr, 1)) * wki
        }

        let x = rr * Math.cos(a)
        let y = rr * Math.sin(a)
        const zz = S.z[i]

        let cr = S.color[i * 3]
        let cg = S.color[i * 3 + 1]
        let cb = S.color[i * 3 + 2]
        let boost = 1

        for (let g = 0; g < ringState.length; g++) {
          const rg = ringState[g]
          const ddx = x - rg.x
          const ddy = y - rg.y
          const d = Math.sqrt(ddx * ddx + ddy * ddy) || 1e-6
          const e = (d - rg.rho) / rg.wid
          if (e > 3 || e < -3) continue
          const infl = Math.exp(-e * e)
          x += (ddx / d) * rg.amp * infl
          y += (ddy / d) * rg.amp * infl
          boost += 1.6 * rg.boost * infl
          const mix = Math.min(1, infl * 0.7 * rg.boost)
          cr += (warmR - cr) * mix
          cg += (warmG - cg) * mix
          cb += (warmB - cb) * mix
        }

        // tilt + roll
        const y1 = y * cosT - zz * sinT
        const dep = y * sinT + zz * cosT
        const X = x * cosR - y1 * sinR
        const Y = x * sinR + y1 * cosR
        const sx = cx + X * R
        const sy = cy + Y * R

        if (wakeOn) {
          const ddx = sx - pbx
          const ddy = sy - pby
          const d2 = ddx * ddx + ddy * ddy
          if (d2 < wr2) {
            const f = 1 - d2 / wr2
            let dd = thp - a
            dd -= TAU * Math.round(dd / TAU)
            dth[i] += dd * gain * f
            dr[i] += (rp - rr) * gain * f
            wk[i] = Math.min(1, wk[i] + gain * f * 1.4)
          }
        }

        const df = 1 + depthAmt * 0.5 * dep
        const edge = clamp((1.02 - rr) / 0.2, 0, 1)
        const twk = 1 - tw * 0.5 * (1 + Math.sin(twT * S.twRate[i] + S.twPhase[i]))
        const al = S.bright[i] * wgt * df * edge * twk * intens * boost * (1 + 0.8 * wki) * 0.62
        if (al < 0.004) continue

        const size = baseSize * S.size[i] * (1 + 0.3 * dep)
        plot(sx, sy, size, cr, cg, cb, al)
      }

      ctx.putImageData(img, 0, 0)

      /* glow haze + core */
      if (!ink && (L.glow > 0 || L.core > 0)) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        if (L.glow > 0) {
          sctx.clearRect(0, 0, small.width, small.height)
          sctx.drawImage(canvas, 0, 0, small.width, small.height)
          ctx.globalAlpha = clamp(L.glow * 0.5, 0, 1)
          ctx.imageSmoothingEnabled = true
          ctx.drawImage(small, 0, 0, bw, bh)
          ctx.globalAlpha = 1
        }
        const coreAlpha = Math.min(0.9, 0.28 * L.core * (0.4 + L.glow))
        if (coreAlpha > 0.001) {
          const cR = R * (0.05 + L.coreSize * 4.5)
          const wr = Math.round(warmR + (255 - warmR) * 0.6)
          const wg = Math.round(warmG + (255 - warmG) * 0.6)
          const wb = Math.round(warmB + (255 - warmB) * 0.6)
          ctx.translate(cx, cy)
          ctx.rotate(rollRad)
          ctx.scale(1, 0.5 + 0.5 * cosT)
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, cR)
          grad.addColorStop(0, `rgba(${wr},${wg},${wb},${coreAlpha})`)
          grad.addColorStop(0.3, `rgba(${Math.round(warmR)},${Math.round(warmG)},${Math.round(warmB)},${coreAlpha * 0.35})`)
          grad.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = grad
          ctx.fillRect(-cR, -cR, cR * 2, cR * 2)
        }
        ctx.restore()
      }
    }

    raf = window.requestAnimationFrame(frame)

    return () => {
      window.cancelAnimationFrame(raf)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointerdown', onDown)
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', resize)
      if (mq && mq.removeEventListener) mq.removeEventListener('change', onMotion)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        minHeight: 240,
        background: backgroundColor,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
      {children ? <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>{children}</div> : null}
    </div>
  )
})

export default BinaryOrbits