import { useEffect, useRef, useState } from 'react'
import Lightning from './Lightning.jsx'

const randomAt = (a, b) => {
  const value = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return value - Math.floor(value)
}

function createParticles() {
  const particles = []
  for (let index = 0; index < 640; index += 1) {
    particles.push({
      key: index,
      x: 36 + randomAt(index, 1) * 1528,
      y: randomAt(index, 2) * 6400,
      radius: 0.8 + randomAt(index, 3) * 2.7,
      opacity: 0.2 + randomAt(index, 4) * 0.6,
      fallDelay: -(randomAt(index, 5) * 6),
      fallDuration: 3.2 + randomAt(index, 6) * 3.8,
    })
  }

  return particles
}

const particles = createParticles()

function LightningBackground({ sections = [], excludedSections = [] }) {
  const backgroundRef = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const background = backgroundRef.current
    if (!background) return undefined

    const getTargets = (selectors) => selectors.flatMap((selector) => {
      try {
        return Array.from(document.querySelectorAll(selector))
      } catch {
        return []
      }
    })
    const allowedTargets = getTargets(sections)
    const excludedTargets = getTargets(excludedSections)
    const targets = [...new Set([...allowedTargets, ...excludedTargets])]

    if (!allowedTargets.length) {
      setActive(false)
      return undefined
    }

    const visibleTargets = new Set()
    const updateActive = () => {
      const sectionVisible = allowedTargets.some((target) => visibleTargets.has(target))
      const excludedVisible = excludedTargets.some((target) => visibleTargets.has(target))
      setActive(sectionVisible && !excludedVisible)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleTargets.add(entry.target)
        else visibleTargets.delete(entry.target)
      })
      updateActive()
    }, { threshold: 0.01 })
    targets.forEach((target) => observer.observe(target))

    let scrollTimer
    const onScroll = () => {
      if (!background.classList.contains('is-active')) return
      background.classList.add('is-scrolling')
      window.clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => background.classList.remove('is-scrolling'), 160)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(scrollTimer)
    }
  }, [sections, excludedSections])

  return (
    <div
      ref={backgroundRef}
      className={`lightning-background${active ? ' is-active' : ''}`}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <svg className="landing-rain-art" viewBox="0 0 1600 6400" preserveAspectRatio="none" focusable="false">
        <defs>
          <radialGradient id="gold-particle">
            <stop offset="0%" stopColor="#fff6c8" />
            <stop offset="38%" stopColor="#f4d45a" />
            <stop offset="100%" stopColor="#a9780c" />
          </radialGradient>
        </defs>
        <g className="landing-rain-particles" fill="url(#gold-particle)">
          {particles.map((particle) => (
            <circle
              key={particle.key}
              className="landing-particle-fall"
              cx={particle.x.toFixed(1)}
              cy={particle.y.toFixed(1)}
              r={particle.radius.toFixed(1)}
              opacity={particle.opacity.toFixed(2)}
              style={{ '--fall-delay': `${particle.fallDelay.toFixed(2)}s`, '--fall-duration': `${particle.fallDuration.toFixed(2)}s` }}
            />
          ))}
        </g>
      </svg>
      <Lightning
        color="#eab308"
        bolts={1}
        spread={0.6}
        branches={0.5}
        xOffset={0}
        angle={-10}
        size={1}
        thickness={1}
        glow={0.7}
        intensity={0.6}
        speed={0.8}
        flicker={0.6}
        mouseInteraction
        mouseStrength={1}
        clickStrike
        intro
        fade={0}
        opacity={0.04}
        lightMode={false}
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: 'transparent' }}
      />
    </div>
  )
}

export default LightningBackground
