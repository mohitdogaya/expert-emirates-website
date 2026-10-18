import { useEffect, useRef } from 'react'

const makeRays = (width, height) =>
  Array.from({ length: Math.max(18, Math.round(width / 48)) }, () => {
    const length = 95 + Math.random() * 190
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      length,
      width: 0.5 + Math.random() * 1.2,
      speed: 24 + Math.random() * 46,
      phase: Math.random() * Math.PI * 2,
      fan: 24 + Math.random() * 72,
    }
  })

function FallingRays() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const state = { width: 0, height: 0, dpr: 1, rays: [], time: 0, last: 0 }
    let frameId = 0
    let visible = true

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      state.width = rect.width
      state.height = rect.height
      state.dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(state.width * state.dpr))
      canvas.height = Math.max(1, Math.round(state.height * state.dpr))
      state.rays = makeRays(state.width, state.height)
      draw(0)
    }

    const draw = delta => {
      const { width, height, dpr, rays } = state
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)
      state.time += delta

      rays.forEach(ray => {
        const y = ((ray.y + state.time * ray.speed) % (height + ray.length)) - ray.length
        const pulse = 0.45 + 0.35 * (0.5 + 0.5 * Math.sin(state.time * 1.2 + ray.phase))
        const trail = context.createLinearGradient(ray.x, y, ray.x, y + ray.length)
        trail.addColorStop(0, 'rgba(242, 201, 76, 0)')
        trail.addColorStop(0.62, `rgba(242, 201, 76, ${pulse * 0.12})`)
        trail.addColorStop(0.88, `rgba(255, 232, 159, ${pulse * 0.42})`)
        trail.addColorStop(1, 'rgba(255, 246, 211, 0)')
        context.fillStyle = trail
        context.fillRect(ray.x - ray.width / 2, y, ray.width, ray.length)

        const fanY = y + ray.length * 0.88
        const fanGradient = context.createLinearGradient(ray.x, fanY, ray.x, fanY + ray.fan)
        fanGradient.addColorStop(0, `rgba(242, 201, 76, ${pulse * 0.18})`)
        fanGradient.addColorStop(1, 'rgba(242, 201, 76, 0)')
        context.strokeStyle = fanGradient
        context.lineWidth = 0.7
        context.beginPath()
        context.moveTo(ray.x, fanY)
        context.lineTo(ray.x - ray.fan * 0.32, fanY + ray.fan)
        context.moveTo(ray.x, fanY)
        context.lineTo(ray.x + ray.fan * 0.32, fanY + ray.fan)
        context.stroke()
      })
    }

    const animate = now => {
      frameId = 0
      if (!visible || document.hidden) return
      const delta = state.last ? Math.min((now - state.last) / 1000, 0.05) : 0
      state.last = now
      draw(reducedMotion ? 0 : delta)
      if (!reducedMotion) frameId = requestAnimationFrame(animate)
    }

    const wake = () => {
      state.last = 0
      if (!frameId && visible && !document.hidden) frameId = requestAnimationFrame(animate)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting)
      if (visible) wake()
      else {
        cancelAnimationFrame(frameId)
        frameId = 0
      }
    })
    intersection.observe(canvas)
    document.addEventListener('visibilitychange', wake)
    resize()
    wake()

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', wake)
    }
  }, [])

  return <canvas ref={canvasRef} className="falling-rays-canvas" aria-hidden="true" />
}

export default FallingRays
