import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'

const TAU = Math.PI * 2
const DEFAULT_COLORS = ['#7B4DFF', '#FFC2EE', '#00D4FF', '#FFD700']

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const lerp = (a, b, t) => a + (b - a) * t
const smoothstep = (t) => t * t * (3 - 2 * t)

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
  const R = toLinear(r), G = toLinear(g), B = toLinear(b)
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

/* ---------- Orbital stream particles ---------- */
function buildOrbitalStreams({ count, colors }) {
  const rand = mulberry32(42069)
  const streams = []
  const parsedColors = colors.map(c => parseColor(c))

  for (let i = 0; i < count; i++) {
    const orbitRadius = 0.08 + rand() * 0.35
    const speed = (0.5 + rand() * 2.5) * (rand() > 0.5 ? 1 : -1)
    const phase = rand() * TAU
    const eccentricity = rand() * 0.4
    const tiltAngle = (rand() - 0.5) * Math.PI * 0.3
    const size = 0.5 + rand() * 2.5
    const brightness = 0.3 + rand() * 0.7
    const colorIdx = Math.floor(rand() * parsedColors.length)
    const color = parsedColors[colorIdx]
    const trail = 3 + Math.floor(rand() * 12)
    const pulseRate = 0.5 + rand() * 3
    const pulsePhase = rand() * TAU
    const zOffset = (rand() - 0.5) * 0.15

    streams.push({
      orbitRadius, speed, phase, eccentricity, tiltAngle,
      size, brightness, color, trail, pulseRate, pulsePhase, zOffset,
      sparkle: rand() < 0.15,
      comet: rand() < 0.08,
    })
  }
  return streams
}

/* ---------- Nebula clouds ---------- */
function buildNebulaClouds({ count, colors }) {
  const rand = mulberry32(1337)
  const clouds = []
  const parsedColors = colors.map(c => parseColor(c))

  for (let i = 0; i < count; i++) {
    const angle = rand() * TAU
    const radius = 0.15 + rand() * 0.5
    const size = 0.06 + rand() * 0.18
    const color = parsedColors[Math.floor(rand() * parsedColors.length)]
    const alpha = 0.02 + rand() * 0.06
    const rotSpeed = (rand() - 0.5) * 0.3
    const pulseRate = 0.2 + rand() * 0.8
    const pulsePhase = rand() * TAU

    clouds.push({ angle, radius, size, color, alpha, rotSpeed, pulseRate, pulsePhase })
  }
  return clouds
}

