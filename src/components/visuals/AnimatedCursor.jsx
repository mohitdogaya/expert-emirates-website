import { useEffect, useRef } from 'react'

const TRAIL_LIFETIME = 980
const MAX_POINTS = 72

function AnimatedCursor() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const finePointer = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!canvas || !finePointer.matches) return undefined

    const context = canvas.getContext('2d')
    const points = []
    let frame = 0
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(window.innerWidth * pixelRatio)
      canvas.height = Math.round(window.innerHeight * pixelRatio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const draw = (now) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      while (points.length && now - points[0].time > TRAIL_LIFETIME) points.shift()

      context.globalCompositeOperation = 'lighter'
      context.lineCap = 'round'
      context.lineJoin = 'round'

      if (points.length > 1) {
        const first = points[0]
        const last = points[points.length - 1]
        const tubeGradient = context.createLinearGradient(first.x, first.y, last.x, last.y)
        tubeGradient.addColorStop(0, 'rgba(151, 97, 8, 0)')
        tubeGradient.addColorStop(.28, 'rgba(202, 139, 20, .42)')
        tubeGradient.addColorStop(.68, 'rgba(250, 207, 67, .92)')
        tubeGradient.addColorStop(1, 'rgba(255, 249, 206, 1)')

        const drawTubePath = (offset, phase = 0) => {
          const pathPoints = points.map((point, index) => {
            const previous = points[Math.max(0, index - 1)]
            const next = points[Math.min(points.length - 1, index + 1)]
            const dx = next.x - previous.x
            const dy = next.y - previous.y
            const length = Math.hypot(dx, dy) || 1
            const wave = Math.sin(index * .22 - now * .0012 + phase) * (offset === 0 ? .55 : .9)
            const distance = offset + wave
            return { x: point.x - (dy / length) * distance, y: point.y + (dx / length) * distance }
          })

          context.beginPath()
          context.moveTo(pathPoints[0].x, pathPoints[0].y)
          for (let index = 1; index < pathPoints.length - 1; index += 1) {
            const point = pathPoints[index]
            const next = pathPoints[index + 1]
            context.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2)
          }
          const end = pathPoints[pathPoints.length - 1]
          context.lineTo(end.x, end.y)
          context.stroke()
        }

        // Soft outer glow, a satin gold body, and two fine highlights create a tube-like surface.
        context.globalAlpha = .38
        context.strokeStyle = tubeGradient
        context.lineWidth = 19
        context.shadowColor = 'rgba(255, 191, 36, .82)'
        context.shadowBlur = 25
        drawTubePath(0)

        context.globalAlpha = .9
        context.lineWidth = 8
        context.shadowColor = 'rgba(255, 222, 100, .9)'
        context.shadowBlur = 12
        drawTubePath(0)

        context.globalAlpha = .7
        context.strokeStyle = 'rgba(255, 250, 218, .95)'
        context.lineWidth = 2.2
        context.shadowBlur = 5
        drawTubePath(-2.2, .7)
        drawTubePath(2.2, 2.1)
      }

      context.globalAlpha = 1
      context.globalCompositeOperation = 'source-over'
      context.shadowBlur = 0

      if (points.length > 1) frame = requestAnimationFrame(draw)
      else frame = 0
    }

    const handleMove = (event) => {
      const last = points[points.length - 1]
      const distance = last ? Math.hypot(event.clientX - last.x, event.clientY - last.y) : Infinity
      if (last && distance < 2.5) return

      if (last && distance > 4) {
        const steps = Math.ceil(distance / 4)
        for (let step = 1; step < steps; step += 1) {
          const ratio = step / steps
          points.push({
            x: last.x + (event.clientX - last.x) * ratio,
            y: last.y + (event.clientY - last.y) * ratio,
            time: performance.now(),
          })
        }
      }

      points.push({ x: event.clientX, y: event.clientY, time: performance.now() })
      if (points.length > MAX_POINTS) points.splice(0, points.length - MAX_POINTS)
      if (!frame) frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handleMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas className="tube-cursor-canvas" ref={canvasRef} aria-hidden="true" />
}

export default AnimatedCursor
