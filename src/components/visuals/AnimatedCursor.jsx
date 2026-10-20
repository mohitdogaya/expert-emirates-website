import { useEffect, useRef } from 'react'

function AnimatedCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const finePointer = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!cursor || !finePointer.matches) return undefined

    let frame = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let targetX = x
    let targetY = y

    const move = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      cursor.classList.add('is-visible')
      if (!frame) frame = requestAnimationFrame(animate)
    }

    const animate = () => {
      x += (targetX - x) * 0.22
      y += (targetY - y) * 0.22
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.2) {
        frame = requestAnimationFrame(animate)
      } else {
        frame = 0
      }
    }

    const setHover = (event) => {
      const target = event.target instanceof Element ? event.target : null
      cursor.classList.toggle('is-hovering', Boolean(target?.closest('a, button, input, textarea, select, [role="button"]')))
    }
    const hide = () => cursor.classList.remove('is-visible')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', setHover, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', setHover)
      document.documentElement.removeEventListener('pointerleave', hide)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div className="animated-cursor" ref={cursorRef} aria-hidden="true"><span /></div>
}

export default AnimatedCursor