/* ---------- Energy arcs ---------- */
function buildEnergyArcs({ count, colors }) {
  const rand = mulberry32(9999)
  const arcs = []
  const parsedColors = colors.map(c => parseColor(c))

  for (let i = 0; i < count; i++) {
    const startAngle = rand() * TAU
    const arcLength = 0.3 + rand() * 1.5
    const radius = 0.1 + rand() * 0.4
    const width = 1 + rand() * 2
    const speed = (0.2 + rand() * 1.5) * (rand() > 0.5 ? 1 : -1)
    const color = parsedColors[Math.floor(rand() * parsedColors.length)]
    const alpha = 0.08 + rand() * 0.2
    const pulseRate = 0.3 + rand() * 2
    const pulsePhase = rand() * TAU
    const segments = 20 + Math.floor(rand() * 40)
    const wobble = rand() * 0.03

    arcs.push({ startAngle, arcLength, radius, width, speed, color, alpha, pulseRate, pulsePhase, segments, wobble })
  }
  return arcs
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
  const c2 = colors[2] ? toOklab(parseColor(colors[2], [0, 212, 255])) : null
  const n = Math.max(1, Math.round(arms))
  const period = TAU / n
  const N = count

  const S = {
    count: N,
    arms: n,
    radius: new Float32Array(N),
    angle: new Float32Array(N),
    base: new Float32Array(N),
    phase0: new Float32Array(N),
    rate: new Float32Array(N),
    arm: new Uint8Array(N),
    z: new Float32Array(N),
    size: new Float32Array(N),
    bright: new Float32Array(N),
    twRate: new Float32Array(N),
    twPhase: new Float32Array(N),
    color: new Float32Array(N * 3),
    orbitSpeed: new Float32Array(N),
    pulsePhase: new Float32Array(N),
    pulseRate: new Float32Array(N),
    coreStar: new Uint8Array(N),
  }

  for (let i = 0; i < N; i++) {
    const bulge = innerVoid <= 0.01 && rand() < 0.12
    let r
    if (bulge) r = Math.min(0.6, Math.abs(gauss()) * coreSize * 1.8)
    else r = innerVoid + (1 - innerVoid) * Math.pow(rand(), 0.75)

    const inArm = !bulge && rand() < 0.84
    S.arm[i] = inArm ? 1 : 0
    S.radius[i] = r
    S.angle[i] = rand() * TAU
    S.base[i] = Math.floor(rand() * n) * period
    S.phase0[i] = rand() * period
    S.rate[i] = 0.22 * (1 / (0.28 + r) - 0.95)
    S.orbitSpeed[i] = (0.1 + rand() * 0.4) / (0.3 + r)
    S.pulsePhase[i] = rand() * TAU
    S.pulseRate[i] = 0.5 + rand() * 4
    S.coreStar[i] = (r < coreSize * 2 && rand() < 0.3) ? 1 : 0

    let b = 0.3 + 0.7 * Math.pow(rand(), 1.8)
    let size = 0.55 + 0.75 * rand()
    let spark = false
    if (rand() < sparkle * 0.09) {
      b = 0.85 + 0.15 * rand()
      size *= 1.8 + rand() * 1.5
      spark = true
    }
    S.bright[i] = b
    S.size[i] = size
    S.twRate[i] = 0.6 + 1.6 * rand()
    S.twPhase[i] = rand() * TAU

    S.z[i] = bulge
      ? gauss() * coreSize * 0.7
      : gauss() * thickness * (0.3 + 1.4 * Math.exp(-r * 3))

    let m = clamp(1 - Math.pow(r, 0.7) * 1.25, 0, 1)
    m = m * m * (3 - 2 * m)
    const jitter = (rand() - 0.5) * 0.06

    let lab
    if (c2 && rand() < 0.25) {
      const t = rand()
      lab = [
        lerp(c0[0], c2[0], t) + jitter,
        lerp(c0[1], c2[1], t),
        lerp(c0[2], c2[2], t),
      ]
    } else {
      lab = [
        c0[0] + (c1[0] - c0[0]) * m + jitter,
        c0[1] + (c1[1] - c0[1]) * m,
        c0[2] + (c1[2] - c0[2]) * m,
      ]
    }

    const rgb = fromOklab(lab)
    if (ink) {
      for (let c = 0; c < 3; c++) rgb[c] *= 0.92
    } else {
      let white = Math.exp(-r / (coreSize * 1.5 + 0.01)) * 0.85 * Math.min(1, core * 0.8)
      if (spark) white = Math.max(white, 0.4)
      if (S.coreStar[i]) white = Math.max(white, 0.6)
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
    backgroundColor = '#050510',
    mode = 'auto',
    stars = 85000,
    starSize = 1.8,
    sparkle = 0.6,
    arms = 4,
    twist = 4.0,
    armStrength = 0.55,
    dust = 0.5,
    core = 1.2,
    coreSize = 0.09,
    innerVoid = 0,
    thickness = 0.025,
    tilt = 62,
    roll = -8,
    scale = 1,
    centerX = 0.5,
    centerY = 0.52,
    speed = 1,
    twinkle = 0.4,
    depth = 0.4,
    glow = 0.6,
    intensity = 1,
    interactive = true,
    hoverWake = true,
    clickRipple = true,
    wakeStrength = 1,
    rippleStrength = 10,
    hoverBoost = 0.5,
    paused = false,
    quality = 1,
    // New advanced props
    orbitalStreams = 200,
    nebulaClouds = 25,
    energyArcs = 8,
    coreGlow = 1.5,
    corePulse = true,
    coreRays = true,
    coreRayCount = 6,
    gravitationalLensing = true,
    lensingStrength = 0.3,
    particleTrails = true,
    bloomIntensity = 0.6,
    colorShift = true,
    colorShiftSpeed = 0.1,
    vortexEffect = true,
    vortexStrength = 0.3,
    shockwaveOnClick = true,
    magneticFieldLines = true,
    starBurst = false,
    children,
    className,
    style,
  } = props

  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const glowCanvasRef = useRef(null)
  const wakeFrameRef = useRef(null)
  const ringsRef = useRef([])
  const shockwavesRef = useRef([])

  const bg = parseColor(backgroundColor, [5, 5, 16])
  const ink = mode === 'ink' || (mode === 'auto' && (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) / 255 > 0.55)

  const starData = useMemo(
    () => buildStars({
      count: clamp(Math.round(stars), 2000, 300000),
      arms, innerVoid: clamp(innerVoid, 0, 0.6),
      thickness, sparkle: clamp(sparkle, 0, 1),
      coreSize, core, colors: [colors[0], colors[1], colors[2]], ink,
    }),
    [stars, arms, innerVoid, thickness, sparkle, coreSize, core, colors[0], colors[1], colors[2], ink],
  )

  const streamData = useMemo(
    () => buildOrbitalStreams({ count: orbitalStreams, colors }),
    [orbitalStreams, colors[0], colors[1]],
  )

  const nebulaData = useMemo(
    () => buildNebulaClouds({ count: nebulaClouds, colors }),
    [nebulaClouds, colors[0], colors[1]],
  )

  const arcData = useMemo(
    () => buildEnergyArcs({ count: energyArcs, colors }),
    [energyArcs, colors[0], colors[1]],
  )

  const live = {
    S: starData, bg, ink,
    c0: parseColor(colors[0], [123, 77, 255]),
    c1: parseColor(colors[1], [255, 194, 238]),
    c2: parseColor(colors[2] || '#00D4FF', [0, 212, 255]),
    c3: parseColor(colors[3] || '#FFD700', [255, 215, 0]),
    starSize, twist, armStrength: clamp(armStrength, 0, 1),
    dust: clamp(dust, 0, 1), coreSize, core, tilt, roll, scale,
    centerX, centerY, speed, twinkle: clamp(twinkle, 0, 1),
    depth: clamp(depth, 0, 1), glow, intensity,
    interactive, hoverWake, clickRipple, wakeStrength,
    rippleStrength, hoverBoost, paused,
    quality: clamp(quality, 0.25, 1),
    coreGlow, corePulse, coreRays, coreRayCount,
    gravitationalLensing, lensingStrength,
    particleTrails, bloomIntensity,
    colorShift, colorShiftSpeed, vortexEffect, vortexStrength,
    shockwaveOnClick, magneticFieldLines, starBurst,
    streams: streamData, nebulae: nebulaData, arcs: arcData,
  }
  const liveRef = useRef(live)
  useEffect(() => { liveRef.current = live })
  useEffect(() => { wakeFrameRef.current?.() }, [paused])

  useImperativeHandle(ref, () => ({
    ripple: (strength = 1) => {
      ringsRef.current.push({ x: 0, y: 0, t: 0, s: strength })
    },
    shockwave: (strength = 1) => {
      shockwavesRef.current.push({ t: 0, s: strength })
    },
    burst: () => {
      const L = liveRef.current
      for (let i = 0; i < 50; i++) {
        ringsRef.current.push({
          x: (Math.random() - 0.5) * 0.3,
          y: (Math.random() - 0.5) * 0.3,
          t: 0, s: 2 + Math.random() * 5
        })
      }
    },
  }), [])

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas && canvas.getContext('2d')
    if (!root || !canvas || !ctx) return undefined

    const small = document.createElement('canvas')
    const sctx = small.getContext('2d')
    const bloom = document.createElement('canvas')
    const bctx = bloom.getContext('2d')

    const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    let reduced = !!(mq && mq.matches)
    const onMotion = (e) => { reduced = e.matches; dirty = true; scheduleFrame?.() }
    if (mq && mq.addEventListener) mq.addEventListener('change', onMotion)

    let bw = 2, bh = 2, k = 1
    let img = null, data = null, u32 = null
    let raf = 0, last = 0, dirty = true, lastQuality = -1
    let scheduleFrame = null
    let lastLive = null, curStars = null
    let dr = null, dth = null, wk = null

    let pat = 0, orbitT = 0, twT = 0, globalT = 0
    let hover = 0, wakeLevel = 0
    let colorHue = 0

    const pointer = { x: 0, y: 0, lx: 0, ly: 0, active: false }
    const geom = { cx: 0, cy: 0, R: 1, cosR: 1, sinR: 0, cosT: 1 }

    // Trail buffer for orbital streams
    const trailBuf = new Float32Array(2000 * 2)
    let trailIdx = 0

    const resize = () => {
      const rect = root.getBoundingClientRect()
      const cssW = Math.max(1, rect.width)
      const cssH = Math.max(1, rect.height)
      const q = liveRef.current.quality
      let s = Math.min(window.devicePixelRatio || 1, 2) * q
      const px = cssW * cssH * s * s
      if (px > 3.2e6) s *= Math.sqrt(3.2e6 / px)
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
      bloom.width = Math.max(2, bw >> 2)
      bloom.height = Math.max(2, bh >> 2)
      lastQuality = q
      dirty = true
      scheduleFrame?.()
    }

    const toPlane = (bx, by) => {
      const dx = bx - geom.cx, dy = by - geom.cy
      const X = (dx * geom.cosR + dy * geom.sinR) / geom.R
      const Y = (-dx * geom.sinR + dy * geom.cosR) / geom.R
      return { x: X, y: Y / Math.max(geom.cosT, 0.12) }
    }

    const setPointer = (e) => {
      const rect = root.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      if (!pointer.active) { pointer.lx = pointer.x * k; pointer.ly = pointer.y * k }
      pointer.active = true
    }
    const onMove = (e) => { setPointer(e); scheduleFrame?.() }
    const onLeave = () => { pointer.active = false; scheduleFrame?.() }
    const onDown = (e) => {
      const L = liveRef.current
      if (!L.interactive || reduced) return
      setPointer(e)
      const p = toPlane(pointer.x * k, pointer.y * k)
      if (L.clickRipple && ringsRef.current.length < 8)
        ringsRef.current.push({ x: p.x, y: p.y, t: 0, s: L.rippleStrength })
      if (L.shockwaveOnClick)
        shockwavesRef.current.push({ t: 0, s: 1 })
      dirty = true
      scheduleFrame?.()
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('pointerdown', onDown)

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    if (ro) ro.observe(root)
    else window.addEventListener('resize', resize)
    resize()

    const frame = (now) => {
      raf = 0
      const L = liveRef.current
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now

      if (L.quality !== lastQuality) resize()
      if (L !== lastLive) { lastLive = L; dirty = true }
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
      const shockwaves = shockwavesRef.current
      if (reduced) { rings.length = 0; shockwaves.length = 0 }

      const pointerLive = interactive && pointer.active
      const hoverTarget = pointerLive ? 1 : 0
      const hoverMoving = Math.abs(hover - hoverTarget) > 0.003
      const busy = rings.length > 0 || shockwaves.length > 0 || wakeLevel > 0.004 || hoverMoving || pointerLive
      if (frozen && !dirty && !busy) return
      dirty = false

      hover += (hoverTarget - hover) * Math.min(1, dt * 4)
      if (!frozen) {
        const dts = dt * L.speed * (1 + L.hoverBoost * hover)
        pat += dts * 0.03
        orbitT += dts
        twT += dt
        globalT += dt
        if (L.colorShift) colorHue += dt * L.colorShiftSpeed
      }

      const tiltRad = (clamp(L.tilt, 0, 85) * Math.PI) / 180
      const cosT = Math.cos(tiltRad), sinT = Math.sin(tiltRad)
      const rollRad = (L.roll * Math.PI) / 180
      const cosR = Math.cos(rollRad), sinR = Math.sin(rollRad)
      const cx = bw * L.centerX, cy = bh * L.centerY
      const R = Math.min(bw * 0.48, (bh * 0.5) / Math.max(cosT, 0.3)) * L.scale
      geom.cx = cx; geom.cy = cy; geom.R = R
      geom.cosR = cosR; geom.sinR = sinR; geom.cosT = cosT

      // Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        shockwaves[i].t += dt
        if (shockwaves[i].t > 4) shockwaves.splice(i, 1)
      }

      // Ripple rings
      for (let i = rings.length - 1; i >= 0; i--) {
        rings[i].t += dt
        if (rings[i].t > 3.5) rings.splice(i, 1)
      }
      const ringState = rings.map((r) => {
        const wid = 0.05 + 0.04 * r.t
        const fade = 1 - r.t / 3.5
        return { x: r.x, y: r.y, rho: 0.38 * r.t, wid, amp: 0.04 * r.s * fade * fade, boost: r.s * fade }
      })

      // Hover wake
      let wakeOn = false, gain = 0, pbx = 0, pby = 0, thp = 0, rp = 0, wr2 = 1
      if (pointerLive && L.hoverWake) {
        pbx = pointer.x * k; pby = pointer.y * k
        const moved = Math.hypot(pbx - pointer.lx, pby - pointer.ly)
        pointer.lx = pbx; pointer.ly = pby
        const act = clamp(moved / (R * 0.035), 0, 1)
        if (act > 0.02 && L.wakeStrength > 0) {
          const p = toPlane(pbx, pby)
          thp = Math.atan2(p.y, p.x); rp = Math.hypot(p.x, p.y)
          wr2 = (R * 0.14) * (R * 0.14)
          gain = L.wakeStrength * act * 0.2 * dt * 60
          wakeOn = true
          wakeLevel = Math.max(wakeLevel, act)
        }
      }
      wakeLevel *= Math.exp(-dt * 0.35)
      const relax = wakeLevel > 0.004
      const decayA = Math.exp(-dt * 0.55)
      const decayW = Math.exp(-dt * 0.5)

      // Core pulse
      const corePulseVal = L.corePulse ? 0.85 + 0.15 * Math.sin(globalT * 1.2) : 1

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

      // Vortex effect parameters
      const vortexActive = L.vortexEffect
      const vortexStr = L.vortexStrength

      // Color shift
      const hueShift = colorHue * TAU

      const plot = (sx, sy, size, cr, cg, cb, al) => {
        if (al < 0.003) return
        if (size < 1.25) {
          const ix = sx | 0, iy = sy | 0
          if (ix < 0 || iy < 0 || ix >= bw || iy >= bh) return
          const a = al * Math.min(1, size * 0.85)
          const idx = (iy * bw + ix) << 2
          if (ink) {
            const f = Math.min(1, a)
            data[idx] += (cr - data[idx]) * f
            data[idx + 1] += (cg - data[idx + 1]) * f
            data[idx + 2] += (cb - data[idx + 2]) * f
          } else {
            data[idx] = Math.min(255, data[idx] + cr * a)
            data[idx + 1] = Math.min(255, data[idx + 1] + cg * a)
            data[idx + 2] = Math.min(255, data[idx + 2] + cb * a)
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
            const ddx = xx + 0.5 - sx, ddy = yy + 0.5 - sy
            const d = Math.sqrt(ddx * ddx + ddy * ddy) * inv
            if (d >= 1) continue
            const a = al * (1 - d * d)
            const idx = (yy * bw + xx) << 2
            if (ink) {
              const f = Math.min(1, a)
              data[idx] += (cr - data[idx]) * f
              data[idx + 1] += (cg - data[idx + 1]) * f
              data[idx + 2] += (cb - data[idx + 2]) * f
            } else {
              data[idx] = Math.min(255, data[idx] + cr * a)
              data[idx + 1] = Math.min(255, data[idx + 1] + cg * a)
              data[idx + 2] = Math.min(255, data[idx + 2] + cb * a)
            }
          }
        }
      }

      // Plot soft glow dot (for streams, bigger and softer)
      const plotGlow = (sx, sy, radius, cr, cg, cb, al) => {
        if (al < 0.002) return
        const x0 = Math.max(0, Math.floor(sx - radius))
        const x1 = Math.min(bw - 1, Math.ceil(sx + radius))
        const y0 = Math.max(0, Math.floor(sy - radius))
        const y1 = Math.min(bh - 1, Math.ceil(sy + radius))
        const inv = 1 / (radius * radius)
        for (let yy = y0; yy <= y1; yy++) {
          for (let xx = x0; xx <= x1; xx++) {
            const ddx = xx + 0.5 - sx, ddy = yy + 0.5 - sy
            const d2 = ddx * ddx + ddy * ddy
            if (d2 >= radius * radius) continue
            const falloff = Math.exp(-d2 * inv * 3)
            const a = al * falloff
            const idx = (yy * bw + xx) << 2
            data[idx] = Math.min(255, data[idx] + cr * a)
            data[idx + 1] = Math.min(255, data[idx + 1] + cg * a)
            data[idx + 2] = Math.min(255, data[idx + 2] + cb * a)
          }
        }
      }

      // Apply color hue shift to RGB
      const shiftColor = (r, g, b) => {
        if (!L.colorShift || hueShift < 0.001) return [r, g, b]
        const cos = Math.cos(hueShift), sin = Math.sin(hueShift)
        const matrix = [
          0.213 + cos * 0.787 - sin * 0.213,
          0.715 - cos * 0.715 - sin * 0.715,
          0.072 - cos * 0.072 + sin * 0.928,
          0.213 - cos * 0.213 + sin * 0.143,
          0.715 + cos * 0.285 + sin * 0.140,
          0.072 - cos * 0.072 - sin * 0.283,
          0.213 - cos * 0.213 - sin * 0.787,
          0.715 - cos * 0.715 + sin * 0.715,
          0.072 + cos * 0.928 + sin * 0.072,
        ]
        return [
          clamp(r * matrix[0] + g * matrix[1] + b * matrix[2], 0, 255),
          clamp(r * matrix[3] + g * matrix[4] + b * matrix[5], 0, 255),
          clamp(r * matrix[6] + g * matrix[7] + b * matrix[8], 0, 255),
        ]
      }

      // --- RENDER STARS ---
      for (let i = 0; i < N; i++) {
        if (relax) {
          dth[i] *= decayA; dr[i] *= decayA; wk[i] *= decayW
        }
        let rr = S.radius[i] + dr[i]
        if (rr < 0) rr = 0; else if (rr > 1.2) rr = 1.2

        let a, wgt = 1
        if (S.arm[i]) {
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

        // Vortex effect: additional angular velocity near core
        if (vortexActive && rr < 0.3) {
          const vortexFactor = (1 - rr / 0.3) * vortexStr
          a += vortexFactor * Math.sin(globalT * 0.5 + rr * 10) * 0.15
        }

        const wki = wk[i]
        if (wki > 0.001) {
          wgt += (1 - wgt) * wki
          if (relax) dth[i] += dt * 0.9 * (1 - Math.min(rr, 1)) * wki
        }

        let x = rr * Math.cos(a), y = rr * Math.sin(a)
        const zz = S.z[i]

        let cr = S.color[i * 3], cg = S.color[i * 3 + 1], cb = S.color[i * 3 + 2]
        let boost = 1

        // Gravitational lensing near core
        if (L.gravitationalLensing && rr < L.coreSize * 4) {
          const lensFactor = L.lensingStrength * Math.exp(-rr / (L.coreSize * 1.5))
          const lensAngle = a + lensFactor * Math.sin(globalT * 0.3)
          x = rr * Math.cos(lensAngle)
          y = rr * Math.sin(lensAngle)
          boost += lensFactor * 2
        }

        // Shockwave displacement
        for (let sw = 0; sw < shockwaves.length; sw++) {
          const shock = shockwaves[sw]
          const shockR = shock.t * 0.5
          const dist = Math.sqrt(x * x + y * y)
          const diff = Math.abs(dist - shockR)
          if (diff < 0.08) {
            const infl = Math.exp(-(diff * diff) / 0.003) * shock.s * (1 - shock.t / 4)
            const angle = Math.atan2(y, x)
            x += Math.cos(angle) * infl * 0.04
            y += Math.sin(angle) * infl * 0.04
            boost += infl * 3
            cr = lerp(cr, 255, infl * 0.4)
            cg = lerp(cg, 255, infl * 0.3)
            cb = lerp(cb, 255, infl * 0.2)
          }
        }

        // Ripple rings
        for (let g = 0; g < ringState.length; g++) {
          const rg = ringState[g]
          const ddx = x - rg.x, ddy = y - rg.y
          const d = Math.sqrt(ddx * ddx + ddy * ddy) || 1e-6
          const e = (d - rg.rho) / rg.wid
          if (e > 3 || e < -3) continue
          const infl = Math.exp(-e * e)
          x += (ddx / d) * rg.amp * infl
          y += (ddy / d) * rg.amp * infl
          boost += 1.8 * rg.boost * infl
          const mix = Math.min(1, infl * 0.7 * rg.boost)
          cr += (warmR - cr) * mix; cg += (warmG - cg) * mix; cb += (warmB - cb) * mix
        }

        // Apply color shift
        if (L.colorShift) {
          const shifted = shiftColor(cr, cg, cb);
          cr = shifted[0]; cg = shifted[1]; cb = shifted[2]
        }

        // Core star pulse
        if (S.coreStar[i] && L.corePulse) {
          boost *= corePulseVal
          const pulse = 0.5 + 0.5 * Math.sin(globalT * S.pulseRate[i] + S.pulsePhase[i])
          boost += pulse * 0.8
        }

        const y1t = y * cosT - zz * sinT
        const dep = y * sinT + zz * cosT
        const X = x * cosR - y1t * sinR
        const Y = x * sinR + y1t * cosR
        const sx = cx + X * R, sy = cy + Y * R

        if (wakeOn) {
          const ddx = sx - pbx, ddy = sy - pby
          const d2 = ddx * ddx + ddy * ddy
          if (d2 < wr2) {
            const f = 1 - d2 / wr2
            let dd = thp - a; dd -= TAU * Math.round(dd / TAU)
            dth[i] += dd * gain * f; dr[i] += (rp - rr) * gain * f
            wk[i] = Math.min(1, wk[i] + gain * f * 1.4)
          }
        }

        const df = 1 + depthAmt * 0.5 * dep
        const edge = clamp((1.02 - rr) / 0.2, 0, 1)
        const twk = 1 - tw * 0.5 * (1 + Math.sin(twT * S.twRate[i] + S.twPhase[i]))
        const al = S.bright[i] * wgt * df * edge * twk * intens * boost * (1 + 0.8 * wki) * 0.65
        if (al < 0.004) continue

        const size = baseSize * S.size[i] * (1 + 0.3 * dep) * (S.coreStar[i] ? corePulseVal * 1.3 : 1)
        plot(sx, sy, size, cr, cg, cb, al)
      }

      // --- RENDER ORBITAL STREAMS (circular motion through center) ---
      const streams = L.streams
      for (let i = 0; i < streams.length; i++) {
        const s = streams[i]
        const angle = s.phase + s.speed * globalT
        const rMod = s.orbitRadius * (1 + s.eccentricity * Math.sin(angle * 0.5))

        // Circular motion through the center glow
        const x0 = rMod * Math.cos(angle)
        const y0 = rMod * Math.sin(angle) * Math.cos(s.tiltAngle)
        const z0 = rMod * Math.sin(angle) * Math.sin(s.tiltAngle) + s.zOffset

        const pulse = 0.6 + 0.4 * Math.sin(globalT * s.pulseRate + s.pulsePhase)
        let [cr, cg, cb] = s.color
        if (L.colorShift) {
          const shifted = shiftColor(cr, cg, cb);
          cr = shifted[0]; cg = shifted[1]; cb = shifted[2]
        }

        // Transform to screen
        const yTilt = y0 * cosT - z0 * sinT
        const X = x0 * cosR - yTilt * sinR
        const Y = x0 * sinR + yTilt * cosR
        const sx = cx + X * R, sy = cy + Y * R

        if (sx < -20 || sx > bw + 20 || sy < -20 || sy > bh + 20) continue

        const brightness = s.brightness * pulse * intens

        // Draw trail if enabled
        if (L.particleTrails && s.trail > 0) {
          for (let t = 1; t <= s.trail; t++) {
            const trailAngle = angle - t * 0.015 * Math.sign(s.speed)
            const trailRM = s.orbitRadius * (1 + s.eccentricity * Math.sin(trailAngle * 0.5))
            const tx = trailRM * Math.cos(trailAngle)
            const ty = trailRM * Math.sin(trailAngle) * Math.cos(s.tiltAngle)
            const tz = trailRM * Math.sin(trailAngle) * Math.sin(s.tiltAngle) + s.zOffset
            const tyT = ty * cosT - tz * sinT
            const TX = tx * cosR - tyT * sinR
            const TY = tx * sinR + tyT * cosR
            const tsx = cx + TX * R, tsy = cy + TY * R
            const trailFade = 1 - t / (s.trail + 1)
            const trailAl = brightness * trailFade * trailFade * 0.3
            const trailSize = s.size * k * 0.5 * trailFade
            plot(tsx, tsy, trailSize, cr, cg, cb, trailAl)
          }
        }

        // Main particle
        const mainSize = s.size * k * (s.sparkle ? (1.2 + 0.8 * Math.sin(globalT * 8 + s.pulsePhase)) : 1)

        if (s.comet) {
          plotGlow(sx, sy, mainSize * 3, cr, cg, cb, brightness * 0.15)
        }

        plot(sx, sy, mainSize, cr, cg, cb, brightness * 0.85)

        // Extra glow for sparkly ones
        if (s.sparkle) {
          plotGlow(sx, sy, mainSize * 2.5, cr, cg, cb, brightness * 0.12)
        }
      }

      ctx.putImageData(img, 0, 0)

      // --- POST-PROCESSING with Canvas 2D ---

      // Energy arcs
      if (!ink) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        const arcs = L.arcs
        for (let i = 0; i < arcs.length; i++) {
          const arc = arcs[i]
          const baseAngle = arc.startAngle + arc.speed * globalT
          const pulse = 0.5 + 0.5 * Math.sin(globalT * arc.pulseRate + arc.pulsePhase)
          let [cr, cg, cb] = arc.color
          if (L.colorShift) {
            const shifted = shiftColor(cr, cg, cb);
            cr = shifted[0]; cg = shifted[1]; cb = shifted[2]
          }

          ctx.beginPath()
          ctx.strokeStyle = `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${arc.alpha * pulse})`
          ctx.lineWidth = arc.width * k
          ctx.lineCap = 'round'

          for (let j = 0; j <= arc.segments; j++) {
            const t = j / arc.segments
            const angle = baseAngle + t * arc.arcLength
            const r = arc.radius + arc.wobble * Math.sin(angle * 8 + globalT * 3)
            const px = r * Math.cos(angle), py = r * Math.sin(angle)
            const pyT = py * cosT
            const X = px * cosR - pyT * sinR
            const Y = px * sinR + pyT * cosR
            const sx = cx + X * R, sy = cy + Y * R
            if (j === 0) ctx.moveTo(sx, sy)
            else ctx.lineTo(sx, sy)
          }
          ctx.stroke()
        }
        ctx.restore()
      }

      // Magnetic field lines
      if (!ink && L.magneticFieldLines) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = 0.04 + 0.02 * Math.sin(globalT * 0.5)
        const fieldLines = 12
        for (let i = 0; i < fieldLines; i++) {
          const baseAngle = (i / fieldLines) * TAU + globalT * 0.05
          ctx.beginPath()
          const [mr, mg, mb] = L.colorShift ? shiftColor(...L.c0) : L.c0
          ctx.strokeStyle = `rgba(${Math.round(mr)},${Math.round(mg)},${Math.round(mb)},0.15)`
          ctx.lineWidth = 0.5 * k
          for (let j = 0; j <= 60; j++) {
            const t = j / 60
            const r = t * 0.5
            const angle = baseAngle + t * TAU * 0.3
            const px = r * Math.cos(angle), py = r * Math.sin(angle)
            const pyT = py * cosT
            const X = px * cosR - pyT * sinR
            const Y = px * sinR + pyT * cosR
            const sx = cx + X * R, sy = cy + Y * R
            if (j === 0) ctx.moveTo(sx, sy)
            else ctx.lineTo(sx, sy)
          }
          ctx.stroke()
        }
        ctx.restore()
      }

      // Shockwave rings
      if (!ink) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        for (let i = 0; i < shockwaves.length; i++) {
          const sw = shockwaves[i]
          const shockR = sw.t * 0.5 * R
          const fade = Math.max(0, 1 - sw.t / 4)
          const width = (2 + sw.t * 3) * k
          const [sr, sg, sb] = L.colorShift ? shiftColor(...L.c2) : L.c2

          ctx.beginPath()
          ctx.translate(cx, cy)
          ctx.rotate(rollRad)
          ctx.scale(1, cosT)
          ctx.arc(0, 0, shockR, 0, TAU)
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          ctx.strokeStyle = `rgba(${Math.round(sr)},${Math.round(sg)},${Math.round(sb)},${fade * 0.4 * sw.s})`
          ctx.lineWidth = width
          ctx.stroke()

          // Inner bright ring
          ctx.beginPath()
          ctx.translate(cx, cy)
          ctx.rotate(rollRad)
          ctx.scale(1, cosT)
          ctx.arc(0, 0, shockR * 0.95, 0, TAU)
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          ctx.strokeStyle = `rgba(255,255,255,${fade * 0.2 * sw.s})`
          ctx.lineWidth = width * 0.3
          ctx.stroke()
        }
        ctx.restore()
      }

      // Nebula clouds
      if (!ink && L.nebulae.length > 0) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        const nebulae = L.nebulae
        for (let i = 0; i < nebulae.length; i++) {
          const n = nebulae[i]
          const angle = n.angle + n.rotSpeed * globalT
          const pulse = 0.7 + 0.3 * Math.sin(globalT * n.pulseRate + n.pulsePhase)
          const px = n.radius * Math.cos(angle), py = n.radius * Math.sin(angle)
          const pyT = py * cosT
          const X = px * cosR - pyT * sinR
          const Y = px * sinR + pyT * cosR
          const sx = cx + X * R, sy = cy + Y * R
          const cloudR = n.size * R

          let [cr, cg, cb] = n.color
          if (L.colorShift) {
            const shifted = shiftColor(cr, cg, cb);
            cr = shifted[0]; cg = shifted[1]; cb = shifted[2]
          }

          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, cloudR)
          grad.addColorStop(0, `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${n.alpha * pulse})`)
          grad.addColorStop(0.4, `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${n.alpha * pulse * 0.4})`)
          grad.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = grad
          ctx.fillRect(sx - cloudR, sy - cloudR, cloudR * 2, cloudR * 2)
        }
        ctx.restore()
      }

      // Glow + Core + Bloom + Core Rays
      if (!ink && (L.glow > 0 || L.core > 0 || L.coreGlow > 0)) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'

        // Base glow
        if (L.glow > 0) {
          sctx.clearRect(0, 0, small.width, small.height)
          sctx.drawImage(canvas, 0, 0, small.width, small.height)
          ctx.globalAlpha = clamp(L.glow * 0.55, 0, 1)
          ctx.imageSmoothingEnabled = true
          ctx.drawImage(small, 0, 0, bw, bh)
          ctx.globalAlpha = 1
        }

        // Bloom pass
        if (L.bloomIntensity > 0) {
          bctx.clearRect(0, 0, bloom.width, bloom.height)
          bctx.drawImage(canvas, 0, 0, bloom.width, bloom.height)
          ctx.globalAlpha = clamp(L.bloomIntensity * 0.35, 0, 1)
          ctx.filter = 'blur(2px)'
          ctx.drawImage(bloom, 0, 0, bw, bh)
          ctx.filter = 'none'
          ctx.globalAlpha = 1
        }

        // Core glow (enhanced)
        const totalCoreAlpha = Math.min(0.95, 0.35 * L.core * L.coreGlow * corePulseVal * (0.4 + L.glow))
        if (totalCoreAlpha > 0.001) {
          const cR = R * (0.06 + L.coreSize * 5.5)

          let [wr, wg, wb] = L.c1
          if (L.colorShift) {
            const shifted = shiftColor(wr, wg, wb);
            wr = shifted[0]; wg = shifted[1]; wb = shifted[2]
          }
          const brightR = Math.round(wr + (255 - wr) * 0.7)
          const brightG = Math.round(wg + (255 - wg) * 0.7)
          const brightB = Math.round(wb + (255 - wb) * 0.7)

          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate(rollRad)
          ctx.scale(1, 0.5 + 0.5 * cosT)

          // Outer haze
          const haze = ctx.createRadialGradient(0, 0, 0, 0, 0, cR * 2.5)
          haze.addColorStop(0, `rgba(${brightR},${brightG},${brightB},${totalCoreAlpha * 0.3})`)
          haze.addColorStop(0.2, `rgba(${Math.round(wr)},${Math.round(wg)},${Math.round(wb)},${totalCoreAlpha * 0.15})`)
          haze.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = haze
          ctx.fillRect(-cR * 2.5, -cR * 2.5, cR * 5, cR * 5)

          // Inner bright core
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, cR)
          grad.addColorStop(0, `rgba(255,255,255,${totalCoreAlpha * 0.8})`)
          grad.addColorStop(0.1, `rgba(${brightR},${brightG},${brightB},${totalCoreAlpha * 0.7})`)
          grad.addColorStop(0.35, `rgba(${Math.round(wr)},${Math.round(wg)},${Math.round(wb)},${totalCoreAlpha * 0.35})`)
          grad.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = grad
          ctx.fillRect(-cR, -cR, cR * 2, cR * 2)

          // Secondary color core ring
          let [c2r, c2g, c2b] = L.c2
          if (L.colorShift) {
            const shifted = shiftColor(c2r, c2g, c2b);
            c2r = shifted[0]; c2g = shifted[1]; c2b = shifted[2]
          }
          const ringAlpha = totalCoreAlpha * 0.15 * (0.7 + 0.3 * Math.sin(globalT * 1.8))
          const ring = ctx.createRadialGradient(0, 0, cR * 0.4, 0, 0, cR * 1.2)
          ring.addColorStop(0, 'rgba(0,0,0,0)')
          ring.addColorStop(0.4, `rgba(${Math.round(c2r)},${Math.round(c2g)},${Math.round(c2b)},${ringAlpha})`)
          ring.addColorStop(0.7, `rgba(${Math.round(c2r)},${Math.round(c2g)},${Math.round(c2b)},${ringAlpha * 0.3})`)
          ring.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = ring
          ctx.fillRect(-cR * 1.2, -cR * 1.2, cR * 2.4, cR * 2.4)

          ctx.restore()

          // Core rays (light beams emanating from center)
          if (L.coreRays) {
            ctx.save()
            ctx.translate(cx, cy)
            ctx.rotate(rollRad)

            const rayCount = L.coreRayCount
            const rayLength = cR * 3.5
            for (let r = 0; r < rayCount; r++) {
              const rayAngle = (r / rayCount) * TAU + globalT * 0.08
              const rayPulse = 0.4 + 0.6 * Math.sin(globalT * 0.7 + r * 1.3)
              const rayAlpha = totalCoreAlpha * 0.12 * rayPulse

              ctx.save()
              ctx.rotate(rayAngle)
              ctx.scale(1, 0.5 + 0.5 * cosT)

              const rayGrad = ctx.createLinearGradient(0, 0, rayLength, 0)
              rayGrad.addColorStop(0, `rgba(${brightR},${brightG},${brightB},${rayAlpha})`)
              rayGrad.addColorStop(0.15, `rgba(${Math.round(wr)},${Math.round(wg)},${Math.round(wb)},${rayAlpha * 0.5})`)
              rayGrad.addColorStop(1, 'rgba(0,0,0,0)')
              ctx.fillStyle = rayGrad

              const rayWidth = cR * (0.08 + 0.06 * Math.sin(globalT * 1.2 + r * 0.7))
              ctx.beginPath()
              ctx.moveTo(0, -rayWidth)
              ctx.lineTo(rayLength, -rayWidth * 0.1)
              ctx.lineTo(rayLength, rayWidth * 0.1)
              ctx.lineTo(0, rayWidth)
              ctx.closePath()
              ctx.fill()

              ctx.restore()
            }
            ctx.restore()
          }

          // Pulsing core flare (cross pattern)
          if (L.corePulse) {
            ctx.save()
            ctx.translate(cx, cy)
            ctx.rotate(rollRad)
            ctx.scale(1, 0.5 + 0.5 * cosT)

            const flareSize = cR * (1.5 + 0.5 * Math.sin(globalT * 2.3))
            const flareAlpha = totalCoreAlpha * 0.08 * corePulseVal

            // Horizontal flare
            const hFlare = ctx.createLinearGradient(-flareSize, 0, flareSize, 0)
            hFlare.addColorStop(0, 'rgba(0,0,0,0)')
            hFlare.addColorStop(0.5, `rgba(255,255,255,${flareAlpha})`)
            hFlare.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = hFlare
            ctx.fillRect(-flareSize, -cR * 0.04, flareSize * 2, cR * 0.08)

            // Vertical flare
            const vFlare = ctx.createLinearGradient(0, -flareSize, 0, flareSize)
            vFlare.addColorStop(0, 'rgba(0,0,0,0)')
            vFlare.addColorStop(0.5, `rgba(255,255,255,${flareAlpha * 0.6})`)
            vFlare.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = vFlare
            ctx.fillRect(-cR * 0.04, -flareSize, cR * 0.08, flareSize * 2)

            // Diagonal flares
            for (let d = 0; d < 2; d++) {
              ctx.save()
              ctx.rotate(Math.PI / 4 + d * Math.PI / 2)
              const dFlare = ctx.createLinearGradient(-flareSize * 0.6, 0, flareSize * 0.6, 0)
              dFlare.addColorStop(0, 'rgba(0,0,0,0)')
              dFlare.addColorStop(0.5, `rgba(255,255,255,${flareAlpha * 0.3})`)
              dFlare.addColorStop(1, 'rgba(0,0,0,0)')
              ctx.fillStyle = dFlare
              ctx.fillRect(-flareSize * 0.6, -cR * 0.02, flareSize * 1.2, cR * 0.04)
              ctx.restore()
            }

            ctx.restore()
          }
        }

        ctx.restore()
      }

      // Circular orbit guide rings (very subtle)
      if (!ink) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        const orbitRings = [0.15, 0.25, 0.4, 0.55]
        for (let i = 0; i < orbitRings.length; i++) {
          const ringR = orbitRings[i] * R
          const ringAlpha = 0.015 + 0.01 * Math.sin(globalT * 0.3 + i)

          ctx.beginPath()
          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate(rollRad)
          ctx.scale(1, cosT)
          ctx.arc(0, 0, ringR, 0, TAU)
          ctx.restore()

          let [cr, cg, cb] = L.c0
          if (L.colorShift) {
            const shifted = shiftColor(cr, cg, cb);
            cr = shifted[0]; cg = shifted[1]; cb = shifted[2]
          }

          ctx.strokeStyle = `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${ringAlpha})`
          ctx.lineWidth = 0.5 * k
          ctx.setLineDash([4 * k, 8 * k])
          ctx.lineDashOffset = globalT * 20
          ctx.stroke()
          ctx.setLineDash([])
        }
        ctx.restore()
      }

      if (!frozen || busy) scheduleFrame?.()
    }

    scheduleFrame = () => {
      if (!raf) raf = window.requestAnimationFrame(frame)
    }
    wakeFrameRef.current = scheduleFrame
    scheduleFrame()

    return () => {
      wakeFrameRef.current = null
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
      {children ? (
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          {children}
        </div>
      ) : null}
    </div>
  )
})

export default BinaryOrbits
